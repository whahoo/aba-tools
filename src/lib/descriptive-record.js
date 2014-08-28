// Descriptive Record
var schema = require('validate');
var _ = require('underscore');
var utils = require('./utils');

var descriptiveRecord = {};

descriptiveRecord.columns = [
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


//Should be part of the testing suite
function checkColumns () {
  var totalCharsInColumns =_.reduce(descriptiveRecord.columns, function (total, column) {
    var errors = utils.columnSchema.validate(_.extend(utils.columnDefaults, column));
    if (errors.length > 0) {
      var er = 'Column has validation errors: ' + errors.toString();
      throw er;
    }
    //console.log(column);
    return total + column.size;
  }, 1);//initial value is 1 as we do not define the record type column
  if ( totalCharsInColumns !== 120 ) {
    var er = 'Column Size Total should eqaul 120, it is ' + totalCharsInColumns;
    throw er;
  }
}
checkColumns();

descriptiveRecord.schema = schema({
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

//expose this schema
module.exports = descriptiveRecord;

//expose tests
//module.exports = tests;

//testing stuff
function tests() {
  console.log('Empty Object ', descriptiveRecord.validate({}));
  console.log('Should Fail ', descriptiveRecord.validate({
    seq: 1,
    bankAbr: 'WBCA',
    userSpec: '',
    userId: '',
    description: 'Payments ULTURA LUNGH ANMAM',
    date: '31122014',
  }));
  console.log('Should Pass ', descriptiveRecord.validate({
    seq: 1,
    bankAbr: 'WBC',
    userSpec: 'LIFE CHURCH',
    userId: '252359',
    description: 'Payments',
    date: '311214',
  }));
}
