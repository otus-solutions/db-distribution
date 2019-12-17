const path = require('path');
const Response = require('../../app/utils/Response.js');

module.exports.validateFileContainer = (fileContainer, ext) => {
  return new Promise(function (resolve, reject) {
    let errorMessage;
    if (!fileContainer) {
      errorMessage = 'The databaseJson field is required';
    } else if (path.extname(fileContainer[0].originalname) !== ext) {
      errorMessage = 'Invalid File Type. Only JSON files are allowed';
    }
    if (errorMessage) {
      reject(Response.notAcceptable({data: 'The databaseJson field is required'}));
    } else {
      resolve(fileContainer[0])
    }
  });
}