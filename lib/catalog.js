"use strict";

var path = require("path");

var forEach = require("async-foreach").forEach;
var bunyan = require("bunyan");
var EventEmitter = require("events").EventEmitter;
var magic = require("mime-magic");
var mime = require("mime");
var through = require("through2");
var walk = require("walk").walk;

var directoryService = require("../lib/directory");

var acceptedTypes = [ "video/mp4" ];

module.exports = function(db) {
  var ds = directoryService();
  var ee = new EventEmitter();

  var files = {};

  var log = bunyan.createLogger({
    name: "catalog"
  });

  ds.on("data", function(dir) {
    var walker = walk(dir);

    walker.on("file", function(root, stat, next) {
      var mimeType;

      if(acceptedTypes.indexOf(mimeType = mime.lookup(stat.name)) === -1) {
        return next();
      }

      var filename = path.join(root, stat.name);

      magic(filename, function(err) {
        if(err) {
          return console.log(err);
        }

        //log.info(filename);
        files[filename] = {
          mime: mimeType
        };

        db.run("INSERT INTO media (name, file) VALUES (?, ?);", [ filename, filename ], function(insErr) {
          if(insErr) {
            log.error(err);
          } else {
            ee.emit("media.new", {
              file: filename,
              mediaID: this.lastID
            });
          }
        });

        next();
      });
    });

    walker.on("end", function() {
    });
  });

  ee.createNewMediaStream = function() {
    var tr = through({
      objectMode: true
    });

    function onData(m) {
      tr.write(m);
    }

    ee.on("media.new", onData);

    tr.on("end", function() {
      ee.removeEventListener("media.new", onData);
    });

    return tr;
  };

  ee.list = function() {
    var tr = through({
      objectMode: true
    });

    db.all("SELECT * FROM media;", function(err, rows) {
      if(err) {
        throw err;
      }

      forEach(rows, function(row) {
        var next = this.async();

        row.thumbnails = [];
        row.mime = mime.lookup(row.file);

        db.each("SELECT * FROM thumbnails WHERE mediaId = ?;", [ row.id ], function(tnErr, tnRow) {
          if(tnErr) {
            throw tnErr;
          }

          row.thumbnails.push(tnRow.file);
        }, function() {
          tr.write(row);
          next();
        });
      }, function() {
        tr.end();
      });
    });

    return tr;
  };

  return ee;
};
