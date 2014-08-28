//many items left from tutorial
//http://www.anupshinde.com/posts/how-to-create-nodejs-npm-package/
"use strict"
var fs = require('fs');
var _ = require('underscore');

// Descriptive Record
function descriptiveRecord(options) {
  var self = this;

  options = _.extend({
    seq: null, //Reel Sequence Number. Must be numeric commencing at 01.
    bankAbr: '', //Must be approved Financial Institution abbreviation.
    userSpec: null, //Must be User Preferred Specification as advised by User's FI
    userId: null, //Must be User Identification Number which is allocated by APCA
    description: null, //All coded character set valid. Must not be all blanks
    date: null, //Must be numeric in the formal of DDMMYY.
  }, options);

};


// Record Types

var recordTypes = [
  { id: 0, type: 'descriptiive' },
  { id: 1, type: 'detail' },
  { id: 7, type: 'file-total' },
]

var recordTypeNames = _.map(recordTypes,
    function(type) {
      return type.type;
    }
  );


function Record(type, options) {
  var self = this;
  //type = 'joe';
  //Type is either; 'descriptive', 'detail', 'file-total'
  //Type defaults to 'detail' as that will be the most common
  self.type = type || 'detail';
  if (! _.contains(recordTypeNames, self.type)) {
    var errorMessage = "Record Type is not a valid type, must be one of: " + recordTypeNames.toString();
    throw errorMessage;
  }
  console.log('this should not happen')
}

//
//
// function convertThis() {
//   if (process.argv.length > 2) {
//     var myFile = process.argv[2];
//     if (fs.existsSync(myFile)) {
//       var content = fs.readFileSync(myFile, 'utf8');
//       fs.writeFileSync(myFile, content.toUpperCase());
//       console.log( "Done" );
//     } else {
//       console.log("File does not exist - " + myFile);
//     }
//   } else {
//     console.log("ERROR: Pass on a file name/path");
//   }
// }

exports.generate = Record;
