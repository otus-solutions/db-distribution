const csv = require('csvtojson');
const mongoose = require('mongoose');

module.exports = function (application){
    const Response = application.app.utils.Response;

    return {
        async uploadDatabase(databaseCSV, variableTypeCorrelationCSV){
            let StaticDatabaseVariable = mongoose.model("static-database-variable");
            let typeCorrelationMap = new Map();

            let dataBaseJson = await csv().fromString(databaseCSV.buffer.toString());
            let CorrelationJson = await csv().fromString(variableTypeCorrelationCSV.buffer.toString());

            let variablesNotFound = [];
            CorrelationJson.forEach(variable => {
                typeCorrelationMap.set(variable.ID,variable.TYPE);
                if(dataBaseJson[0][variable.ID] === undefined){
                    variablesNotFound.push(variable.ID);
                }
            });

            if (variablesNotFound.length > 0){
                throw Response.notAcceptable({data:{variablesNotFoundInDataBase:variablesNotFound}});
            }

            let databaseVariables = [];
            let sendingDate = new Date();
            dataBaseJson.forEach(function (participantVariables) {
                CorrelationJson.forEach(function (variable) {
                    let valueFound = participantVariables[variable.ID];
                    if(valueFound !== ""){
                        for(let i=0;i<1000;i++){
                            databaseVariables.push({
                                elementId:participantVariables.id,
                                variableId:variable.ID,
                                uploadDate:sendingDate,
                                value:participantVariables[variable.ID],
                                type:typeCorrelationMap.get(variable.ID)
                            });
                        }
                    }
                })
            });

            return await StaticDatabaseVariable.saveVariables(databaseVariables).then(result => {
                return Response.success({message:"Database uploaded"})
            }).catch(err => {
                throw Response.internalServerError()
            })
        }
    };
};

