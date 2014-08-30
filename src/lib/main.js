"use strict"
//main.js :: main node module set up & export

//internal
var utils = require('./utils');
var getEntry = utils.getEntry;
var getRecord = utils.getRecord;

//createABA will take a description object and one or more detail objects
//it will return a formatted aba file multi-line text object

//exports.createABA = createABA;
exports.getRecord = getRecord;
