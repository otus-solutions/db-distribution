describe('Utils.js Tests', function () {
  var app, assert, chai, expect;

  beforeEach(function () {
    app = require('../../app/utils/Utils.js');
    assert = require('assert');
    chai = require('chai');
    expect = chai.expect;
  });

  describe('validateFileContainer method', function () {
    it('should not throw error if parameters are well defined', function () {
      try {
        app.validateFileContainer([{ 'originalname': '/api/upload/database/file.json' }], '.json');
      } catch (e) { }
    });

    it('should throw error when parameters is not defined', function () {
      try {
        app.validateFileContainer();
      } catch (e) {
        assert(e.message === 'The databaseJson field is required');
      }
    });

    it('should throw error when parameters are not well defined', function () {
      try {
        app.validateFileContainer([{ 'originalname': '/api/upload/database/file.txt' }], '.json');
      } catch (e) {
        assert(e.message === 'Malformed recruitment number');
      }
    });
  });

});