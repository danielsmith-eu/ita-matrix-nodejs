'use strict';
var request = require('request');
var Promises = require('promise');
var parseResults = require('./parseResults');
var queryBody = require('./queryBody');
module.exports = function(config) {
    var urlBase = "http://matrix.itasoftware.com/search";
    var dryRun = config.hasOwnProperty("dryRun") && config.dryRun;
    var nullResults = {results: []};

    var search = function(searchOptions) {
        return new Promises(function (resolve, reject) {
            if (dryRun) {
                console.log("* Dry run suppressed lookup of: " + JSON.stringify(searchOptions));
                return resolve(nullResults);
            }

            var reqOptions = {
                url: urlBase,
                method: "POST",
                body: JSON.stringify(queryBody(searchOptions)),
                json: false,
                headers: {
                    "Content-Type": "application/javascript; charset=UTF-8",
                    "Origin": "http://matrix.itasoftware.com",
                    "Referer": "http://matrix.itasoftware.com/",
                    "Pragma": "no-cache",
                    "Cache-Control": "no-cache",
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36",
                    "X-GWT-Module-Base": "http://matrix.itasoftware.com/gwt/",
                    "X-GWT-Permutation": "CE8DC3960A9557AEA8321F1C132B8541",
                },
            };

            var attemptsLeft = 10;

            var doCall = function() {
                request(reqOptions).on("response", function (response) {
                    if (response.statusCode !== 200) {
                        console.log("Error querying, response is: ", response.statusCode);
                        if (--attemptsLeft > 0) {
                            console.log("..retrying.");
                            doCall();
                        } else {
                            console.log("..max number of retries attempted, skipping.");
                            resolve(nullResults);
                        }
                    }

                    var bodyStr = "";
                    response.on("data", function (data) {
                        bodyStr += data;
                    }).on("end", function () {
                        try {
                            resolve(parseResults(bodyStr));
                        } catch (e) {
                            // do nothing
                        }
                    });
                }).on("error", function (error) {
                    return reject(error);
                });
            };

            doCall();
        });
    };

    var cheapest = function(results) {
        var cheapest = null;
        results.forEach(function (result) {
            if (cheapest === null || result.priceInt < cheapest.priceInt) {
                cheapest = result;
            }
        });
        return cheapest;
    };

    var format = function(result) {
        return result.outDate.substr(0,10) + " - " + result.inDate.substr(0,10) + " (" + result.durationDays + " days): " + result.price;
    };

    return {
        search: search,
        cheapest: cheapest,
        format: format,
    };
};
