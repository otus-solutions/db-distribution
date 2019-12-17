const mongoose = require('mongoose');

module.exports.updateVariableTypeCorrelation = (variable) => {
    let db = mongoose.connection.db;
    let variableTypeCorrelationCollection = db.collection('variableTypeCorrelation');
    return variableTypeCorrelationCollection.updateOne({ name: variable.name }, { $setOnInsert: { name: variable.name, type: variable.type } }, { upsert: true });
};
