"use strict"
//external
var moment = require('moment');

//simple set of functions for formatting field values
var as = {};

as.v = function formatAsValue(value) {
  //console.log('this', this, 'value', value);
  var self = this;//will be the column definition
  //console.log('this',this, 'value',value);
  if (value === undefined) {
    console.log('value is undefined', value, self);
  }
  return value.toString().trim().substr(0, self.size);
};

as.amount = function formatAsAmount(value) {
  var self = this;
  return Math.round(value * 100).toString();
};

as.date = function formatAsDate(value) {
  var self = this;//will be the column definition
  return moment(value).format('DDMMYY');
  //console.log('this',this, 'value',value);
  //return 'DDMMYY';//value.toString().trim().substr(0, self.size);
};

as.bsbFill = function () {
  return '999-999';
}

module.exports = as;
