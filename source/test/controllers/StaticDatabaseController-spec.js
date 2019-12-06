xdescribe('StaticDatabaseController.js Tests', function () {
  var ctrl, stub;
  var Mock = {};
  var Injections = [];

  const sandbox = require('sinon').createSandbox()
  const expect = require('chai').expect;
  const sinon = require('sinon');

  beforeEach(function () {
    application = require("../../config/server");

    Injections.StaticDatabaseService = require('../../app/services/StaticDatabaseService.js')(application);
    Injections.VariableTypeCorrelationService = require('../../app/services/VariableTypeCorrelationService.js')(application);

    ctrl = require('../../app/controllers/StaticDatabaseController.js')(application);
  });

  afterEach(() => {
    sinon.restore()
  });

  describe('getVariables method', function () {
    var setNameSpy;

    it('shoul call getVariables method from StaticDatabaseService', function () {
      sinon.stub(Injections.StaticDatabaseService, 'getVariables').returns({});

      const result = ctrl.getVariables('', []);

      expect(stub.calledOnce).to.be.true;

    });
  });

});
