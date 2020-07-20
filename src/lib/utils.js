"use strict";

if (typeof Meteor === "undefined" /*import if npm*/) {
  //external
  var _ = require("underscore");
  var _s = require("underscore.string");
  var Joi = require("joi");

  //internal
  var config = require("./config");
  var recordTypes = config.recordTypes;
  var recordTypeNames = config.recordTypeNames;
}

var utils = {};

utils.checkType = function checkType(type, excludeTotal) {
  var type = type || null;
  var excludeTotal = excludeTotal || false;
  var local_recordTypeNames = recordTypeNames;
  //Type is either; 'descriptive', 'detail', 'file-total'
  //Type defaults to 'detail' as that will be the most common
  if (excludeTotal) {
    local_recordTypeNames = _.without(_.clone(recordTypeNames), "total");
  }
  const schema = Joi.any()
    .valid(...local_recordTypeNames)
    .default("detail")
    .optional();
  const { error, value } = schema.validate(type, config.joi);
  if (error) throw error;
  return type;
};

//justifying is the last step, this pads with zeros or spaces
utils.justifyValue = function justifyValue(value, size, fill, justify) {
  var result;
  if (justify === "right") {
    result = _s.lpad(value, size, fill);
  } else {
    result = _s.rpad(value, size, fill);
  }
  return result;
};

//Return a fully parsed entry as a string
//This processes an entry based on a column object
utils.getEntry = function getEntry(in_value, column) {
  var in_value, column, result;
  //check that the column is valid according to the schema
  const { error, value } = config.column.schema.validate(column, config.joi);
  if (error) throw error;
  in_value = column["format"](in_value);
  result = utils.justifyValue(
    in_value,
    column.size,
    column.fill,
    column.justify
  );
  //always return something
  //task: maybe validate this is a string longer than 0 characters
  return result;
};

//For an object of values and an array of columns process each column
utils.getColumns = function getColumns(values, columns) {
  var values, columns, result;
  result = "";
  if (columns.length < 8) {
    throw new Error("There should be at least 8 columns", columns);
  } else {
    _.each(columns, function (column) {
      //Set default value to empty string or get the value from options
      var value = "";
      if (column.key) {
        value = values[column.key];
      }
      result += utils.getEntry(value, column);
    });
  }
  //always return something
  //task: one more step of validation?
  return result;
};

//returns a record, which is essentially a row in the final ABA file
//each record has a type and that type determines the columns and validation
utils.getRecord = function getRecord(type, values) {
  var result, type, values, columns;
  type = utils.checkType(type);
  columns = recordTypes[type].columns;
  //validate the value object provided based on the schema for that record type
  const { error, value } = recordTypes[type].schema.validate(
    values,
    config.joi
  );
  if (error) throw error;
  var values = _.extend({ type: type, typeId: recordTypes[type].id }, value);
  result = utils.getColumns(values, columns);

  if (!result.length === 120) {
    //task: could use Joi here also
    throw new Error("Record length must be exactly 120 characters");
  }

  return result;
};

if (typeof module !== "undefined") {
  module.exports = utils;
}
