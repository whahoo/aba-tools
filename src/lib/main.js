"use strict"
//main.js :: main node module set up & export

//internal
var utils = require('./utils');
var getEntry = utils.getEntry;
var getRecord = utils.getRecord;

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
    self.descriptiveLine = utils.getRecord('descriptive', self.descriptiveRecord);
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

// function createABA (descriptiveRecord, detailRecords) {
//   var descriptiveRecord = {
//     sequence: 3,
//     bank: 'QBL',
//     userName: 'Transport Co',
//     userId: '12377',
//     description: 'Payments',
//     date: new Date,
//   };
//   /*
//     task: create this function
//     single descriptive record like above
//     array of objects that represent detailrecords
//     return an object like the one below
//   */
//   return {
//     //not sure on best convetion
//     //current thoughts...
//     result: "large multi line string",//can I do this?
//     lines: [
//       'first row as descriptive record',
//       'one or more detail records',
//       'total record',
//     ],
//     //descriptiveRecord: descriptiveRecord,// include original sent?
//     //detailRecords: detailRecords, //include original?
//     //if I end up doing an ABA.
//     totals: {
//       net: 123.00,
//       credit: 456.00,
//       debit: 789.00,
//       count: 23,
//     },
// };

//task: how to expand the api for future
// ABA.generate(...) as above
// ABA.validate(big multi line string or array of lines)
// ABA.parse // might mean I need to rename the parse functions

//exports.createABA = createABA;
module.exports = ABA;
