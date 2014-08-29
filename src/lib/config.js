"use strict"
//external
var Joi = require('joi');

//internal
var parse = require('./parse');

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

var bsbRegex = /^[0-9]{3}-[0-9]{3}$/;
var accountNumberRegex = /[0-9-]{1,9}/;
var firstColumn = { //first column is not included, always a 1 char ID
  size: 1,
  key: 'typeId',
  parse: parse.default
};


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
  firstColumn,
  { size: 17, blank: true, parse: parse.default },
  { size: 2, key: 'sequence', fill: '0', justify: 'right', parse: parse.default },
  { size: 3, key: 'bank', parse: parse.default },
  { size: 7, blank: true, parse: parse.default },
  { size: 26, key: 'userName', fill: ' ', justify: 'left', parse: parse.default },
  { size: 6, key: 'userId', fill: '0', justify: 'right', parse: parse.default },
  { size: 12, key: 'description', fill: ' ', justify: 'left', parse: parse.default },
  { size: 6, key: 'date', parse: parse.date },
  { size: 40, blank: true, parse: parse.default },
];

config.recordTypes.descriptive.schema = Joi.object().keys({
  sequence: Joi.number().min(1).max(99).required(),
  bank: Joi.string().length(3).alphanum().uppercase().trim().required(),
  userName: Joi.string().allow(' ').min(1).max(26).trim().required(),
  userId: Joi.number().min(1).max(999999).required(),
  description: Joi.string().min(1).max(12).alphanum().trim().required(),
  date: Joi.date().optional().default(new Date()),
});



//Detail Record

config.recordTypes.detail.columns = [
  firstColumn,
  { size: 7, key: 'fromBsb', parse: parse.default },
  { size: 9, key: 'fromAcc', fill: ' ', justify: 'right', parse: parse.default },
  { size: 1, key: 'indicator', fill: ' ', parse: parse.default },
  { size: 2, key: 'transaction', parse: parse.default },
  { size: 10, key: 'amount', fill: '0', justify: 'right', parse: parse.amount },
  { size: 32, key: 'toName', fill: ' ', justify: 'left', parse: parse.default },
  { size: 18, key: 'toRef', fill: ' ', justify: 'left', parse: parse.default },
  { size: 7, key: 'toBsb', parse: parse.default },
  { size: 9, key: 'toAcc', fill: ' ', justify: 'right', parse: parse.default },
  { size: 16, key: 'fromName', fill: ' ', justify: 'left', parse: parse.default },
  { size: 8, key: 'tax', fill: '0', justify: 'right', parse: parse.amount },
];

config.recordTypes.detail.schema = Joi.object().keys({
  fromName: Joi.required(),
  fromBsb: Joi.string().regex(bsbRegex).required(),
  fromAcc: Joi.string().regex(accountNumberRegex).required(),
  toName: Joi.string().min(1).max(32).required(),
  toRef: Joi.string().regex(/^[1-9A-Za-z]{1}[0-9A-Za-z ]{0,17}$/).required(),
  toBsb: Joi.string().regex(bsbRegex).required(),
  toAcc: Joi.required(),
  indicator: Joi.string().valid([' ','N','W','X','Y']).optional().default(' '),
  transaction: Joi.number().valid([13,50,51,52,53,54,55,56,57]).optional().default(53),
  amount: Joi.number().min(1).max(99999999).required(),
  tax: Joi.number().min(1).max(999999).required(),
});


module.exports = config;
