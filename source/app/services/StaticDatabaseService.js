const {exec} = require('child_process');
const fs = require('fs');

module.exports = function (application) {
    const Response = application.app.utils.Response;
    const StaticDatabase = application.app.models.StaticDatabase;

    const {
        DATABASE_USER,
        DATABASE_PASSWORD,
        DATABASE_HOSTNAME,
        DATABASE_PORT
    } = process.env;

    return {
        uploadDatabase: async function (databaseCSV) {
            let endImport = new Promise(function (resolve, reject) {
                exec('mongoimport -d db-distribution -c current_variables --type json --host ' + DATABASE_HOSTNAME + ':' + DATABASE_PORT + ' --file ' + databaseCSV.path + ' --numInsertionWorkers 6 --jsonArray -u ' + DATABASE_USER + ' -p ' + DATABASE_PASSWORD + '  --authenticationDatabase db-distribution',
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

            return endImport.then(() => {
                return Response.success();
            }).catch((e) => {
                console.log(e);
                throw Response.internalServerError();
            });
        },
        getVariables: async function (identification, variables) {
            try {
                let foundVariables = await StaticDatabase.getVariables(identification, variables);
                return Response.success({variables: foundVariables})
            } catch (e) {
                console.log(e);
                throw Response.internalServerError();
            }
        }
    };
};