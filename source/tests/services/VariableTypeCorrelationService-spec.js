describe('VariableTypeCorrelationService TestSuite', function () {

    let service, application;
    const Mock = {};

    beforeEach(function () {
        mocks();

        application = require("../../config/server");
        Mock.fs = require('fs');

        Mock.VariableTypeCorrelation = application.app.models.VariableTypeCorrelation;
        Mock.Response = application.app.utils.Response;

        service = require('../../app/services/VariableTypeCorrelationService')(application);

    });

    test('service should defined', function () {
        expect(service).toBeDefined();
    });

    describe('updateVariableTypeCorrelation method', function () {
        test('should call updateVariableTypeCorrelation method from VariableTypeCorrelation', async () => {
            jest.spyOn(Mock.fs,'readFileSync').mockImplementation(()=>'[{"test":"text"}]');
            jest.spyOn(Mock.VariableTypeCorrelation,'updateVariableTypeCorrelation').mockImplementation(()=>'{"test":"text"}' );
            jest.spyOn(Mock.fs,'unlinkSync').mockImplementation(()=> true);
            jest.spyOn(Mock.Response,'success').mockImplementation(()=> Promise.resolve("Ok"));

            expect.assertions(3);
            const result = await service.uploadVariableTypeCorrelation(Mock.variableTypeCorrelationJson);

            expect(service.uploadVariableTypeCorrelation).toBeDefined();
            expect(result).toHaveLength(2);
            expect(result).toEqual('Ok');

        });

        test('should call updateVariableTypeCorrelation method and return error', async () => {
            jest.spyOn(Mock.fs,'readFileSync').mockImplementation(()=>'[{"test":"text"}]' );
            jest.spyOn(Mock.VariableTypeCorrelation,'updateVariableTypeCorrelation').mockImplementation(()=>'{"test":"text"}' );
            // jest.spyOn(Response,'internalServerError').mockImplementation(()=> "failed");

            try {
                await service.uploadVariableTypeCorrelation(Mock.variableTypeCorrelationJson);
            } catch (e) {
                expect.assertions(2);
                expect(e.body.data.message).toEqual("There was an error. Please try again later.");
                expect(e.code).toEqual(500);
            }

        });
    });

    function mocks() {
        Mock.variableTypeCorrelationJson = {
            path: 'correlationJson=@ARQUIVO.json'
        }
    }

});