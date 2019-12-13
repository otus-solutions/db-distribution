describe('Utils_UnitTest_Suite', () => {

    const Mock = {};
    Mock.fileContainer =  [{originalname: "source/app/utils/Utils.js"}, {error: "MockError"}];
    Mock.ext = ".js";

    const utils = require("../../../app/utils/Utils.js")

    it('unitTest: utilsExistence check', () => {
        expect(utils).toBeDefined();
    });

    it('unitTest: utilsMethodsExistence check', () => {
        expect(utils.validateFileContainer).toBeDefined();
    });

    it('unitTest: Method validateFileContainer should return promiseResolved with first element of fileContainer', async() => {
            expect(await utils.validateFileContainer(Mock.fileContainer, Mock.ext))
                .toBe(Mock.fileContainer[0]);
    });


    it('unitTest: Method validateFileContainer should promiseRejected with required field information', async() => {
        try {
            console.log(await utils.validateFileContainer(null, Mock.ext));
        }
        catch (e) {
            expect(e.code).toBe(406)
            expect(e.body.data.data).toBe("The databaseJson field is required")
        }
    });

    it('unitTest: Method validateFileContainer should promiseRejected with invalid file type', async() => {
        try {
            console.log(await utils.validateFileContainer(Mock.fileContainer, "mock"));
        }
        catch (e) {
            console.log(e)
            expect(e.code).toBe(406)
            expect(e.body.data.data).toBe( 'The databaseJson field is required');
        }
    });
});

