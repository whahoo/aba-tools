"use strict"
//external
var _ = require('underscore');
var S = require('string');
var Joi = require('joi');

//internal
var config = require('./config');
var recordTypes = config.recordTypes;
var recordTypeNames = config.recordTypeNames;

//Return a fully parsed entry as a string
//This processes an entry based on a column object
function getEntry (value, column) {
  var value, column, result;
  //check that the column is valid according to the schema
  Joi.validate(column, config.column.schema, config.joi, function (error, response) {
    if (error) {
      throw error;
    } else {
      //this should be a function based on the column.parse
      value = column['parse'](value);;
      //justifying is the last step, this pads with zeros or spaces
      //task: this should be moved to the parse function (in all of them)
      if (column.justify === 'right') {
        result = S(value).padLeft(column.size, column.fill).s;
      } else {
        result = S(value).padRight(column.size, column.fill).s;
      }
    }
  });
  //always return something
  //task: maybe validate this is a string longer than 0 characters
  return result;
};


//For an object of values and an array of columns process each column
function getColumns (values, columns) {
  var values, columns, result;
  result = '';
  if (columns.length < 8 ) {
    throw new Error('There should be at least 8 columns', columns);
  } else {
    _.each(columns, function(column) {
      //Set default value to empty string or get the value from options
      var value = '';
      if (column.key) {
        value = values[column.key];
      }
      result += getEntry(value, column);
    });
  }
  //always return something
  //task: one more step of validation?
  return result;
};

//returns a record, which is essentially a row in the final ABA file
//each record has a type and that type determines the columns and validation
function getRecord (type, values) {
  var result, type, values, columns;
  columns = recordTypes[type].columns;
  //Type is either; 'descriptive', 'detail', 'file-total'
  //Type defaults to 'detail' as that will be the most common
  Joi.validate(type,
    Joi.valid(recordTypeNames).default('detail').optional(),
    config.joi, function (error, response) {
      if (error) throw error;
      type = response;
    }
  );
  //validate the value object provided based on the schema for that record type
  Joi.validate(values, recordTypes[type].schema, config.joi,
    function (error, response) {
      if (error) {
        throw error
      } else {
        //add tye type & typeId to the values sent to getColmns
        var values = _.extend(values, { type: type, typeId: recordTypes[type].id }),
        result = getColumns(values, columns);
        );
      }
    }
  );

  if (! result.length === 120) {
    //task: could use Joi here also
    throw new Error('Record length must be exactly 120 characters');
  }

  return result;
}

function createABA (descriptiveRecord, detailRecords) {
  var descriptiveRecord = {
    sequence: 3,
    bank: 'QBL',
    userName: 'Transport Co',
    userId: '12377',
    description: 'Payments',
    date: new Date,
  };
  /*
    task: create this function
    single descriptive record like above
    array of objects that represent detailrecords
    return an object like the one below
  */
  return {
    //not sure on best convetion
    //current thoughts...
    result: "large multi line string",//can I do this?
    lines: [
      'first row as descriptive record',
      'one or more detail records',
      'total record',
    ],
    //descriptiveRecord: descriptiveRecord,// include original sent?
    //detailRecords: detailRecords, //include original?
    //if I end up doing an ABA.
    totals: {
      net: 123.00,
      credit: 456.00,
      debit: 789.00,
      count: 23,
    },
};

//task: how to expand the api for future
// ABA.generate(...) as above
// ABA.validate(big multi line string or array of lines)
// ABA.parse // might mean I need to rename the parse functions

exports.getEntry = getEntry;
exports.getColumns = getColumns;
exports.getRecord = getRecord;
