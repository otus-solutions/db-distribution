module.exports = function (application) {
    const StaticDatabaseService = application.app.services.StaticDatabaseService;
    return{
        uploadDatabase(databaseCSV, variableTypeCorrelationCSV) {
            return StaticDatabaseService.uploadDatabase(databaseCSV, variableTypeCorrelationCSV);
        },
        validateDatabaseFile(fileContainer) {
            return StaticDatabaseService.validateFileContainer(fileContainer);
        }
    };
};
