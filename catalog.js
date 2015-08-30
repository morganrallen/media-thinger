"use strict";

var path = require("path");

var magic = require("mime-magic");
var mime = require("mime");
var walk = require("walk").walk;

var walker = walk(path.join(process.env.HOME, "Downloads"));

var types = {};

walker.on("file", function(root, stat, next) {
  if(mime.lookup(stat.name).indexOf("video") === -1) {
    return next();
  }

  var filename = path.join(root, stat.name);

  magic(filename, function(err, type) {
    if(err) {
      return console.log(err);
    }

    if(!types[type]) {
      types[type] = [];
    }

    types[type].push(filename);

    next();
  });
});

walker.on("end", function() {
});

module.exports.list = function(type) {
  return types[type];
};

