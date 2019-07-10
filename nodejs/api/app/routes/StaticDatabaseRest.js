const multer  = require('multer');
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

};
