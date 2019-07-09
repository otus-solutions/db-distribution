const {exec} = require('child_process');
const mongoose = require('mongoose');
const fs = require('fs');


module.exports = function (application) {
    const Response = application.app.utils.Response;
    const StaticDatabase = application.app.models.StaticDatabase;
    const {
        MONGO_USERNAME,
        MONGO_PASSWORD,
        MONGO_HOSTNAME,
        MONGO_PORT
    } = process.env;

    return {
        async uploadDatabase(databaseCSV) {

            let endImportCSV = new Promise(function (resolve, reject) {
                exec('mongoimport -d database-distribution -c current_variables --type json --host '+MONGO_HOSTNAME+':'+MONGO_PORT+' --file ' + databaseCSV.path + ' --numInsertionWorkers 6 --jsonArray -u '+MONGO_USERNAME+' -p '+MONGO_PASSWORD+'  --authenticationDatabase admin', (err) => {
                    fs.unlinkSync(databaseCSV.path);
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });

            });

            let aggregation = new Promise(async function (resolve, reject) {
                endImportCSV.then(async () => {
                    StaticDatabase.correctCurrentVariables().then((dbPromises) => {
                        resolve(dbPromises)
                    }).catch((err) => {
                        reject(err)
                    })
                }).catch((err) => {
                    reject(err)
                });
            });

            return await aggregation.then(async (dbPromises) => {
                return await Promise.all(dbPromises)
                    .then(() => {
                        return Response.success()
                    })
                    .catch((err) => {
                        throw err
                    });
            }).catch((err) => {
                console.log(err);
                throw Response.internalServerError();
            });

        }
    };
};

