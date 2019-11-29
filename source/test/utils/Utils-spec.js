describe('Utils.js Tests', function () {
  var utils, assert, chai, expect, chaiAsPromised;

  beforeEach(function () {
    utils = require("../../app/utils/Utils.js");
    assert = require('assert');
    expect = chai.expect;
    chaiAsPromised = require("chai-as-promised");
  });

  describe('the validateFileContainer method', function () {
    it('should return error when fileContainer is undefined', function () {
      return expect(validateFileContainer()).to.be.rejectedWith(ErrorClass, "The databaseJson field is required")
    });
  });
});