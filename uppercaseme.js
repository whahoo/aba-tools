//http://www.anupshinde.com/posts/how-to-create-nodejs-npm-package/
//uppercaseme.js

"use strict"
var fs = require('fs');
var myFile = "myfile.txt";

if ( fs.existsSync( myFile ) ) {
  var content = fs.readFileSync(myFile, 'utf8');
  fs.writeFileSync( myFile, content.toUpperCase() );
  console.log( "Done" );
} else {
  console.log( "File does not exist - " + myFile );
}
