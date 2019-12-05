describe('StaticDatabaseService.js Tests', () => {
    let application, assert, chai, expect;

    beforeEach(function () {
        application = require("../../config/server");
        service = require("../../app/services/StaticDatabaseService.js")(application);
    });

    describe('', function () {
        it('', function () {
            console.log(service)
        });
    });
});