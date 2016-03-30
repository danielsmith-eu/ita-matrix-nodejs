var Flights = require("./flights");

var f = Flights();
f.search({
    fromAirports: ["DUB"],
    toAirports: ["LAS"],
    fromDays: 12,
    toDays: 14,
    year: 2016,
    month: 8,
}).then(function(results) {
    console.log(JSON.stringify(results, null, 2));
}, function (error) {
    console.log("Error: ", error);   
});
