'use strict';
var Flights = require('./flights');
var Promise = require('promise');
var moment = require('moment');
var fs = require('fs');
var clone = require('clone');

var args = process.argv.slice(2);
if (args.length != 1) {
    console.log("Usage: node index.js [searches.json]");
    process.exit(1);
}

var config = JSON.parse(fs.readFileSync(args[0], 'utf8'));
var f = Flights();

var getDates = function() {
    return clone(config.dates);
};

var nextSearch = function() {
    var dates = getDates();

    var singleSearch = function(search) {
        return new Promise(function (resolve1, reject1) {
            var doSearch = function(date) {
                return new Promise(function (resolve2, reject2) {
                    var searchOptions = {
                        fromAirports: config.from,
                        toAirports: search.to,
                        fromDays: config.duration.from,
                        toDays: config.duration.to,
                        year: date.year,
                        month: date.month,
                    };
                    f.search(searchOptions).then(function(response) {
                        try {
                            var cheapestResult = f.cheapest(response.results);
                            if (cheapestResult !== null && cheapestResult.priceInt <= search.threshold || config.showAll) {
                                var formatted = searchOptions.fromAirports.join(",") + "-" +
                                        searchOptions.toAirports.join(",") + " in " + searchOptions.year + "/" +
                                        searchOptions.month + ": " + f.format(cheapestResult);
                                return resolve2(formatted);
                            }
                            return resolve2(null);
                        } catch (e) {
                            return reject2(e);
                        }
                    }, function (error) {
                        return reject2(e);
                    });
                });
            }

            var execSearch = function () {
                if (dates.length > 0) {
                    doSearch(dates.shift()).then(dealWithResult, reject1);
                } else {
                    resolve1();
                }
            };

            var dealWithResult = function (result) {
                if (result !== null) {
                    // under threshold, print the flight
                    console.log(result);
                }
                execSearch();
            };

            // start the first search
            execSearch();
        });
    }

    var execSingleSearch = function () {
        if (config.searches.length > 0) {
            singleSearch(config.searches.shift()).then(execSingleSearch, function (e) {
                console.log("Error: ", e);
            });
        } else {
            //console.log("Finished cleanly.");
        }
    }

    execSingleSearch();
}
