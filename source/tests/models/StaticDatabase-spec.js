describe('StaticDatabase TestSuite', function () {

    let factory;

    const mongoose = require('mongoose');
    const Mock = {};

    beforeEach(function () {
        mocks();

        factory = require('../../app/models/StaticDatabase');
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

    it('should call correctCurrentVariables method from CurrentVariablesCollection', async () => {
        expect.assertions(2);
        const currentVariables = await factory.correctCurrentVariables();

        expect(factory.correctCurrentVariables).toBeDefined();
        expect(expect.arrayContaining(currentVariables)).toEqual([]);

    });

    it('should call getVariables method from CurrentVariablesCollection', async () => {
        expect.assertions(2);
        const currentVariables = await factory.getVariables(Mock.identification, Mock.variableTypeCorrelationData);

        expect(factory.getVariables).toBeDefined();
        expect(expect.arrayContaining(currentVariables)).toEqual([]);
    });

    it('should call getVariables method and getCurrentVariables method from CurrentVariablesCollection', async () => {
        expect.assertions(3);
        jest.spyOn(factory,'getCurrentVariables').mockImplementation(()=> Mock.currentVariables);

        const currentVariables = await factory.getVariables(Mock.identification, Mock.variableTypeCorrelationData);

        expect(factory.getCurrentVariables).toHaveBeenCalledTimes(1);
        expect(factory.getCurrentVariables).toHaveBeenCalledWith(Mock.identification, Mock.variableTypeCorrelationData, ["text", "text2"]);
        expect(expect.arrayContaining(currentVariables)).toEqual(Mock.currentVariables);
    });

    it('should call getVariables method and return error', async () => {
        jest.spyOn(factory,'getCurrentVariables').mockImplementation(()=> Promise.reject(new Error('currentVariables')));

        await expect(factory.getVariables(Mock.identification, Mock.variableTypeCorrelationData)).rejects.toThrow(
            'currentVariables'
        );
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
        Mock.identification = 123456;

        Mock.currentVariables = [
            {
                name: "text",
                type: "Text"
            }
        ];

        Mock.variableTypeCorrelationData = [
            {
                name:'text',
                type:'inteiro2'
            },
            {
                name:'text2',
                type:'inteiro3'
            },
        ];
    }
});