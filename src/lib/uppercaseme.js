//uppercaseme.js
//http://www.anupshinde.com/posts/how-to-create-nodejs-npm-package/
"use strict"
var fs = require('fs');

function convertThis() {
  if ( process.argv.length > 2 ) {
    var myFile = process.argv[2];
    if ( fs.existsSync( myFile ) ) {
      var content = fs.readFileSync(myFile, 'utf8');
      fs.writeFileSync( myFile, content.toUpperCase() );
      console.log( "Done" );
    } else {
      console.log( "File does not exist - " + myFile );
    }
  } else {
    console.log( "ERROR: Pass on a file name/path" );
  }
}

exports.convert = convertThis;
