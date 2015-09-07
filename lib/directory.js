"use strict";

var path = require("path");
var through = require("through2");

module.exports = function() {
  var tr = through();

  setTimeout(function() {
    tr.emit("data", process.env.DIR || path.join(process.env.HOME, "Downloads"));
  }, 1000);

  return tr;
};
