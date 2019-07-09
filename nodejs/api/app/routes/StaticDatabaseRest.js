const path = require('path');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

module.exports = function(application) {
    const StaticDatabaseController = application.app.controllers.StaticDatabaseController;

    let uploadedFiles = upload.fields([{ name: 'databaseJson' }]);
    application.post('/api/DB', uploadedFiles ,async function(req, res) {
        res.setTimeout(0);
        res.header('Content-Type', 'application/json');

        if(!req.files.databaseJson){
            res.status(406).send({data:"The field databaseJson is required"})
        } else if(path.extname(req.files.databaseJson[0].originalname) !== ".json"){
            res.status(406).send({data:"Invalid File Type. Only JSON files are allowed"})
        } else {
            StaticDatabaseController.uploadDatabase(req.files.databaseJson[0]).then((result) => {
                res.status(result.code).send(result.body);
            }).catch((err) => {
                res.status(err.code).send(err.body);
            });
        }
    });
};
