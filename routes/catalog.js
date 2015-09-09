"use strict";

var fs = require("fs");
var mime = require("mime");

module.exports = function(server, db) {
  var catalog = require("../lib/catalog")(db);

  server.get("/list", function(req, res) {
    res.setHeader("content-type", "text/json");
    res.write("[");

    var tr = catalog.list();

    var first = true;
    tr.on("data", function(data) {
      if(first) {
        first = false;
      } else {
        res.write(",");
      }

      res.write(JSON.stringify(data));
    });

    tr.on("end", function() {
      res.end("]");
    });
  });

  server.get("/play", function(req, res) {
    var file = req.query.video;

    if(catalog.files[file]) {
      fs.stat(file, function(err, stat) {
        if(err) {
          console.log(err);
        }

        var range = req.headers.range.match(/bytes=([0-9]+)-([0-9]+)?(?:\/([0-9]+))?/);

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

  return catalog;
};
