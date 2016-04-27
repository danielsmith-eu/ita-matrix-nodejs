'use strict';
var Promises = require('promise');
var fs = require('fs');
var clone = require('clone');
var handleSearch = require('./handleSearch');

var args = process.argv.slice(2);
if (args.length !== 1) {
    console.log("Usage: node index.js [searches.json]");
    process.exit(1);
}

var config = JSON.parse(fs.readFileSync(args[0], 'utf8'));

var getDates = function() {
    return clone(config.dates);
};

var execSingleSearch = function () {
    if (config.searches.length > 0) {
        handleSearch(config.searches.shift(), getDates(), config).then(execSingleSearch, function (e) {
            console.trace("index");
            console.log("Error: ", e);
        });
    } else {
        //console.log("Finished cleanly.");
    }
};
execSingleSearch();
