describe('VariableTypeCorrelationService TestSuite', function () {

    var Mock = {};

    let service, application, VariableTypeCorrelation, Response;

    const fs = require('fs');

    beforeEach(function () {
        mocks();

        application = require("../../config/server");
        VariableTypeCorrelation = application.app.models.VariableTypeCorrelation;
        Response = application.app.utils.Response;

        service = require('../../app/services/VariableTypeCorrelationService')(application);

    });

    test('service should defined', function () {
        expect(service).toBeDefined();
    });


    describe('updateVariableTypeCorrelation method', function () {
        test('should call updateVariableTypeCorrelation method from VariableTypeCorrelation', async () => {
            jest.spyOn(fs,'readFileSync').mockImplementation(()=>'[{"test":"text"}]');
            jest.spyOn(VariableTypeCorrelation,'updateVariableTypeCorrelation').mockImplementation(()=>'{"test":"text"}' );
            jest.spyOn(fs,'unlinkSync').mockImplementation(()=> true);
            jest.spyOn(Response,'success').mockImplementation(()=> Promise.resolve("Ok"));

            expect.assertions(2);
            const result = await service.uploadVariableTypeCorrelation(Mock.variableTypeCorrelationJson);

            expect(service.uploadVariableTypeCorrelation).toBeDefined();
            expect(result).toHaveLength(2);

        });

        test('should call updateVariableTypeCorrelation method and return error', async () => {
            jest.spyOn(fs,'readFileSync').mockImplementation(()=>'[{"test":"text"}]' );
            jest.spyOn(VariableTypeCorrelation,'updateVariableTypeCorrelation').mockImplementation(()=>'{"test":"text"}' );
            // jest.spyOn(Response,'internalServerError').mockImplementation(()=> "failed");

            try {
                await service.uploadVariableTypeCorrelation(Mock.variableTypeCorrelationJson);
            } catch (e) {
                console.log(e)
                expect.assertions(2);
                expect(e.body.data.message).toBe("There was an error. Please try again later.");
                expect(e.code).toBe(500);
            }

        });
    });

    function mocks() {
        Mock.variableTypeCorrelationJson = {
            path: 'correlationJson=@ARQUIVO.json'
        }
    }

});