xdescribe('StaticDatabaseController.js Tests', function () {
  var ctrl;
  var Mock = {};
  var Injections = [];

  const sandbox = require('sinon').createSandbox()
  const expect = require('chai').expect;
  const sinon = require('sinon');

  beforeEach(function () {
    application = require("../../config/server");

    ctrl = require("../../app/controllers/StaticDatabaseController.js")(application);

  });

  describe('getVariables method', function () {
    var setNameSpy;
    afterEach(() => {
      sandbox.restore()
    });

    it('shoul call getVariables method from StaticDatabaseService', function () {
      sandbox.stub(ctrl, 'getVariables').returns({});
      setNameSpy = sinon.spy(user, 'setName');

      ctrl.getVariables();
    });
  });

});
