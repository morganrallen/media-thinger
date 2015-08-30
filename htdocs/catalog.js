"use strict";

var request = require("browser-request");
var ud = require("ud");

module.exports = ud.defn(module, function(cb) {
  request({
    url: "/list",
    json: true
  }, cb);
});
