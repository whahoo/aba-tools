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
}


describe('# config', function () {

  describe('Descriptive Columns', function () {

    it('should get a total of 120 characters', function () {
      var totalCharsInColumns =_.reduce(recordTypes.descriptive.columns, function (total, column) {
        return total + column.size;
      }, 1);
      //initial value is 1 as we do not define the record type column
      assert.equal(120, totalCharsInColumns);
    });

    it('should validate each column against the column schema', function () {
      _.each(recordTypes.descriptive.columns, function(column) {
        var errors = config.column.schema.validate(_.extend(_.clone(config.column.defaultOptions), column));
        assert.equal(0, errors.length);
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




// function tests() {
//   console.log('Empty Object ', descriptiveRecord.validate({}));
//   console.log('Should Fail ', descriptiveRecord.validate({
//     seq: 1,
//     bankAbr: 'WBCA',
//     userSpec: '',
//     userId: '',
//     description: 'Payments ULTURA LUNGH ANMAM',
//     date: '31122014',
//   }));
//   console.log('Should Pass ', descriptiveRecord.validate({
//     seq: 1,
//     bankAbr: 'WBC',
//     userSpec: 'LIFE CHURCH',
//     userId: '252359',
//     description: 'Payments',
//     date: '311214',
//   }));
// }
