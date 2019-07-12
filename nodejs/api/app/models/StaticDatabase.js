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
                    $sort: {id: 1, variable: 1, uploadDate: 1}
                },
                {
                    $group: {
                        _id: {variable: '$variable', id: '$id'},
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
                                'identification': '$oldValues.id',
                                'variable': '$oldValues.variable',
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
