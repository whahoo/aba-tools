"use strict"
//external
var _ = require('underscore');
var S = require('string');
var Joi = require('joi');

//internal
var config = require('./config');
var recordTypes = config.recordTypes;
var recordTypeNames = config.recordTypeNames;

function getEntry (value, column) {
  var value, column, result;
  Joi.validate(column, config.column.schema, config.joi, function (error, response) {
    if (error) {
      throw error;
    } else {
      //this should be a function based on the column.parse
      value = column['parse'](value);;
      if (column.justify === 'right') {
        result = S(value).padLeft(column.size, column.fill).s;
      } else {
        result = S(value).padRight(column.size, column.fill).s;
      }
    }
  });
  return result;
};

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
    return result;
  }
};



function getRecord(type, values) {
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

  Joi.validate(values, recordTypes[type].schema, config.joi,
    function (error, response) {
      if (error) {
        throw error
      } else {
        result = getColumns(
          _.extend(values, {type: type, typeId: recordTypes[type].id}),
          columns
        );
      }
    }
  );

  if (! result.length === 120) {
    //could use Joi here also
    throw new Error('Record length must be exactly 120 characters');
  }

  return result;
}

exports.getEntry = getEntry;
exports.getColumns = getColumns;
exports.getRecord = getRecord;
