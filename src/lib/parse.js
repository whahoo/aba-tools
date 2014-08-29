"use strict"
//external
var moment = require('moment');

var parse = {};

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
