"use strict"
//config.js :: all static config, no functions, serves as coded version of spec
//no functions should be in this file
//http://www.cemtexaba.com/aba-format/cemtex-aba-file-format-details.html

if (typeof Meteor === 'undefined' /*import if npm*/) {
  //external
  var Joi = require('joi');
  //internal
  var as = require('./format');
}

var config = {};

config.joi = {
  abortEarly: false,
  stripUnknown: true,
  convert: true,
};

config.recordTypes = {
  'descriptive': { id: '0' },
  'detail': { id: '1' },
  'total': { id: '7' },
};

config.recordTypeNames = Object.keys(config.recordTypes);

//column set up

//first will always be 1 character ID [0, 1 7]
var firstColumn = {
  size: 1,
  key: 'typeId',
  format: as.v
};
//bsb stands for bank state branch. Standard format is ###-###
//http://en.wikipedia.org/wiki/Bank_State_Branch
var bsbRegex = /^[0-9]{3}-[0-9]{3}$/;
//account numbers in the spec can contain '-' and numbers
var accountNumberRegex = /^[0-9-]{1,9}$/;


config.column = { };

//schema for a column object, each record has multiple columns of a set order
config.column.schema = Joi.object().required().keys({
  //max column size 40, no columns are larger in the spec
  size: Joi.number().min(1).max(40).required(),
  //some columns are just fillers of space or zeros, this boolan does not g
  //used currently, potential use in future
  blank: Joi.boolean().optional().default(false),
  //key will be the key for the record object passed in
  key: Joi.string().token().optional(),
  //some columns require space fills, others require zero fil
  //eg. account number 1235 would become 000001245
  fill: Joi.any().valid([' ', '0']).optional().default(' '),
  //the spec uses the term justify, this determines the padding direction
  //eg. right justify padding with zeroes would make 33456 into 334560000000
  justify: Joi.string().valid(['left', 'right']).optional().default('left'),
  //function provided for the column to parse the entry, this is mostly for
  //formatting, in some cases it will provide additional transformation
  //task: I could not get the .default(as.v) to work, need to look at Joi
  format: Joi.func().required(),
});



//Descriptive Record
//This type of record appears once per ABA file and is kind of the header
//It provides details of the transaction as a whole
config.recordTypes.descriptive.columns = [
  firstColumn,
  { size: 17, blank: true, format: as.v },
  { size: 2, key: 'sequence', fill: '0', justify: 'right', format: as.v },
  { size: 3, key: 'bank', format: as.v },
  { size: 7, blank: true, format: as.v },
  { size: 26, key: 'userName', fill: ' ', justify: 'left', format: as.v },
  { size: 6, key: 'userId', fill: '0', justify: 'right', format: as.v },
  { size: 12, key: 'description', fill: ' ', justify: 'left', format: as.v },
  { size: 6, key: 'date', format: as.date },
  { size: 40, blank: true, format: as.v },
];

config.recordTypes.descriptive.schema = Joi.object().required().keys({
  //this seems to be just 1 most of the time
  sequence: Joi.number().min(1).max(99).required(),
  //this needs to be a three letter bank code eg. BQL or WBC
  //readme.md or http://www.thebsbnumbers.com/ - List of Financial Institution Codes
  bank: Joi.string().length(3).uppercase().trim().regex(/^[A-Z]{3}(?:List)?$/).required(),
  //usually the company name
  userName: Joi.string().allow(' ').min(1).max(26).trim().required(),
  //not 100% sure where this number comes from
  userId: Joi.number().min(1).max(999999).required(),
  //name or description of the transaction as a whole eg. payroll or payments
  description: Joi.string().min(1).max(12).alphanum().trim().required(),
  //javascript date required, saves the user from having to format themselves
  date: Joi.date().optional().default(new Date()),
});



//Detail Record
//This record type is for the actual transaction, containing references
//bank details and space for tax if using to submit aba to the ATO for PAYG
//from and to make sense when making payments however, note:
//this format can do a mix of credits & debits
//from will be the originator, the account/bank/log in of the current user
//to will be the receiver, this will most often be external

config.recordTypes.detail.columns = [
  firstColumn,
  { size: 7, key: 'fromBsb', format: as.v },
  { size: 9, key: 'fromAcc', fill: ' ', justify: 'right', format: as.v },
  { size: 1, key: 'indicator', fill: ' ', format: as.indicator },
  { size: 2, key: 'transaction', format: as.v },
  { size: 10, key: 'amount', fill: '0', justify: 'right', format: as.amount },
  { size: 32, key: 'toName', fill: ' ', justify: 'left', format: as.v },
  { size: 18, key: 'toRef', fill: ' ', justify: 'left', format: as.v },
  { size: 7, key: 'toBsb', format: as.v },
  { size: 9, key: 'toAcc', fill: ' ', justify: 'right', format: as.v },
  { size: 16, key: 'fromName', fill: ' ', justify: 'left', format: as.v },
  { size: 8, key: 'tax', fill: '0', justify: 'right', format: as.amount },
];

config.recordTypes.detail.schema = Joi.object().required().keys({
  //originator's name will appear on other person's statement
  fromName: Joi.string().required(),
  //BSB for account to transfer from
  fromBsb: Joi.string().regex(bsbRegex).required(),
  //account number for account to transfer from
  fromAcc: Joi.string().regex(accountNumberRegex).required(),
  //receiver account name, usually first name & last name
  toName: Joi.string().min(1).max(32).required(),
  //reference that will appear on external / receiver statement
  toRef: Joi.string().regex(/^[1-9A-Za-z]{1}[0-9A-Za-z ]{0,17}$/).required(),
  //BSB for account to transfer to
  toBsb: Joi.string().regex(bsbRegex).required(),
  //account number for account to transfer to
  toAcc: Joi.required(),
  //See readme for definition, single space or letter for this record's type
  indicator: Joi.string().valid(['N','W','X','Y']).optional(),
  //See readme, transaction code usually 53
  transaction: Joi.number().valid(
    [13,50,51,52,53,54,55,56,57]).optional().default(53),
  //parse function will make 1103.2321 -> 00000110323 (round, remove decimal, pad)
  amount: Joi.number().min(1).max(99999999).required(),
  //smaller amount but treated as amount, is the tax withheld
  tax: Joi.number().min(0).max(999999).optional().default(0),
});

//File Total Record
//Serves as a checksum & a summary of totals at the bottom of the transaction

config.recordTypes.total.columns = [
  firstColumn,
  //Odd requirement, must always be '999-999' and only ever that
  { size: 7, blank: true,  format: as.bsbFill },
  { size: 12, blank: true, format: as.v },
  { size: 10, key: 'totalNet', format: as.amount },
  { size: 10, key: 'totalCredit', format: as.amount },
  { size: 10, key: 'totalDebit', format: as.amount },
  { size: 24, blank: true, format: as.v },
  { size: 6, key: 'count', fill: '0', justify: 'right', format: as.v },
  { size: 40, blank: true, format: as.v },
];

config.recordTypes.total.schema = Joi.object().required().keys({
  //all totals from the other 'detail' records'
  totalNet: Joi.number().min(1).max(99999999).required(),
  totalCredit: Joi.number().min(1).max(99999999).required(),
  totalDebit: Joi.number().min(1).max(99999999).required(),
  //total count of records with type 1 (detail records) - ie. checksum
  count: Joi.number().min(1).required(),
});


if (typeof module !== 'undefined') {
  module.exports = config;
}
