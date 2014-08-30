"use strict"
//external
var moment = require('moment');

var parse = {};

//task: rename to not parse
//parse infers something different
//could be getField.default etc
//getField makes sense, similar to others

//task: move the justify part to this code

parse.default = function parseValue(value) {
  console.log('this', this, 'value', value);
  var self = this;//will be the column definition
  //console.log('this',this, 'value',value);
  return value.toString().trim().substr(0, self.size);
};

parse.amount = function parseAmount(value) {
  var self = this;
  return Math.round(value * 100).toString();
};

parse.date = function parseDate(value) {
  var self = this;//will be the column definition
  return moment(value).format('DDMMYY')
  //console.log('this',this, 'value',value);
  //return 'DDMMYY';//value.toString().trim().substr(0, self.size);
};

parse.bsbFill = function () {
  return '999-999';
}

module.exports = parse;
