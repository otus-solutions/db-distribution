const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staticDatabaseVariableSchema = new Schema({
    objectType: {
        type: String,
        default: "DatabaseVariable"
    },
    elementId: {
        type: String,
        required: true
    },
    uploadDate:{
        type:Date,
        required: true
    },
    variableId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
});


staticDatabaseVariableSchema.statics.saveVariables  = async function(databaseVariables) {
    return await this.collection.insertMany(databaseVariables).then(result => {
        return result
    }).catch(err => {
        throw err;
    });
};


mongoose.model('static-database-variable', staticDatabaseVariableSchema, 'static-database');
