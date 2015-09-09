"use strict";

var fs = require("fs");
var browserify = require("browserify");
//var hmr = require("browserify-hmr");
var watchify = require("watchify");
var zlib = require("zlib");

module.exports = function(server) {
  var b = browserify({
    cahce: {},
    debug: true,
    packageCache: {}
  });
  //b.plugin(hmr);
  b.add("./htdocs/index.js");

  var w = watchify(b);

  w.on("update", function(files) {
    console.log("updating bundle cache");
    for(var i = 0; i < files.length; i++) {
      console.log(files[i]);
    }

    w.bundle().pipe(fs.createWriteStream("/dev/null"));
  });

  w.bundle().pipe(fs.createWriteStream("/dev/null"));

  server.get("/app.js", function(req, res) {
    res.setHeader("Content-Encoding", "gzip");

    w.bundle().pipe(zlib.createGzip()).pipe(res);
  });
};
