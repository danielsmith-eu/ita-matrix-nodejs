'use strict';
var Flights = require('./flights');
var Promises = require('promise');
var permute = require('./permute');
module.exports = function(search, dates, config) {
    var dryRun = config.hasOwnProperty("dryRun") && config.dryRun;
    var searchPerms = permute(dates, config.from, search.to);
    
    var f = new Flights(config);
    return new Promises(function (resolve1, reject1) {
        var doSearch = function (searchPerm) {
            console.log("Searching for: " + JSON.stringify(searchPerm));
            return new Promises(function (resolve2, reject2) {
                var searchOptions = {
                    fromAirports: searchPerm.from,
                    toAirports: searchPerm.to,
                    fromDays: config.duration.from,
                    toDays: config.duration.to,
                    year: searchPerm.date.year,
                    month: searchPerm.date.month,
                };
                f.search(searchOptions).then(function (response) {
                    try {
                        var cheapestResult = f.cheapest(response.results);
                        if ((cheapestResult !== null && cheapestResult.priceInt <= search.threshold) || (config.showAll && !dryRun)) {
                            var formatted = searchOptions.fromAirports.join(",") + "-" +
                                searchOptions.toAirports.join(",") + " in " + searchOptions.year + "/" +
                                searchOptions.month + ": " + f.format(cheapestResult);
                            return resolve2(formatted);
                        }
                        return resolve2(null);
                    } catch (e) {
                        console.trace("handleSearch");
                        return reject2(e);
                    }
                }, reject2);
            });
        };

        var execSearch = function () {
            if (searchPerms.length > 0) {
                doSearch(searchPerms.shift()).then(dealWithResult, function (e) {
                    console.log("Error in search, continuing with next: ", e);
                    execSearch(); // skips dealWithResult, execs next
                });
            } else {
                resolve1();
            }
        };

        var dealWithResult = function (result) {
            if (result !== null) { // under threshold, print the flight
                console.log(result);
            }
            execSearch();
        };

        // start the first search
        execSearch();
    });

};