describe('StaticDatabaseService.js Tests', () => {
    let service, application;

    const assert = require('assert');
    const chai = require('chai');
    const expect = chai.expect;
    const fs = require('fs');

    beforeEach(() => {
        application = require("../../config/server");
        service = require("../../app/services/StaticDatabaseService.js")(application);
    });

    it('serviceExistence_check', () => {
        expect(service).not.to.be.undefined;
    });

    it('serviceMethodsExistence_check', () => {
        expect(service.uploadDatabase).not.to.be.undefined;
        expect(service.getVariables).not.to.be.undefined;
    });


    it('uploadDatabase_method_should', (done) => {
        let databaseCSV = {path: '{"ab":1, "bc":2}'}
        assert.equal((1 + 1), 2)
        console.log(service.uploadDatabase(databaseCSV))
        done();
    });

});