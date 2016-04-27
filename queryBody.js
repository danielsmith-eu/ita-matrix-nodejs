'use strict';
// creates the ITA Matrix query body from specified options
module.exports = function(searchOptions) {
    var zeroPad = function(input) {
        if ((input+"").length === 1) {
            return "0" + input;
        }
        return input;
    };

    return {
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
                        8: searchOptions.year + "-" + zeroPad(searchOptions.month) + "-06", // not used
                        9: 1, // think these are unused dates fields
                        11: 0, // think these are unused dates fields
                    },
                    {
                        3: searchOptions.fromAirports,
                        5: searchOptions.toAirports,
                        7: "alliance oneworld",
                        8: searchOptions.year + "-" + zeroPad(searchOptions.month) + "-19", // not used
                        9: 0, // think these are unused dates fields
                        11: 1, // think these are unused dates fields
                    }
                ],
                8: "BUSINESS",
                9: 1, // adults?
                10: 1, // adults?
                12: "GBP",
                13: (searchOptions.month < 12) ?
                searchOptions.year + "-" + zeroPad(searchOptions.month+1) + "-01" :
                (searchOptions.year+1) + "-01-01",
                15: "SUNDAY", // needs to be correct???
                16: 0, // changes limit?? don't know
                22: "default", // sales city?
                23: searchOptions.year + "-" + zeroPad(searchOptions.month) + "-01",
            },
            4: "calendar",
            7: "!l5RCo6vSd4zqwu5EqjDCcXSKh4oCAAAAXVIAAAALCgANffMKx4_tz6_w3brN6ZkBFilQkCIrhwW1UDV4x44Zhu1jV48sM_1R7KOTAca1-zybuuL5ksCzpwnLR7b6_EguOIn1av_3Vszo-DtzczZZ0goQTjzy27IaWSfZBMX2sbCXIadC5ZyTrQ3KH90_YDo5PbXvWIM0kG8DCrCbZ-IW0yGGGvB_Hz6k2TvcSDDImNQitltMD_t5nv41p9w_hqsOwoU1vHekP1RpevHBbgyD62xrvrkbAGj0m2urwp86xkMWAYtcwpcuR2XnAABVJ5-4wR_VHCMArfM7uiahG4i-pUbb52QJQ8F3vu4Wvkxm36AHIvUlNubKfo2ThCXgzYtlOtzHAJ6rnUeB7MTiPF7tD_TIMmcK9rkAf5lzTpjGAiCT1xWTTjlo",
            8: "calendarRoundTrip",
        },
    };
};