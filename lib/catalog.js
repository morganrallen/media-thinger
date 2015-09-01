"use strict";

var path = require("path");

var bunyan = require("bunyan");
var fs = require("fs");
var magic = require("mime-magic");
var mime = require("mime");
var walk = require("walk").walk;

var acceptedTypes = [ "video/mp4", "video/x-matroska" ];

module.exports = function(server) {
  var walker = walk(path.join(process.env.HOME, "Downloads"));

  var files = [];

  var log = bunyan.createLogger({
    name: "catalog"
  });

  walker.on("file", function(root, stat, next) {
    if(acceptedTypes.indexOf(mime.lookup(stat.name)) === -1) {
      return next();
    }

    var filename = path.join(root, stat.name);

    magic(filename, function(err, type) {
      if(err) {
        return console.log(err);
      }

      //log.info(filename);
      files.push(filename);

      next();
    });
  });

  walker.on("end", function() {
  });

  server.get("/list", function(req, res) {
    res.setHeader("content-type", "text/json");
    res.end(JSON.stringify(files));
  });

  server.get("/play", function(req, res) {
    var file = req.query.video;

    if(files.indexOf(file) !== -1) {
      fs.stat(file, function(err, stat) {
        if(err) {
          console.log(err);
        }

        var range = req.headers.range.match(/bytes=([0-9]+)-([0-9]+)?(?:\/([0-9]+))?/);
        console.log(range);

        var start = parseInt(range[1]);
        var status = 206;
        var end = stat.size - 1;

        res.writeHeader(status, {
          "Content-Type": mime.lookup(file),
          "Content-Length": stat.size - start,
          "Content-Range": "bytes " + start + "-" + end + "/" + stat.size
        });

        fs.createReadStream(file, {
          end: end,
          start: start
        }).pipe(res);
      });
    } else {
      res.end();
    }
  });
};
