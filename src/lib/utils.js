//Utils for across application
var schema = require('validate');
var utils = {};

utils.columnDefaults = {
  fill: ' ',
  key: null,
  alignRight: true,
};

//Column Schema Definition
//might use this in future for internal testing
//for now this is just here to define what the column should be
utils.columnSchema = schema({
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

module.exports = utils;
