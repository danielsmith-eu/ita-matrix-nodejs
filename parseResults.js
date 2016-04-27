'use strict';
// parse results from ITA Matrix sparse results format
// try/catch at every level because there isn't always content
// and we don't need to error out completely in that case.
module.exports = function(bodyStr) {
    var body = JSON.parse(bodyStr);
    var results = [];
    var allResults = body.result[7][1];
    allResults.forEach(function (month) {
        try {
            // this is each month (i.e. each physical grid), usually 1 or 2
            var rows = month[1];
            rows.forEach(function (row) {
                try {
                    // each row in the grid
                    var days = row[1];
                    days.forEach(function (day) {
                        try {
                            var result = day[3];
                            if (result) {
                                var flights = result[1];
                                flights.forEach(function (flight) {
                                    try {
                                        // cheapest flight per day, one
                                        // per duration, e.g. 12, 13, 14 days length
                                        results.push({
                                            price: flight[2],
                                            priceInt: parseInt(flight[2].substr(3)),
                                            durationDays: flight[4],
                                            outDate: flight[1][3][0][1],
                                            inDate: flight[1][3][1][1],
                                        });
                                    } catch (e) {
                                        console.trace("Results parsing 1");
                                        // do nothing
                                    }
                                });
                            }
                        } catch (e) {
                            console.trace("Results parsing 2");
                            // no nothing
                        }
                    });
                } catch (e) {
                    console.trace("Results parsing 3");
                    // do nothing
                }
            });
        } catch (e) {
            console.trace("Results parsing 4");
            // do nothing
        }
    });
    return {results: results};
};