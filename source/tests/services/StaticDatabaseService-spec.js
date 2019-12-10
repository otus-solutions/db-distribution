describe('StaticDatabaseService_TestSuite', () => {
    //jest.mock('child_process');

    const application = require("../../config/server");
    const service = require("../../app/services/StaticDatabaseService.js")(application);
    const Mock = {};

    beforeEach(() => {
        Mock.Response = application.app.utils.Response;
        Mock.StaticDatabase = application.app.models.StaticDatabase;
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

    it('getVariables_method_should_return_responseValid_with_variableList_by_identification_and_variables', async () => {
        jest.spyOn(Mock.StaticDatabase, "getVariables")
            .mockImplementation(()=> Mock.databaseCSV);

        let responseResult = await service.getVariables(Mock.identification, Mock.variables);
        expect(responseResult.code).toBe(200);
        expect(responseResult.body.data.variables[0].name).toBe("tst1");
    });

    it('getVariables_method_should_catch_exception_and_check_message', async () => {
        jest.spyOn(Mock.StaticDatabase, "getVariables").mockImplementation(() => {throw new Error()});

        try{
            await service.getVariables(Mock.identification, Mock.variables)
        }
        catch(e){
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
