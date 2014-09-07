"use strict"

//external
var assert = require('assert');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var Joi = require('joi');

//internal
var src = path.join(path.dirname(fs.realpathSync(__filename)), '../src');
var lib = path.join(path.dirname(fs.realpathSync(__filename)), '../src/lib');
var config = require(lib + '/config');
var recordTypes = config.recordTypes;
var recordTypeNames = config.recordTypeNames;
var utils = require(lib + '/utils');
var getEntry = utils.getEntry;
var getColumns = utils.getColumns;
var getRecord = utils.getRecord;

var ABA = require(src + '/main');


function testBadInputs (recordType, fieldKey, badInputs, values) {
  var badInputs = badInputs || [];
  var fieldKey = fieldKey || 'title not provided';
  _.each(badInputs, function (badInput) {
    var i = {};
    i[fieldKey] = badInput;
    var badInputs = _.extend(_.clone(values), i);
    if (badInput === 'not provided') {
      delete badInputs[fieldKey];
    }
    //this regex makes sure that the errir is a ValidationError AND includes the fieldkey name
    //otherwise validataion errors may pass that are caused by something else
    var errorRegex = new RegExp("^(?=.*\\bValidationError\\b)(?=.*\\b"+fieldKey+"\\b).*$");
    it("should throw ValidationError if " + fieldKey + " is [ " + badInput + " ]", function () {
      assert.throws(
        function () { getRecord(recordType, badInputs) },
        errorRegex
      );
    });
  });
};


// configuration integrity tests

describe('# config', function () {
  _.each(['descriptive', 'detail', 'total'], function (type) {
    describe('Config for ' + type + ' Columns', function () {

      it('should get a total of 120 characters', function () {
        var totalCharsInColumns = _.reduce(recordTypes[type].columns, function (total, column) {
          return total + column.size;
        }, 0);
        assert.equal(120, totalCharsInColumns);
      });

      it('should validate each column against the column schema', function () {
        _.each(recordTypes[type].columns, function (column) {
          Joi.validate(column, config.column.schema, config.joi, function (error, response) {
            if (error) {
              throw error;
              //not sure if this should be done differently in test env.
            }
          });
        });
      });


    });
  });

});


