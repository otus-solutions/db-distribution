describe('StaticDatabaseController.js Tests', function () {
  let ctrl, application;
  const Mock = {};

  beforeEach(function () {
    application = require("../../config/server");

    Mock.StaticDatabaseService = application.app.services.StaticDatabaseService;
    Mock.VariableTypeCorrelationService = application.app.services.VariableTypeCorrelationService;

    ctrl = require('../../app/controllers/StaticDatabaseController')(application);
  });

  describe('getVariables method', function () {
    test('shoul call getVariables method from StaticDatabaseService', function () {
      jest.spyOn(Mock.StaticDatabaseService,'getVariables').mockImplementation(()=>'{"test":"text"}');

      const result = ctrl.getVariables('', []);

      expect(Mock.StaticDatabaseService.getVariables).toHaveBeenCalledTimes(1);
      expect(Mock.StaticDatabaseService.getVariables).toHaveBeenCalledWith('', []);
      expect(result).toEqual('{"test":"text"}');
    });

    test('shoul call uploadDatabase method from StaticDatabaseService', function () {
      jest.spyOn(Mock.StaticDatabaseService,'uploadDatabase').mockImplementation(()=>'{"test":"text"}');

      const result = ctrl.uploadDatabase('{"abc":"123"}');

      expect(Mock.StaticDatabaseService.uploadDatabase).toHaveBeenCalledTimes(1);
      expect(Mock.StaticDatabaseService.uploadDatabase).toHaveBeenCalledWith('{"abc":"123"}');
      expect(result).toEqual('{"test":"text"}');
    });

    test('shoul call uploadVariableTypeCorrelation method from StaticDatabaseService', function () {
      jest.spyOn(Mock.VariableTypeCorrelationService,'uploadVariableTypeCorrelation').mockImplementation(()=> '[{"name": "tst1","type": "Text"}]');

      const result = ctrl.uploadVariableTypeCorrelation('{"abc":"123"}');

      expect(Mock.VariableTypeCorrelationService.uploadVariableTypeCorrelation).toHaveBeenCalledTimes(1);
      expect(Mock.VariableTypeCorrelationService.uploadVariableTypeCorrelation).toHaveBeenCalledWith('{"abc":"123"}');
      expect(result).toEqual('[{"name": "tst1","type": "Text"}]');
    });

  });

});
