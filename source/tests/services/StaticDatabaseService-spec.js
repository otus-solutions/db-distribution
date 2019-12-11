describe('StaticDatabaseService_TestSuite', () => {

    const Mock = {};
    Mock.application = require("../../config/server");
    Mock.fs = require('fs');

    const service = require("../../app/services/StaticDatabaseService.js")(Mock.application);

    beforeEach(() => {
        Mock.Response = Mock.application.app.utils.Response;
        Mock.StaticDatabase = Mock.application.app.models.StaticDatabase;
        Mock.databaseCSV = loadMockDatabaseCSV();
        Mock.identification = 123456;
        Mock.variables = ['tst1', 'tst2'];

        Mock.promise = new Promise((resolve, reject) => {
            resolve();
        });
    });

    it('serviceExistence_check', () => {
        expect(service).toBeDefined();
    });

    it('serviceMethodsExistence_check', () => {
        expect(service.uploadDatabase).toBeDefined();
        expect(service.getVariables).toBeDefined();
    });

    jest.mock('child_process');
    it("uploadDatabase_method_should_return_confirmationResponse", async () => {
        const cp = require('child_process');
        jest.spyOn(cp, 'exec')
            .mockImplementation((callFakeImport, callback) => callback());

        jest.spyOn(Mock.StaticDatabase, "correctCurrentVariables")
            .mockImplementation(() => Mock.databaseCSV);

        jest.spyOn(Mock.fs, 'unlinkSync')
            .mockImplementation(() => Mock.databaseCSV);

        const resultUploadDatabase = await service.uploadDatabase(Mock.databaseCSV);
        expect(resultUploadDatabase.code).toBe(200);
        expect(resultUploadDatabase.body.data).toBeTruthy();
    });

    // it("uploadDatabase_method_should_return_rejectPromise", async () => {
    //     await service.uploadDatabase(Mock.databaseCSV);
    // });


    it('getVariables_method_should_return_responseValid_with_variableList_by_identification_and_variables', async () => {
        jest.spyOn(Mock.StaticDatabase, "getVariables")
            .mockImplementation(() => Mock.databaseCSV);

        let responseResult = await service.getVariables(Mock.identification, Mock.variables);
        expect(responseResult.code).toBe(200);
        expect(responseResult.body.data.variables[0].name).toBe("tst1");
    });

    it('getVariables_method_should_catch_exception_and_check_message', async () => {
        jest.spyOn(Mock.StaticDatabase, "getVariables").mockImplementation(() => {
            throw new Error()
        });
        try {
            await service.getVariables(Mock.identification, Mock.variables)
        } catch (e) {
            expect(e.code).toBe(500)
            expect(e.body.data.message).toBe('There was an error. Please try again later.');
        }
    });

    function loadMockDatabaseCSV() {
        return [
            {
                "identification": 123456,
                "name": "tst1",
                "value": "Text",
                "sending": "ONDA3"
            },
            {
                "identification": 123456,
                "name": "tst2",
                "value": "Text",
                "sending": "ONDA3"
            }
        ]
    }

});
