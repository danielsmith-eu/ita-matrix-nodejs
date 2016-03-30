'use strict';
var request = require('request');
var Promise = require('promise');
module.exports = function() {
    var urlbase = "http://matrix.itasoftware.com/search";

    var pad = function(input) {
        if ((input+"").length === 1) {
            return "0" + input;
        }
        return input;
    };

    var search = function(searchOptions) {
        console.log("searchOptions: ", searchOptions);
        return new Promise(function (resolve, reject) {
            console.log("searchOptions: ", searchOptions);
            var body = {
                method: "search",
                params: {
                    2: [
                        "calendar",
                        "currencyNotice",
                        "itineraryCarrierList",
                        "itineraryStopCountList",
                        "overnightFlightsCalendar",
                    ],
                    3: {
                        2: {
                            1: searchOptions.toDays,
                            2: searchOptions.fromDays,
                        },
                        4: {
                            2: 30 // num days
                        },
                        5: {
                            1: 1 // adults?
                        },
                        7: [
                            {
                                3: searchOptions.toAirports,
                                5: searchOptions.fromAirports,
                                7: "alliance oneworld",
                                8: searchOptions.year + "-" + pad(searchOptions.month) + "-06", // not used
                                9: 1, // think these are unused dates fields
                                11: 0, // think these are unused dates fields
                            },
                            {
                                3: searchOptions.fromAirports,
                                5: searchOptions.toAirports,
                                7: "alliance oneworld",
                                8: searchOptions.year + "-" + pad(searchOptions.month) + "-19", // not used
                                9: 0, // think these are unused dates fields
                                11: 1, // think these are unused dates fields
                            }
                        ],
                        8: "BUSINESS",
                        9: 1, // adults?
                        10: 1, // adults?
                        12: "GBP",
                        13: searchOptions.year + "-" + pad(searchOptions.month+1) + "-01",
                        15: "SUNDAY", // needs to be correct???
                        16: 0, // changes limit?? don't know
                        22: "default", // sales city?
                        23: searchOptions.year + "-" + pad(searchOptions.month) + "-01",
                    },
                    4: "calendar",
                    7: "!l5RCo6vSd4zqwu5EqjDCcXSKh4oCAAAAXVIAAAALCgANffMKx4_tz6_w3brN6ZkBFilQkCIrhwW1UDV4x44Zhu1jV48sM_1R7KOTAca1-zybuuL5ksCzpwnLR7b6_EguOIn1av_3Vszo-DtzczZZ0goQTjzy27IaWSfZBMX2sbCXIadC5ZyTrQ3KH90_YDo5PbXvWIM0kG8DCrCbZ-IW0yGGGvB_Hz6k2TvcSDDImNQitltMD_t5nv41p9w_hqsOwoU1vHekP1RpevHBbgyD62xrvrkbAGj0m2urwp86xkMWAYtcwpcuR2XnAABVJ5-4wR_VHCMArfM7uiahG4i-pUbb52QJQ8F3vu4Wvkxm36AHIvUlNubKfo2ThCXgzYtlOtzHAJ6rnUeB7MTiPF7tD_TIMmcK9rkAf5lzTpjGAiCT1xWTTjlo",
                    8: "calendarRoundTrip",
                },
            };

            console.log(JSON.stringify(body));

            var reqOptions = {
                url: urlbase,
                method: "POST",
                body: JSON.stringify(body),
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

            request(reqOptions).on("response", function(response) {
                if (response.statusCode !== 200) {
                    return reject("Error querying");
                }

                var bodyStr = "";
                response.on("data", function(data) {
                    bodyStr += data;
                }).on("end", function() {
                    var body = JSON.parse(bodyStr);
                    resolve(body);
                });
            }).on("error", function(error) {
                return reject(error);
            });
        });
    };

    return {
        search: search,
    };
}
