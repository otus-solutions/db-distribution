describe('StaticDatabaseController.js Tests', function () {
  let application, assert, chai, expect;

  beforeEach(function () {
    application = require("../../config/server");
    ctrl = require("../../app/controllers/StaticDatabaseController.js")(application);
  });

  describe('', function () {
    it('', function () {
      console.log(ctrl.getVariables)
    });
  });
});