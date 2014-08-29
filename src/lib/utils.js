"use strict"
//external
//var schema = require('validate');
var _ = require('underscore');
var S = require('string');
//var ValidationError = require("error/validation");
//var OptionError = require("error/option");
var Joi = require('joi');

//internal
var config = require('./config');
var recordTypes = config.recordTypes;
var recordTypeNames = config.recordTypeNames;

// function getValErrors (validationErrors) {
//   var result = [];
//   _.each(validationErrors, function (error) {
//     var message = error.split(':');
//     result.push({message: message[1], attribute: message[0]});
//   });
//   return result;
// }


function getEntry (value, column) {
  var value, column, result;
  //var options = _.extend(_.clone(config.column.defaultOptions), options);
  //var options = _.defaults(options, config.column.defaultOptions);
  Joi.validate(column, config.column.schema, config.joi, function (error, response) {
    if (error) {
      throw error;
    } else {
      //options = columnValidate.value;
      //this should be a function based on the column.parse
      //console.log('value', value, 'column', column);
      value = column['parse'](value);;
      //value.toString().trim().substr(0, column.size);
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
    //console.log('values', values);
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
  //var options = options;
  //Type is either; 'descriptive', 'detail', 'file-total'
  //Type defaults to 'detail' as that will be the most common
  Joi.validate(type,
    Joi.valid(recordTypeNames).default('detail').optional(),
    config.joi, function (error, response) {
      if (error) throw error;
      type = response;
    }
  );

  //typeId = recordTypes[type].id;
  //result = typeId;

  Joi.validate(values, recordTypes[type].schema, config.joi,
    function (error, response) {
      if (error) {
        throw error
      } else {
        //console.log('type: ',type, 'values: ', values, 'columns: ', columns);
        result = getColumns(
          _.extend(values, {type: type, typeId: recordTypes[type].id}),
          columns
        );
        //console.log('result processed', result);
      }
    }
  );

  if (! result.length === 120) {
    //could use Joi here also
    throw new Error('Record length must be exactly 120 characters');
  }

  return result;
}

//exports.ValidationError = ValidationError;
exports.getEntry = getEntry;
exports.getRecord = getRecord;
