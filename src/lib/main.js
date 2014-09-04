/*!
 * ABA Generator v0.0.3
 * Copyright 2014 Ben (LB) Johnston <mail@lb.ee>
 * ISC license Licensed under MIT (https://github.com/lb-/aba-tools/blob/master/LICENCE)
 */

"use strict"
//main.js :: main node module set up & export

if (typeof Meteor === 'undefined' /*import if npm*/) {
  //internal
  var helpers = require('./helpers');
  var getEntry = helpers.getEntry;
  var getRecord = helpers.getRecord;
}

//createABA will take a description object and one or more detail objects
//it will return a formatted aba file multi-line text object
function ABA (descriptiveRecord, detailRecords) {
  var self = this;
  self.totals = {
    net: 0.0,
    credit: 0.0,
    debit: 0.0,
    count: 0,
  };

  //Descriptive Record
  self.descriptiveLine = '';
  self.descriptiveRecord = descriptiveRecord || null;
  if ( self.descriptiveRecord ) {
    console.log(self.descriptiveRecord);
    self.descriptiveLine = helpers.getRecord('descriptive', self.descriptiveRecord);
  } else {
    throw Error('descriptiveRecord must be provided')
  }
  //self.descriptiveRecord = descriptiveRecord || {};
  //self.detailRecords = detailRecords || [];

  //Detail Records

  //Total Records

}

ABA.prototype.export = function exportABA() {
  return "long long string with things in it: " + self.totals.toString();
};

ABA.prototype.lines = function exportABA() {
  return ["long long string with things in it: ", "other line"];
};


if (typeof module !== 'undefined') {
  module.exports = ABA;
}
