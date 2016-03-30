'use strict';
var Flights = require('./flights');
var Promise = require('promise');
var moment = require('moment');

var f = Flights();

var dates = [];
var nextMonth = moment().month() + 2; // next month, and fix zero indexing
if (nextMonth <= 12) {
    for (var month = nextMonth; month <= 12; ++month) {
        // this year
        dates.push({month: month, year: moment().isoWeekYear()});
    }
}
for (var month = 1; month <= moment().month() + 1; ++month) {
    // next year
    dates.push({month: month, year: moment().isoWeekYear() + 1});
}

var doSearch = function(date) {
    return new Promise(function (resolve, reject) {
        f.search({
            fromAirports: ["DUB"],
            toAirports: ["LAS"],
            fromDays: 12,
            toDays: 14,
            year: date.year,
            month: date.month,
        }).then(function(response) {
            try {
                var options = response.searchOptions;
                var cheapestResult = f.cheapest(response.results);
                return resolve(options.fromAirports.join(",") +
                        "-" +
                        options.toAirports.join(",") +
                        " in " + options.year + "/" + options.month + ": " +
                        f.format(cheapestResult));
            } catch (e) {
                return reject(e);
            }
        }, function (error) {
            return reject(e);
        });
    });
}

var err = function (e) {
    console.log("Error: " + e);
};

var execSearch = function () {
    if (dates.length > 0) {
        doSearch(dates.shift()).then(dealWithResult, err);
    }
};

var dealWithResult = function (result) {
    console.log(result);
    execSearch();
};

// start the first search
execSearch();