describe('# utils', function () {
  var good = {
    descriptive: {},
    detail: {},
    total: {},
  };

  good.descriptive.values = {
    sequence: 1,
    bank: 'WBC',
    userName: 'TRANSPORT CO',
    userId: '212459',
    description: 'Payments',
    date: new Date(),
  };

  good.detail.values = {
    fromName: 'Transport Co',
    fromBsb: '034-213',
    fromAcc: '991882',
    toName: 'Billy Andrews',
    toRef: 'INV 3217B',
    toBsb: '117-213',
    toAcc: '00112228',
    //indicator: ' ',
    transaction: 50,
    amount: 1189.22,
    //tax: ,
  };

  good.total.values = {
    totalNet: 3523.32,
    totalCredit: 8271.82,
    totalDebit: 4748.50,
    count: 12,
  };

  describe('getRecord()', function () {


    it("should throw ValidationError if type is not 'descriptive', 'detail' or 'file-total'", function () {

      _.each(['foo','#'], function (v) {
        assert.throws(
          function () {
            getRecord(v, good.descriptive.values)
          },
          /ValidationError/
        );
      });

    });

  });

  describe('descriptive record', function () {

      describe('sequence', function () {
        testBadInputs( 'descriptive', this.title, ['not provided', null, undefined, 'a'], good.descriptive.values);
      });

      describe('bank', function () {
        testBadInputs( 'descriptive', this.title, ['not provided', null, undefined, 'a', 'ab', 'abcd', '###', 123, '123'], good.descriptive.values);
      });

      describe('userName', function () {
        testBadInputs( 'descriptive', this.title, ['not provided', null, undefined, '',], good.descriptive.values);
      });

      describe('userId', function () {
        testBadInputs( 'descriptive', this.title, ['not provided', null, undefined, ''], good.descriptive.values);
      });

      describe('description', function () {
        testBadInputs( 'descriptive', this.title, ['not provided', null, undefined, '', 'very long description', 1232344], good.descriptive.values);
      });

      describe('date', function () {
        testBadInputs( 'descriptive', this.title, ['a', 'ab', 'abcd', '###', '23/12/2014'], good.descriptive.values);
      });

  });

  describe('detail record', function () {

      describe('fromName', function () {
        testBadInputs( 'detail', this.title,
          ['not provided', null, undefined, {}, [], 0, 123],
          good.detail.values
        );
      });

      describe('fromBsb', function () {
        testBadInputs( 'detail', this.title,
          ['not provided', null, undefined, {}, [], 0, 123382, 'abc-def', 'WBC', '452 234', '305123'],
          good.detail.values
        );
      });

      describe('fromAcc', function () {
        testBadInputs( 'detail', this.title,
          ['not provided', null, undefined, {}, [], 0, 123382, 'abc-def', 'WBC'],
          good.detail.values
        );
      });

      describe('toName', function () {
        testBadInputs( 'detail', this.title,
          ['not provided', null, undefined, {}, [], 0, 'this is way way way way way too long'],
          good.detail.values
        );
      });

      describe('toBsb', function () {
        // is similar enough for now to fromBsb
      });

      describe('toAcc', function () {
        // is similar enough for now to fromAcc
      });

      describe('toRef', function () {
        testBadInputs( 'detail', this.title,
          ['not provided', null, undefined, {}, [], 0, ' Start With Spc', 'has-dashes', 'this is way too long'],
          good.detail.values
        );
      });

      describe('indicator', function () {
        testBadInputs( 'detail', this.title,
          [null, {}, [], 0, 'abc-def', 'M', 'Z'],
          good.detail.values
        );
      });

      describe('transaction', function () {
        testBadInputs( 'detail', this.title,
          [0, 14, null],
          good.detail.values
        );
      });

      describe('amount', function () {
        // task
      });

      describe('tax', function () {
        // task
      });


  });


  describe('total record', function () {

      describe('totalNet', function () {
        testBadInputs( 'total', this.title,
          ['not provided', null, undefined, 'a', {}, [], 0, 999999999],
          good.total.values
        );
      });

      describe('totalCredit', function () {
        testBadInputs( 'total', this.title,
          ['not provided', null, undefined, 'a', {}, [], 0, 999999999],
          good.total.values
        );
      });

      describe('totalDebit', function () {
        testBadInputs( 'total', this.title,
          ['not provided', null, undefined, 'a', {}, [], 0, 999999999],
          good.total.values
        );
      });

      describe('count', function () {
        testBadInputs( 'total', this.title,
          ['not provided', null, undefined, 'a', {}, [], 0, -1],
          good.total.values
        );
      });

  });

  describe('getEntry()', function () {

    _.each([{}, null, undefined, ''], function (v) {

      it("should throw ValidationError when value is: '" + v + "'", function () {
        assert.throws(
          function () {
            getEntry('any value will do', v)
          },
          /ValidationError/
        );
      });

    });

  });

});


describe ('#ABA', function () {
  //mocha -g 'ABA';

  var myDetailRecordValues = [{
    fromName: 'Transport Co',
    fromBsb: '034-069',
    fromAcc: '3392881',
    //indicator: ' ',
    //transaction: ,
    amount: 30199.00,
    toName: 'Leryooy Jenkins',
    toRef: 'INV 1235B',
    toBsb: '189-213',
    toAcc: '009872',
    //tax: ,
  },{
    fromName: 'Transport Co',
    fromBsb: '034-069',
    fromAcc: '3392881',
    //indicator: ' ',
    //transaction: ,
    amount: 1103.20,
    toName: 'Jeffson Angus',
    toRef: 'Reimbursement',
    toBsb: '673-213',
    toAcc: '10118821',
    //tax: ,
  }];

  var myDetailRecord = {
    fromName: 'Transport Co',
    fromBsb: '034-069',
    fromAcc: '3392881',
    //indicator: ' ',
    //transaction: ,
    amount: 220.13,
    toName: 'Printing Co.',
    toRef: 'PX11081',
    toBsb: '901-109',
    toAcc: '39810029',
    //tax: ,
  }


  var myDescriptiveRecord = {
    sequence: 1,
    bank: 'WBC',
    userName: 'LIFE CHURCH',
    userId: '252359',
    description: 'Payments',
    //date: '311214',
  };

  //var fancyNewAba = new ABA(myDescriptiveRecord, myDetailRecordValues);
  var fancyNewAba = new ABA();
  fancyNewAba.addDescriptiveRecord(myDescriptiveRecord);
  fancyNewAba.addDetailRecords(myDetailRecordValues);
  fancyNewAba.addRecord('detail', myDetailRecord);
  //console.log(fancyNewAba);
  console.log(fancyNewAba.export());


});
