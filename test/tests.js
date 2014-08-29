"use strict"
//external
var assert = require('assert');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var ValidationError = require("error/validation");
var OptionError = require("error/option");

//internal
var lib = path.join(path.dirname(fs.realpathSync(__filename)), '../src/lib');
var config = require(lib + '/config');
var recordTypes = config.recordTypes;
var recordTypeNames = config.recordTypeNames;
var utils = require(lib + '/utils');
var getEntry = utils.getEntry;
var getRecord = utils.getRecord;

function isValidationError(error) {
  if ( error.type === 'ValidationError' ) {
    return true;
  }
};

function testBadValues (fieldKey, badValues, recordOptions) {
  var badValues = badValues || [];
  var fieldKey = fieldKey || 'title not provided';
  _.each(badValues, function (badValue) {
    var i = {};
    i[fieldKey] = badValue;
    var badOptions = _.extend(_.clone(recordOptions), i);
    if (badValue === 'not provided') {
      delete badOptions[fieldKey];
    }
    it("should throw if " + fieldKey + " is [ " + badValue + " ]", function () {
      assert.throws(function () { getRecord('descriptive', badOptions) }, Error);
    });
  });
};


describe('# config', function () {
  _.each(['descriptive', 'detail'], function (type) {
    describe('Config for ' + type + ' Columns', function () {

      it('should get a total of 120 characters', function () {
        var totalCharsInColumns =_.reduce(recordTypes[type].columns, function (total, column) {
          return total + column.size;
        }, 1);
        //initial value is 1 as we do not define the record type column
        assert.equal(120, totalCharsInColumns);
      });

      it('should validate each column against the column schema', function () {
        _.each(recordTypes[type].columns, function(column) {
          var errors = config.column.schema.validate(_.defaults(column, config.column.defaultOptions));
          assert.equal(0, errors.length);
        });
      });


    });
  });

});


describe('# utils', function () {
  var emptyOptions = {};

  describe('getRecord()', function () {
    var goodRecordOptions = {
      seq: 1,
      bankAbr: 'WBC',
      userSpec: 'LIFE CHURCH',
      userId: '252359',
      description: 'Payments',
      date: '311214',
    };

    it("should throw if type is not 'descriptive', 'detail' or 'file-total'", function () {
      assert.throws(function () {getRecord('foo', goodRecordOptions)}, Error);
      assert.throws(function () {getRecord('#', goodRecordOptions)}, Error);
    });

    describe('descriptive record', function () {
      var recordOutput = "0                 01WBC       LIFE CHURCH               252359Payments    290814                                        ";
      var recordOptions = {
        seq: 1,
        bankAbr: 'WBC',
        userSpec: 'LIFE CHURCH',
        userId: '252359',
        description: 'Payments',
        date: '290814',
      };

      it("should return a valid descriptive record", function () {
        assert.equal(recordOutput, getRecord('descriptive', recordOptions));
      });

      describe('seq', function () {
        testBadValues( this.title, ['not provided', null, undefined, '3', 'a'], recordOptions);
      });

      describe('bankAbr', function () {
        testBadValues( this.title, ['not provided', null, undefined, 'a', 'ab', 'abcd', '###', 123, '123'], recordOptions);
      });

      describe('userSpec', function () {
        testBadValues( this.title, ['not provided', null, undefined, '',], recordOptions);
      });

      describe('userId', function () {
        testBadValues( this.title, ['not provided', null, undefined, ''], recordOptions);
      });

      describe('description', function () {
        testBadValues( this.title, ['not provided', null, undefined, '', 'very long description', 1232344], recordOptions);
      });

      describe('date', function () {
        testBadValues( this.title, ['not provided', null, undefined, 'a', 'ab', 'abcd', '###', 123456], recordOptions);
      });

    });

  });

  describe('getEntry()', function () {

    it("should throw options do not validate", function () {
      assert.throws(
        function () {getEntry('foo', emptyOptions)},
        isValidationError
        );
    });

  });

});
