"use strict"
//external
//var schema = require('validate');
var Joi = require('joi');

var config = {};

config.joi = {
  abortEarly: false,
  stripUnknown: true,
};

config.recordTypes = {
  'descriptive': { id: '0' },
  'detail': { id: '1' },
  'file-total': { id: '7' },
};

config.recordTypeNames = Object.keys(config.recordTypes);

//column set up
function parseValue(value) {
  var self = this;//will be the column definition
  //console.log('this',this, 'value',value);
  return value.toString().trim().substr(0, self.size);
}


config.column = {};

config.column.schema = Joi.object().keys({
  size: Joi.number().min(1).max(40).required(),//max column size in spec
  blank: Joi.boolean().optional().default(false),
  key: Joi.string().token().optional(),
  fill: Joi.any().valid([' ', '0']).optional().default(' '),
  justify: Joi.string().valid(['left', 'right']).optional().default('left'),
  parse: Joi.func().required(),
});



//Descriptive Record

config.recordTypes.descriptive.columns = [
  { size: 1, key: 'typeId', parse: parseValue }, //first column is not included, always a 1 char ID
  { size: 17, blank: true, parse: parseValue },
  { size: 2, key: 'seq', fill: '0', justify: 'left', parse: parseValue },
  { size: 3, key: 'bankAbr', parse: parseValue },
  { size: 7, blank: true, parse: parseValue },
  { size: 26, key: 'userSpec', fill: ' ', justify: 'right', parse: parseValue },
  { size: 6, key: 'userId', fill: '0', justify: 'left', parse: parseValue },
  { size: 12, key: 'description', fill: ' ', justify: 'right', parse: parseValue },
  { size: 6, key: 'date', parse: parseValue },
  { size: 40, blank: true, parse: parseValue },
];

config.recordTypes.descriptive.schema = Joi.object().keys({
  seq: Joi.number().min(1).max(99).required(),
  bankAbr: Joi.string().length(3).alphanum().uppercase().trim().required(),
  userSpec: Joi.string().allow(' ').min(1).max(26).trim().required(),
  userId: Joi.number().min(1).max(999999).required(),
  description: Joi.string().min(1).max(12).alphanum().trim().required(),
  date: Joi.date().required(),
});



//Detail Record

// config.recordTypes.detail.columns = [
//   //first column is not included, always a 1char ID
//   { size: 7, key: 'bsb'},
//   { size: 9, key: 'acc', fill: ' ', alignRight: true },
//   { size: 1, key: 'indicator', fill: ' ' },
//   { size: 2, key: 'trCode' },
//   { size: 10, key: 'amount', fill: '0', alignRight: true },
//   { size: 32, key: 'accountTitle', fill: ' ', alignRight: false },
//   { size: 18, key: 'reference', fill: ' ', alignRight: false },
//   { size: 7, key: 'trace' },
//   { size: 9, key: 'accountNumber', fill: ' ', alignRight: true },
//   { size: 16, key: 'remitter', fill: ' ', alignRight: true },
//   { size: 8, key: 'tax', fill: '0', alignRight: true },
// ];


module.exports = config;
