Tasks
------
 - [x] ~~Update folders; src/main.js & then lib/all-others & rename helpers back to utils~~
 - [x] ~~utils should export one thing only, so utils.getSomething etc~~
 - [x] ~~Software Licence~~
 - [x] ~~Set up config for other record types~~
 - [x] ~~Set up tests (Jasmine or cucumber or http://qunitjs.com/)~~ (used mocha)
 - [x] ~~rename parse functions to 'as' to clear up namespace~~
 - [ ] Investigate a hybrid meteor/npm module (ie. if(meteor){thing = joe} else {var thing = require...})
    - [ ] Probably set up a master branch & then an npm & meteor branch
 - [ ] More Complex validation required for transaction codes
 - [ ] Set up totals to work, assuming 53 only (credit/debit)
 - [ ] Set up code to build basic file from correct input
 - [x] ~~Rebuild tests from the change to Joi~~
 - [ ] Implement semver (update readme.md & start using versioning)
 - [ ] Better handling of BSB numbers, should be able to provide 033445 (no space) or 322 232 (with space)


Low Priority Tasks
-----
- [ ] Set up grunt (adding licence to files & version numbers) or research gulp
- [ ] Investigate https://travis-ci.org/ for Continuous Integration good section near end here: http://evanhahn.com/make-an-npm-baby/
