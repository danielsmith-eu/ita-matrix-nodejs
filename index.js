var Flights = require("./flights");

var f = Flights();
f.search({
    fromAirports: ["DUB"],
    toAirports: ["LAS"],
    fromDays: 12,
    toDays: 14,
    year: 2016,
    month: 8,
}).then(function(response) {
    var options = response.searchOptions;
    try {
        var cheapestResult = f.cheapest(response.results);
        console.log(options.fromAirports.join(",") +
                "-" +
                options.toAirports.join(",") +
                " in " + options.year + "/" + options.month + ": " +
                f.format(cheapestResult));
    } catch (e) {
        console.log("Error: ", e);
    }
}, function (error) {
    console.log("Error: ", error);
});
