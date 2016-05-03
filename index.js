'use strict';
var fs = require('fs');
var clone = require('clone');
var handleSearch = require('./handleSearch');
var winston = require('winston');

var args = process.argv.slice(2);
if (args.length !== 1) {
    console.log("Usage: node index.js [searches.json]");
    process.exit(1);
}

var config = JSON.parse(fs.readFileSync(args[0], 'utf8'));
if (config.hasOwnProperty("debug") && config.debug) { // optional
    winston.level = "debug";
}


var getDates = function() {
    return clone(config.dates);
};

var execSingleSearch = function () {
    if (config.searches.length > 0) {
        handleSearch(config.searches.shift(), getDates(), config).then(execSingleSearch, function (e) {
            winston.error("Error: " + e);
        });
    } else {
        winston.debug("Finished cleanly.");
    }
};
execSingleSearch();
