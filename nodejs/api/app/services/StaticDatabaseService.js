const {exec} = require('child_process');
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
        uploadDatabase: async function (databaseCSV) {
            let endImport = new Promise(function (resolve, reject) {
                exec('mongoimport -d database-distribution -c current_variables --type json --host ' + MONGO_HOSTNAME + ':' + MONGO_PORT + ' --file ' + databaseCSV.path + ' --numInsertionWorkers 6 --jsonArray -u ' + MONGO_USERNAME + ' -p ' + MONGO_PASSWORD + '  --authenticationDatabase admin',
                    async (err) => {
                        fs.unlinkSync(databaseCSV.path);
                        if (err) {
                            reject(err);
                        } else {
                            try {
                                let dbPromises = await StaticDatabase.correctCurrentVariables();
                                await Promise.all(dbPromises);
                                resolve();
                            } catch (e) {
                                console.log(e);
                                reject(e);
                            }
                        }
                    });
            });

            return endImport.then(()=>{
                return Response.success();
            }).catch((e)=>{
                console.log(e);
                throw Response.internalServerError();
            });
        },
        getVariables:async function (identification, variables) {
            try {
                let foundVariables = await StaticDatabase.getVariables(identification, variables);
                return Response.success({variables:foundVariables} )
            } catch (e) {
                console.log(e);
                throw Response.internalServerError();
            }
        }
    };
};

