//many items left from tutorial
//http://www.anupshinde.com/posts/how-to-create-nodejs-npm-package/
"use strict"
var fs = require('fs');
var schema = require('validate');
var _ = require('underscore');
var S = require('string');
var utils = require('./utils');


// Record Types
var recordTypes = {
  'descriptive': '0',
  'detail': '1',
  'file-total': '7',
};

var recordTypeNames = _.keys(recordTypes);


function getEntry( value, options ) {
  var result;
  var entry;
  var options = _.extend(utils.columnDefaults, options);

  var errors = utils.columnSchema.validate(options);
  if (errors.length > 0) {
    var er = 'ERRORS' + errors.toString();
    throw er;
  } else {
    entry = value.toString().trim().substr(0, options.size);
    console.log('etnry', entry);
    if (options.alignRight) {
      result = S(entry).padLeft(options.size, options.fill).s;
    } else {
      result = S(entry).padRight(options.size, options.fill).s;
    }
    console.log('validated', result, options);
  }

  return result;
  //console.log(value, options);
};


function Record(type, options) {
  var self = this;
  var result;
  //testing
  type = 'descriptive';
  options = {
    seq: 1,
    bankAbr: 'WBC',
    userSpec: 'LIFE CHURCH',
    userId: '252359',
    description: 'Payments',
    date: '311214',
  };
  //end testing

  //Type is either; 'descriptive', 'detail', 'file-total'
  //Type defaults to 'detail' as that will be the most common
  self.type = type || 'detail';
  if (! _.contains(recordTypeNames, self.type)) {
    var er = "Record Type is not a valid type, must be one of: " + recordTypeNames.toString();
    throw er;
  }

  self.typeId = recordTypes[self.type];

  if (self.type === 'descriptive') {
    var descriptiveRecord = require('./descriptive-record');
    var errors = descriptiveRecord.schema.validate(options);
    if (errors.length > 0) {
      console.log('ERRORS', errors);
    } else {
      //initiate the record with the first element
      //starts with 'type' which will be 0, 1 or 7
      var result = recordTypes[type];
      var columns = descriptiveRecord.columns;
      if (columns.length < 8 ) {
        var er = 'There should be at least 8 columns';
        throw er;
      }
      _.each(descriptiveRecord.columns, function(column) {
        //Set default value to empty string
        //or get the value from options
        var value = '';// || options[column.key];
        //console.log(value);
        if (column.key) {
          value = options[column.key];
        }
        //console.log(value);
        //var value = ''
        result += getEntry(value, column);
      })

      if (! result.length === 120) {
        var er = 'Record length must be exactly 120 characters';
        throw er;
      }

      console.log('validated!', result);
    }
  }

  //var tests = require('./descriptive-record');

  //tests();
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
