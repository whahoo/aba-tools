/*!
 * ABA Generator v0.0.3
 * Copyright 2014 Ben (LB) Johnston <mail@lb.ee>
 * ISC license Licensed under MIT (https://github.com/lb-/aba-tools/blob/master/LICENCE)
 */

"use strict"
//main.js :: main node module set up & export

if (typeof Meteor === 'undefined' /*import if npm*/) {
  //internal
  var _utils = require('./lib/utils');
  var _ = require('underscore');
  var getEntry = _utils.getEntry;
  var getRecord = _utils.getRecord;
}

//createABA will take a description object and one or more detail objects
//it will return a formatted aba file multi-line text object
//future should be able to accept mutiple objects
//eg.  ABA (descriptiveRecord, detailRecords) or ABA (full output to be parsed)
function ABA () {
  var self = this;
  self.totals = {
    net: 0.0,
    credit: 0.0,
    debit: 0.0,
    count: 0,
  };

  //Descriptive Record
  self.descriptiveLine = '';
  self.descriptiveRecord = {};
  //Detail Records
  self.detailLines = [];
  self.detailRecords = [];
  //Total Record
  self.totalLine = '';
  self.totalRecord = {};

  //internal functions
  self._process = function procesABA () {
    //console.log(self.descriptiveLine, self.descriptiveLines);
  };

  //api functions
  self.addRecord = function addRecord (recordType, recordValues) {
    var recordType = _utils.checkType(recordType, true);
    var recordValues = recordValues || {};
    if ( recordType === 'detail' ) {
      self.detailLines.push(_utils.getRecord(recordType, recordValues));
      self.detailRecords.push(recordValues);
    } else /*( recordType === 'descriptive' )*/ {
      self.descriptiveLine = utils.getRecord(recordType, recordValues);
      self.descriptiveRecord = recordValues;
    }
  };

  self.addDescriptiveRecord = function addDescriptiveRecord (recordValues) {
    var recordValues = recordValues || {};
    self.descriptiveLine = _utils.getRecord('descriptive', recordValues);
    self.descriptiveRecord = recordValues;
  };

  self.addDetailRecords = function addDetailRecords (recordValuesArray) {
    var recordValuesArray = recordValuesArray || [];
    if (recordValuesArray.length == 0) {
      throw new Error('addDetailRecords requires an array of 1 or more recordValues');
    }
    _.each(recordValuesArray, function(recordValues) {
      self.detailLines.push(_utils.getRecord('detail', recordValues));
      self.detailRecords.push(recordValues);
    });
  };


  self.export = function exportABA () {
    self._process();
    var result = '';
    result += self.descriptiveLine;
    _.each(self.detailLines, function (detailLine) {
      result += '\n';
      result += detailLine;
    });
    result += '\n';
    result += self.totalLine;
    return result;
  };

};



// ABA.prototype.lines = function exportLines () {
//   return ["long long string with things in it: ", "other line"];
// };


if (typeof module !== 'undefined') {
  module.exports = ABA;
}
