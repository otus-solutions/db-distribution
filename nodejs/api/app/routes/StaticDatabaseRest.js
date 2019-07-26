const multer  = require('multer');
const { body, buildSanitizeFunction, validationResult } = require('express-validator');
const sanitizeBody = buildSanitizeFunction(['body']);
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const upload = multer({ dest: 'uploads/' });

module.exports = function(application) {
    const StaticDatabaseController = application.app.controllers.StaticDatabaseController;
    const { validateFileContainer } = application.app.utils.Utils;

    let uploadedDatabaseFile = upload.fields([{ name: 'databaseJson' }]);
    application.post('/api/upload/database', uploadedDatabaseFile ,async function(req, res) {
        res.setTimeout(0);
        res.header('Content-Type', 'application/json');
        try {
            let databaseJson = await validateFileContainer(req.files.databaseJson, ".json");
            let result = await StaticDatabaseController.uploadDatabase(databaseJson);
            res.status(result.code).send(result.body);
        } catch (e){
            res.status(e.code).send(e.body);
        }
    });

    let uploadedCorrelationFile = upload.fields([{ name: 'variableTypeCorrelationJson' }]);
    application.post('/api/upload/variable-type-correlation', uploadedCorrelationFile ,async function(req, res) {
        res.setTimeout(0);
        res.header('Content-Type', 'application/json');
        try {
            let variableTypeCorrelationJson = await validateFileContainer(req.files.variableTypeCorrelationJson, ".json");
            let result = await StaticDatabaseController.uploadVariableTypeCorrelation(variableTypeCorrelationJson);
            res.status(result.code).send(result.body);
        } catch (e){
            res.status(e.code).send(e.body);
        }
    });

    application.post('/api/variables', jsonParser ,[
        body('variables').custom(value => {
            let error = false;
            value.forEach(variable=>{
                if(!variable.name || !variable.sending){
                    error = true;
                }
            });
            if (error){
                return Promise.reject();
            } else {
                return Promise.resolve();
            }
        }),
        sanitizeBody('variables').customSanitizer((value, { req }) => {
            let correctedArray = [];
            let resultErrors = validationResult(req);
            if(resultErrors.errors.length === 0){
                value.forEach(variable=>{
                    correctedArray.push({
                        name: variable.name.toString(),
                        sending: variable.sending.toString(),
                    })
                });
            }
            return correctedArray;
        }),
        sanitizeBody('identification').customSanitizer((value, { req }) => {
            if(value) {
                return value.toString();
            }
        }),
        body('identification').isString()
    ], async function(req, res) {
        res.header('Content-Type', 'application/json');
        let validation = validationResult(req);
        if (validation.errors.length > 0){
            res.status(406).send({data:"There are invalid fields in the request"});
        } else {
            try {
                let result = await StaticDatabaseController.getVariables(req.body.identification,req.body.variables);
                res.status(result.code).send(result.body);
            } catch (e){
                res.status(e.code).send(e.body);
            }
        }
    });

};
