'use strict';
var Flights = require('./flights');
var Promise = require('promise');
var moment = require('moment');
var fs = require('fs');

var args = process.argv.slice(2);
if (args.length != 1) {
    console.log("Usage: node index.js [searches.json]");
    process.exit(1);
}

var config = JSON.parse(fs.readFileSync(args[0], 'utf8'));
var f = Flights();

// get month by month search list
var getMonthList = function() {
    var dates = [];
    var nextMonth = moment().month() + 2; // next month, and fix zero indexing
    if (nextMonth <= 12) {
        for (var month = nextMonth; month <= 12; ++month) {
            // this year
            dates.push({month: month, year: moment().isoWeekYear()});
        }
    }
    // up to 11 months from now
    for (var month = 1; month <= moment().month(); ++month) {
        // next year
        dates.push({month: month, year: moment().isoWeekYear() + 1});
    }
    return dates;
}

var singleSearch = function(search) {
    //console.log(search);
    var dates = getMonthList();
    return new Promise(function (resolve1, reject1) {
        var doSearch = function(date) {
            //console.log(date);
            return new Promise(function (resolve2, reject2) {
                f.search({
                    fromAirports: config.from,
                    toAirports: search.to,
                    fromDays: 12,
                    toDays: 14,
                    year: date.year,
                    month: date.month,
                }).then(function(response) {
                    try {
                        var options = response.searchOptions;
                        //console.log("results: ", response.results);
                        var cheapestResult = f.cheapest(response.results);
                        if (cheapestResult !== null) {
                            //console.log("cheapestResult: ", cheapestResult);
                            if (cheapestResult.priceInt <= search.threshold || config.showAll) {
                                var formatted = options.fromAirports.join(",") +
                                        "-" +
                                        options.toAirports.join(",") +
                                        " in " + options.year + "/" + options.month + ": " +
                                        f.format(cheapestResult);
                                return resolve2(formatted);
                            }
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

        var err = function (e) {
            reject1(e);
        };

        var execSearch = function () {
            if (dates.length > 0) {
                doSearch(dates.shift()).then(dealWithResult, err);
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
