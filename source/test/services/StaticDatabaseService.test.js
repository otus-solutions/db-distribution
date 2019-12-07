describe('StaticDatabaseService_TestSuite', () => {
    let application;

    beforeEach(() => {
        application = require("../../config/server");
        service = require("../../app/services/StaticDatabaseService.js")(application);
    });

    it('serviceExistence_check', () => {
        expect(service).toBeDefined();
    });

    it('serviceMethodsExistence_check', () => {
        expect(service.uploadDatabase).toBeDefined();
        expect(service.getVariables).toBeDefined();
    });
    //
    // it('should ', () => { });

});
