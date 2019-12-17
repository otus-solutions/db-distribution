const mongoose = require('mongoose');

module.exports.correctCurrentVariables = () => {
    let db = mongoose.connection.db;
    let promises = [];
    let currentVariablesCollection = db.collection('current_variables');
    return new Promise(function (resolve, reject) {
        currentVariablesCollection.aggregate([
                {
                    $addFields: {
                        uploadDate: {$toDate: '$_id'}
                    }
                },
                {
                    $sort: {id: 1, name: 1, uploadDate: 1}
                },
                {
                    $group: {
                        _id: {name: '$name', identification: '$identification'},
                        oldValues: {$push: '$$ROOT'}
                    }
                },
                {
                    $match: {oldValues: {$not: {$size: 1}}}
                },
                {
                    $project: {
                        oldValues: {
                            $slice: [
                                '$oldValues',
                                0,
                                {
                                    '$subtract': [
                                        {
                                            '$size': '$oldValues'
                                        },
                                        1
                                    ]
                                }
                            ]
                        }
                    }
                },
                {
                    $unwind: '$oldValues'
                },
                {
                    $group: {
                        _id: '$_id',
                        removeOldVariables: {$push: '$oldValues._id'},
                        insertOldVariables: {
                            $push: {
                                '_id': '$oldValues._id',
                                'identification': '$oldValues.identification',
                                'name': '$oldValues.name',
                                'sending': '$oldValues.sending',
                                'value': '$oldValues.value',
                            }
                        }
                    }
                }
            ],
            {
                allowDiskUse: true
            },
            (err, result) => {
                if (err) reject(err);
                let oldVariables = db.collection('old_variables');
                result.toArray(async (toArrayErr, docs) => {
                    if (toArrayErr) {
                        reject(toArrayErr);
                    } else {
                        let removeBatch = [];
                        let insertBatch = [];
                        let docsLength = docs.length;
                        for (let i = 0; i < docs.length; i++) {
                            removeBatch = removeBatch.concat(docs[i].removeOldVariables);
                            insertBatch = insertBatch.concat(docs[i].insertOldVariables);
                            if (removeBatch.length > 100000 || i === docsLength - 1) {
                                promises.push(currentVariablesCollection.deleteMany({_id: {$in: removeBatch}}));
                                promises.push(oldVariables.insertMany(insertBatch));
                                removeBatch = [];
                                insertBatch = [];
                            }
                        }
                        resolve(promises);
                    }
                })
            });
    });
};

module.exports.getVariables = async (identification, variables) => {
    let getCurrentVariables = this.getCurrentVariables;
    let getOldVariables = this.getOldVariables;
    return new Promise(async function (resolve, reject) {
        try {
            let variableNames = [];
            variables.forEach(variables => {
                variableNames.push(variables.name)
            });
            let currentVariablesResult = await getCurrentVariables(identification, variables, variableNames);
            let notFoundInCurrent = [];
            variables.forEach(variable => {
                let found = currentVariablesResult.filter(currentFound => {
                    return currentFound.name === variable.name
                });
                if (found.length === 0) {
                    notFoundInCurrent.push(variable)
                }
            });

            if (notFoundInCurrent.length > 0) {
                variableNames = [];
                notFoundInCurrent.forEach(variables => {
                    variableNames.push(variables.name)
                });
                let oldVariablesResult = await getOldVariables(identification, notFoundInCurrent, variableNames);
                resolve(currentVariablesResult.concat(oldVariablesResult));
            } else {
                resolve(currentVariablesResult)
            }
        } catch (e) {
            reject(e)
        }
    });
};

module.exports.getCurrentVariables = (identification, variables, variableNames) => {
    let db = mongoose.connection.db;
    let currentVariablesCollection = db.collection('current_variables');
    return new Promise(function (resolve, reject) {
        currentVariablesCollection.aggregate([
                {
                    $match: {identification: identification, name: {$in: variableNames}}
                },
                {
                    $project: {
                        _id:0,
                        identification:0
                    }
                },
                {
                    $group: {_id: '', allVariables: {$push: '$$ROOT'}}
                },
                {
                    $addFields: {variables: variables}
                },
                {
                    $unwind: '$variables'
                },
                {
                    $addFields: {
                        foundVariable: {
                            $filter: {
                                input: '$allVariables',
                                as: 'item',
                                cond: {
                                    $and: [
                                        {$eq: ['$$item.name', '$variables.name']},
                                        {$eq: ['$$item.sending', '$variables.sending']}
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: '',
                        foundVariables: {
                            $push: {
                                $arrayElemAt: ['$foundVariable', 0]
                            }
                        }
                    }
                }
            ],
            {
                allowDiskUse: true
            },
            (err, result) => {
                if (err) reject(err);
                result.toArray(async (toArrayErr, docs) => {
                    if (toArrayErr) {
                        reject(toArrayErr);
                    } else {
                        if (docs.length > 0){
                            resolve(docs[0].foundVariables);
                        } else {
                            resolve([])
                        }
                    }
                })
            });
    });
};

module.exports.getOldVariables = (identification, variables, variableNames) => {
    let db = mongoose.connection.db;
    let oldVariablesCollection = db.collection('old_variables');
    return new Promise(function (resolve, reject) {
        oldVariablesCollection.aggregate([
                {
                    $match: {identification: identification, name: {$in: variableNames}}
                },
                {
                    $addFields: {
                        sendingDate: {$toDate: '$_id'}
                    }
                },
                {
                    $sort: {'sendingDate': -1}
                },
                {
                    $project: {
                        _id:0,
                        sendingDate:0,
                        identification:0
                    }
                },
                {
                    $group: {_id: '', allVariables: {$push: '$$ROOT'}}
                },
                {
                    $addFields: {variables: variables}
                },
                {
                    $unwind: '$variables'
                },
                {
                    $addFields: {
                        foundVariable: {
                            $filter: {
                                input: '$allVariables',
                                as: 'item',
                                cond: {
                                    $and: [
                                        {$eq: ['$$item.name', '$variables.name']},
                                        {$eq: ['$$item.sending', '$variables.sending']}
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: '',
                        foundVariables: {
                            $push: {
                                $arrayElemAt: ['$foundVariable', 0]
                            }
                        }
                    }
                }
            ],
            {
                allowDiskUse: true
            },
            (err, result) => {
                if (err) reject(err);
                result.toArray(async (toArrayErr, docs) => {
                    if (toArrayErr) {
                        reject(toArrayErr);
                    } else {
                        if (docs.length > 0){
                            resolve(docs[0].foundVariables);
                        } else {
                            resolve([])
                        }
                    }
                })
            });
    });
};


