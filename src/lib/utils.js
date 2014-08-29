"use strict"
//external
var schema = require('validate');
var _ = require('underscore');
var S = require('string');
var ValidationError = require("error/validation");
var OptionError = require("error/option");

//internal
var config = require('./config');
var recordTypes = config.recordTypes;
var recordTypeNames = config.recordTypeNames;

function getValErrors (validationErrors) {
  var result = [];
  _.each(validationErrors, function (error) {
    var message = error.split(':');
    result.push({message: message[1], attribute: message[0]});
  });
  return result;
}


function getEntry(value, options) {
  var result, entry;
  //var options = _.extend(_.clone(config.column.defaultOptions), options);
  var options = _.defaults(options, config.column.defaultOptions);
  var errors = config.column.schema.validate(options);
  if (errors.length > 0) {
    throw new ValidationError(getValErrors(errors));
  } else {
    entry = value.toString().trim().substr(0, options.size);
    if (options.alignRight) {
      result = S(entry).padLeft(options.size, options.fill).s;
    } else {
      result = S(entry).padRight(options.size, options.fill).s;
    }
  }
  return result;
};


function getRecord(type, options) {
  var result, typeId;
  var type = type || 'detail';
  var options = options;
  //Type is either; 'descriptive', 'detail', 'file-total'
  //Type defaults to 'detail' as that will be the most common
  if (! _.contains(recordTypeNames, type)) {
    throw new Error( "Record Type must be one of: " + recordTypeNames.toString() );
  }

  typeId = recordTypes[type].id;
  result = typeId;

  var errors = recordTypes[type].schema.validate(options);
  if (errors.length > 0) {
    throw new ValidationError(getValErrors(errors));
  } else {
    //initiate the record with the first element
    //starts with 'type' which will be 0, 1 or 7
    var columns = recordTypes[type].columns;
    if (columns.length < 8 ) {
      throw new Error('There should be at least 8 columns', columns);
    }
    _.each(columns, function(column) {
      //Set default value to empty string
      //or get the value from options
      var value = '';
      if (column.key) {
        value = options[column.key];
      }
      result += getEntry(value, column);
    });

    if (! result.length === 120) {
      throw new Error('Record length must be exactly 120 characters');
    }
  }
  return result;
}

exports.ValidationError = ValidationError;
exports.getEntry = getEntry;
exports.getRecord = getRecord;
