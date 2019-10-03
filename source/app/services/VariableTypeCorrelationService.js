const fs = require('fs');
module.exports = function (application) {
    const Response = application.app.utils.Response;
    const VariableTypeCorrelation = application.app.models.VariableTypeCorrelation;

    return {
        uploadVariableTypeCorrelation: async function (variableTypeCorrelationJson) {
            let promises = [];
            let buffer = fs.readFileSync(variableTypeCorrelationJson.path);
            let parsedJson = JSON.parse(buffer);

            let correlationLength = parsedJson.length;
            for (let i = 0; i < correlationLength; i++) {
                promises.push(VariableTypeCorrelation.updateVariableTypeCorrelation(parsedJson[i]))
            }

            try {
                fs.unlinkSync(variableTypeCorrelationJson.path);
                await Promise.all(promises);
                return Response.success();
            } catch (e) {
                throw Response.internalServerError();
            }
        }
    };
};

