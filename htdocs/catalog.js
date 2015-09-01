"use strict";

var request = require("browser-request");
var ud = require("ud");

var fetch = ud.defn(module, function(cb) {
  request({
    url: "/list",
    json: true
  }, cb);
});


if(module.hot) {
  module.hot.addStatusHandler(console.log.bind(console));
}

module.exports = fetch;
