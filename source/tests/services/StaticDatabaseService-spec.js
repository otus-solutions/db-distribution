describe('StaticDatabaseService_TestSuite', () => {

    jest.mock('child_process');

    const Mock = {
        application: require("../../config/server"),
        fs: require('fs')
    }

    const service = require("../../app/services/StaticDatabaseService.js")(Mock.application);

    beforeEach(() => {
        Mock.Response = Mock.application.app.utils.Response;
        Mock.StaticDatabase = Mock.application.app.models.StaticDatabase;
        Mock.databaseCSV = loadMockDatabaseCSV();
        Mock.identification = 123456;
        Mock.variables = ['tst1', 'tst2'];
        Mock.childProcess = require('child_process');
        Mock.errorMsg = 'There was an error. Please try again later.'
    });

    it('serviceExistence_check', () => {
        expect(service).toBeDefined();
    });

    it('serviceMethodsExistence_check', () => {
        expect(service.uploadDatabase).toBeDefined();
        expect(service.getVariables).toBeDefined();
    });


    it("uploadDatabase_method_should_return_confirmationResponse", async () => {
        jest.spyOn(Mock.childProcess, 'exec')
            .mockImplementation((callFakeImport, callback) => callback());

        jest.spyOn(Mock.StaticDatabase, "correctCurrentVariables")
            .mockImplementation(() => Mock.databaseCSV);

        jest.spyOn(Mock.fs, 'unlinkSync')
            .mockImplementation(() => Mock.databaseCSV);

        const resultUploadDatabase = await service.uploadDatabase(Mock.databaseCSV);
        expect(resultUploadDatabase.code).toBe(200);
        expect(resultUploadDatabase.body.data).toBeTruthy();
    });


    it("uploadDatabase_method_should_return_rejectPromise", async () => {
        jest.spyOn(Mock.childProcess, 'exec').mockImplementation(() => {
            throw new Error()
        });

        jest.spyOn(Mock.fs, 'unlinkSync').mockImplementation(() => Mock.databaseCSV);
        try {
            await service.uploadDatabase(Mock.databaseCSV);
        } catch (e) {
            expect(e.code).toBe(500);
            expect(e.body.data.message).toBe(Mock.errorMsg);
        }
    });


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
            expect(e.body.data.message).toBe(Mock.errorMsg);
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
