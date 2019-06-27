module.exports = function (application) {
    const StaticDatabaseService = application.app.services.StaticDatabaseService;
    return{
        async uploadDatabase(databaseCSV, variableTypeCorrelationCSV) {
            return await StaticDatabaseService.uploadDatabase(databaseCSV, variableTypeCorrelationCSV).then(tableID=>{
                return tableID;
            }).catch(err=>{
                throw err;
            });
        },
    };
};
