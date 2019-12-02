describe('Utils.js Tests', function () {
  var utils, assert, chai, expect;

  beforeEach(function () {
    utils = require("../../app/utils/Utils.js");
    assert = require('assert');
    chai = require('chai');
    expect = chai.expect;
  });

  describe('the validateFileContainer method', function () {
    it('should return error when fileContainer is undefined', function () {
      return expect(utils.validateFileContainer()).to.be.rejectedWith(ErrorClass, "The databaseJson field is required")
    });
  });
});