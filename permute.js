'use strict';
module.exports = function(dates, froms, tos) {
    var output = [];
    dates.forEach(function (date){
       froms.forEach(function (from) {
          tos.forEach(function (to) {
             output.push({
                 date: date,
                 from: [from], // has to be an array
                 to: [to], // has to be an array
             });
          });
       });
    });
    return output;
};