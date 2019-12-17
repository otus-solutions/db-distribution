describe('VariableTypeCorrelation TestSuite', function () {

    let factory;

    const mongoose = require('mongoose');
    const Mock = {};

    beforeEach(function () {
        mocks();

        factory = require('../../app/models/VariableTypeCorrelation');
    });

    // It's just so easy to connect to the MongoDB Memory Server
    // By using mongoose.connect
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });

    it('service should defined', function () {
        expect(factory).toBeDefined();
    });

    describe('updateVariableTypeCorrelation method', function () {
        it('should call updateVariableTypeCorrelation method from VariableTypeCorrelation', async () => {
            expect.assertions(6);
            const variable = await factory.updateVariableTypeCorrelation(Mock.variableTypeCorrelationData);

            expect(factory.updateVariableTypeCorrelation).toBeDefined();
            expect(variable.result.upserted).toBeTruthy();
            expect(variable.upsertedId._id).toBeDefined();

            const variableTwo = await factory.updateVariableTypeCorrelation(Mock.variableTypeCorrelationData2);

            expect(variableTwo.result).toEqual({ n: 1, nModified: 0, ok: 1 });
            expect(variableTwo.result.upserted).toBeFalsy();
            expect(variableTwo.upsertedId).toBeNull();
        });
    });

     /*
    Define clear that will loop through all
    the collections in our mongoose connection and drop.
  */

    afterAll(async () => {
        for (var i in mongoose.connection.collections) {
            await mongoose.connection.collections[i].remove(function() {});
        }
        await mongoose.disconnect();
        console.log('disconnected');
    });

    function mocks() {
        Mock.variableTypeCorrelationData = {
            name:'text',
            type:'text1'
        };
        Mock.variableTypeCorrelationData2 = {
            name:'text',
            type:'inteiro2'
        };
    }
});