module.exports = function (application) {
    const StaticDatabaseService = application.app.services.StaticDatabaseService;
    const VariableTypeCorrelationService = application.app.services.VariableTypeCorrelationService;
    return{
        getVariables(acronym, id, version) {
            return StaticDatabaseService.getVariables(acronym, id, version);
        },
        uploadDatabase(databaseJson) {
            return StaticDatabaseService.uploadDatabase(databaseJson);
        },
        uploadVariableTypeCorrelation(variableTypeCorrelationJson) {
            return VariableTypeCorrelationService.uploadVariableTypeCorrelation(variableTypeCorrelationJson);
        }
    };
};
