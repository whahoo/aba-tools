//http://www.anupshinde.com/posts/how-to-create-nodejs-npm-package/
//uppercaseme.js
"use strict"
var fs = require('fs');

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
