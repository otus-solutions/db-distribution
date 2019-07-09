const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

module.exports = function(application) {
    const StaticDatabaseController = application.app.controllers.StaticDatabaseController;
    const Response = application.app.utils.Response;

    let uploadedFiles = upload.fields([{ name: 'databaseJson' }]);
    application.post('/api/DB', uploadedFiles ,async function(req, res) {
        res.setTimeout(0);
        res.header('Content-Type', 'application/json');
        try {
            let databaseJson = await StaticDatabaseController.validateDatabaseFile(req.files);
            let result = await StaticDatabaseController.uploadDatabase(databaseJson);
            res.status(result.code).send(result.body);
        } catch (e){
            res.status(e.code).send(e.body);
        }
    });
};
