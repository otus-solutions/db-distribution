const path = require('path');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

module.exports = function(application) {
    const StaticDatabaseController = application.app.controllers.StaticDatabaseController;

    let uploadedFiles = upload.fields([{ name: 'dataBase' }, { name: 'variableTypeCorrelation' }]);
    application.post('/api/DB', uploadedFiles,async function(req, res) {
        res.setTimeout(0);
        res.header('Content-Type', 'application/json');

        let dbCSV = req.files.dataBase[0];
        let variableTypeCorrelationCSV = req.files.variableTypeCorrelation[0];

        if(!dbCSV || !variableTypeCorrelationCSV){
            res.status(406).send({data:"Invalid File Type. Only JSON files are allowed"})
        } else if(path.extname(dbCSV.originalname) !== ".json" || path.extname(variableTypeCorrelationCSV.originalname) !== ".json"){
            res.status(406).send({data:"Invalid File Type. Only JSON files are allowed"})
        } else {
            StaticDatabaseController.uploadDatabase(dbCSV,variableTypeCorrelationCSV).then((result) => {
                res.status(result.code).send(result.body);
            }).catch((err) => {
                res.status(err.code).send(err.body);
            });
        }
    });
};
