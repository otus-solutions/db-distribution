describe('Response.js Tests', () => {
  const responseApp = require("../../app/utils/Response");

  it('unitTest: response module existence check', () => {
    expect(responseApp).toBeDefined();
  });
  
  it('unitTest: method success defined check ', () => {
    expect(responseApp.success).toBeDefined();
  });

  it('unitTest: method notAcceptable defined check', () => {
    expect(responseApp.notAcceptable).toBeDefined();
  });

  it('unitTest: method internalServerError defined check', () => {
    expect(responseApp.internalServerError).toBeDefined();
  });

  it('unitTest: method notFound defined check', () => {
    expect(responseApp.notFound).toBeDefined();
  });

  it('unitTest: should success response with body parameter', function () {
    let body = { teste: null };
    let valueCustom = responseApp.success(body);
    expect(valueCustom.code).toBe(200);
    expect(valueCustom.body.data).toBe(body);
  });

  it('unitTest: should success response with no body parameter', function () {
    let valueDefault = responseApp.success();
    expect(valueDefault.code).toBe(200);
    expect(valueDefault.body.data).toBe(true);
  });

  it('unitTest: should notAcceptable response with body parameter', function () {
    let body = { teste: null };
    let valueCustom = responseApp.notAcceptable(body);
    expect(valueCustom.code).toBe(406);
    expect(valueCustom.body.data).toBe(body);
  });

  it('unitTest: should notAcceptable response with no body parameter', function () {
    let valueDefault = responseApp.notAcceptable();
    let bodyDefault = { message: "Value not acceptable" };
    expect(valueDefault.code).toBe(406);
    expect(valueDefault.body.data).toMatchObject(bodyDefault);
  });

  it('unitTest: should internalServerError response with body parameter', function () {
    let body = { teste: null };
    let valueCustom = responseApp.internalServerError(body);
    expect(valueCustom.code).toBe(500);
    expect(valueCustom.body.data).toBe(body);
  });

  it('unitTest: should internalServerError response with no body parameter', function () {
    let bodyDefault = { message: "There was an error. Please try again later." };
    let valueDefault = responseApp.internalServerError();
    expect(valueDefault.code).toBe(500);
    expect(valueDefault.body.data).toMatchObject(bodyDefault);
  });

  it('unitTest: should notFound response with body parameter', function () {
    let body = { teste: null };
    let valueCustom = responseApp.notFound(body);
    expect(valueCustom.code).toBe(404);
    expect(valueCustom.body.data).toBe(body);
  });

  it('unitTest: should notFound response with no body parameter', function () {
    let bodyDefault = { message: "Data not found" };
    let valueDefault = responseApp.notFound();
    expect(valueDefault.code).toBe(404);
    expect(valueDefault.body.data).toMatchObject(bodyDefault);
  });

});