const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const databaseVariable = new Schema({
    objectType: {
        type: String,
        default: "RandomizationTableElement"
    },
    tableId: {
        type: ObjectId,
        required: true
    },
    version: {
        type: Number,
        required: true
    },
    identification: {
        type: String,
        required: true
    },
    group: {
        type: String,
        required: true
    },
    position: {
        type: Number
    },
});

databaseVariable.statics.getVariables = async function (partialVariableName) {
    return await this.find({"tableId": tableId, "identification": null})
        .exec();
};

mongoose.model('current_variables', databaseVariable, 'current_variables');
