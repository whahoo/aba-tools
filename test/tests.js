"use strict"
var assert = require('assert');

//main libraries
var _ = require('underscore');

//internal modules
var descriptiveRecord = require('../src/lib/descriptive-record');
var utils = require('../src/lib/utils');

describe('Descriptive Record', function () {

  describe('# Columns Definition', function () {

    it('should get a total of 120 characters', function () {
      var totalCharsInColumns =_.reduce(descriptiveRecord.columns, function (total, column) {
        return total + column.size;
      }, 1);
      //initial value is 1 as we do not define the record type column
      assert.equal(120, totalCharsInColumns);
    });

    it('should validate each column against the column schema', function () {
      _.each(descriptiveRecord.columns, function(column) {
        var errors = utils.columnSchema.validate(_.extend(utils.columnDefaults, column));
        assert.equal(0, errors);
      });
    });

  });

});
