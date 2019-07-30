module.exports = function (application) {
    const StaticDatabaseService = application.app.services.StaticDatabaseService;
    const VariableTypeCorrelationService = application.app.services.VariableTypeCorrelationService;
    return{
        getVariables(identification, variables) {
            return StaticDatabaseService.getVariables(identification, variables);
        },
        uploadDatabase(databaseJson) {
            return StaticDatabaseService.uploadDatabase(databaseJson);
        },
        uploadVariableTypeCorrelation(variableTypeCorrelationJson) {
            return VariableTypeCorrelationService.uploadVariableTypeCorrelation(variableTypeCorrelationJson);
        }
    };
};
