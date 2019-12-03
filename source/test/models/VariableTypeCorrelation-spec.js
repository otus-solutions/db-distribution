describe('StaticDatabase.js Tests', function () {
  var app, mongoose, assert, chai, expect;
  var Mock = {};

  beforeEach(function (done) {
    mocks();

    app = require("../../app/models/VariableTypeCorrelation.js");
    mongoose = require('mongoose');

    mongoose.connect('mongodb://localhost/test', done);
  });

  after(function (done) {
    mongoose.connection.db.dropDatabase(function () {
      mongoose.connection.close(done);
    });
  });

  describe('updateVariableTypeCorrelation method', function () {
    it('should perform update in data', function () {
      app.updateVariableTypeCorrelation(Mock.variable).then((respose) => {
        // TODO:
      });
    });
  });


  function mocks() {
    Mock.variable = {
      "identification": 5004863,
      "name": "CJS10",
      "sending": 2,
      "value": 0
    };
  }
});