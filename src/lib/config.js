"use strict"
var schema = require('validate');
var config = {};

config.recordTypes = {
  'descriptive': { id: '0' },
  'detail': { id: '1' },
  'file-total': { id: '7' },
};

config.recordTypeNames = Object.keys(config.recordTypes);

//column set up

config.column = {};

config.column.defaultOptions = {
  fill: ' ',
  key: null,
  alignRight: true,
};

config.column.schema = schema({
  size: {
    type: 'number',
    required: true,
    message: 'Must be a number, the length of the field.',
  },
  key: {
    type: 'string',
    //required: false, //commented out as this works
    message: 'Valid key in record options object',
  },
  fill: {
    type: 'string',
    required: true,
    match: new RegExp("^[0 ]$"),
    message: 'Single padding character, usually a space or 0.',
  },
  alignRight: {
    type: 'boolean',
    required: true,
    message: '',
  },
});



//descriptive record
config.recordTypes.descriptive.columns = [
  //first column is not included, always a 1char ID
  { size: 17 }, //blank column
  { size: 2, key: 'seq', fill: '0', alignRight: true },
  { size: 3, key: 'bankAbr' },
  { size: 7 }, //blank column
  { size: 26, key: 'userSpec', fill: ' ', alignRight: false },
  { size: 6, key: 'userId', fill: '0', alignRight: true },
  { size: 12, key: 'description', fill: ' ', alignRight: false },
  { size: 6, key: 'date'},
  { size: 40 }, //blank column
];

config.recordTypes.descriptive.schema = schema({
  seq: {
    type: 'number',
    required: true,
    match: new RegExp("(0?[1-9]|[1-9][0-9])"),
    message: "seq: Reel Sequence Number. Must be numeric commencing at 1.",
  },
  bankAbr: {
    type: 'string',
    required: true,
    match: new RegExp("^.{3}$"),
    message: "bankAbr: 3 chars. Must be approved Financial Institution abbreviation.",
  },
  userSpec: {
    type: 'string',
    required: true,
    match: new RegExp("^.{1,26}$"),
    message: "userSpec: 1 to 26 chars. Must be User Preferred Specification as advised by User's FI",
  },
  userId: {
    type: 'string',
    required: true,
    match: new RegExp("^.{1,6}$"),
    message: "userId: 1 to 6 chars. Must be User Identification Number which is allocated by APCA",
  },
  description: {
    type: 'string',
    required: true,
    match: new RegExp("^.{1,12}$"),
    message: "description: 1 to 12 chars. All coded character set valid. Must not be all blanks",
  },
  date: {
    type: 'string',
    required: true,
    match: new RegExp("^([0-9]{2})([0-9]{2})([0-9]{2})$"),
    message: "date: Must be numeric in the format of DDMMYY.",
  }
});

module.exports = config;
