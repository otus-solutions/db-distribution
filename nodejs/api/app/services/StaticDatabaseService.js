const { exec } = require('child_process');
const mongoose = require('mongoose');
const fs = require('fs');


module.exports = function (application){
    const Response = application.app.utils.Response;
    const Stati = mongoose.model("static-database-variable");

    return {
        async uploadDatabase(databaseCSV, variableTypeCorrelationCSV){

            let endImportCSV = new Promise(function(resolve, reject) {
                exec('mongoimport -d database-distribution -c current_variables --type json --host otus-db-distribuition-database:27017 --file '+databaseCSV.path+' --numInsertionWorkers 6 --jsonArray -u root -p XRYs9yjU  --authenticationDatabase admin', (err, stdout, stderr) => {
                    if (err) {
                        reject(err);
                        console.error(`exec error: ${err}`);
                        return;
                    }
                    fs.unlinkSync(databaseCSV.path);
                    fs.unlinkSync(variableTypeCorrelationCSV.path);
                    resolve();
                    console.log(`stdout: ${stdout}`);
                    console.log(`stderr: ${stderr}`);
                });

            });

            let aggregation = new Promise(async function(resolve, reject) {
                endImportCSV.then(async()=>{
                    let db = mongoose.connection.db;
                    let promises = [];
                    let currentVariablesCollection = db.collection("current_variables");
                    currentVariablesCollection.aggregate([
                            {
                                $addFields: {
                                    uploadDate: {$toDate: "$_id"}
                                }
                            },
                            {
                                $sort: {id: 1, variable: 1, uploadDate: 1}
                            },
                            {
                                $group: {
                                    _id: {variable: "$variable", id: "$id"},
                                    oldValues: {$push: "$$ROOT"}
                                }
                            },
                            {
                                $match: {oldValues: {$not: {$size: 1}}}
                            },
                            {
                                $project: {
                                    oldValues: {
                                        $slice: [
                                            "$oldValues",
                                            0,
                                            {
                                                "$subtract": [
                                                    {
                                                        "$size": "$oldValues"
                                                    },
                                                    1
                                                ]
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $unwind: "$oldValues"
                            },
                            {
                                $group: {
                                    _id: "$_id.id",
                                    removeOldVariables: {$push: "$oldValues._id"},
                                    insertOldVariables: {
                                        $push: {
                                            "_id": "$oldValues._id",
                                            "identification": "$oldValues.id",
                                            "variable": "$oldValues.variable",
                                            "value": "$oldValues.value",
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
                            let oldVariables = db.collection("old_variables");
                            result.toArray(async (toArrayErr, docs) => {
                                if (toArrayErr) reject(toArrayErr);
                                let removeBatch = [];
                                let insertBatch = [];
                                let docsLength = docs.length;
                                for (let i = 0; i < docs.length; i++) {
                                    removeBatch = removeBatch.concat(docs[i].removeOldVariables);
                                    insertBatch = insertBatch.concat(docs[i].insertOldVariables);
                                    if (removeBatch.length > 100000 || i === docsLength-1) {
                                        promises.push(currentVariablesCollection.deleteMany({_id:{$in:removeBatch}}));
                                        promises.push(oldVariables.insertMany(insertBatch));
                                        removeBatch = [];
                                        insertBatch = [];
                                    }
                                }
                                resolve(promises);
                            })
                        });
                }).catch((err)=>{
                    reject(err)
                });
            });

            return await aggregation.then(async (promises)=>{
                return await Promise.all(promises)
                    .then(() => {
                        return Response.success()
                    })
                    .catch((err) => {
                        throw Response.internalServerError()
                    });
            }).catch((err)=>{
                throw Response.internalServerError();
            });
        }
    };
};

