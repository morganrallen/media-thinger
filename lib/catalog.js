"use strict";

var path = require("path");

var bunyan = require("bunyan");
var magic = require("mime-magic");
var mime = require("mime");
var walk = require("walk").walk;

var directoryService = require("../lib/directory");

var acceptedTypes = [ "video/mp4" ];

module.exports = function(db) {
  var ds = directoryService();

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
          }
        });

        next();
      });
    });

    walker.on("end", function() {
    });
  });

  return {
    list: function(cb) {
      db.all("SELECT * FROM media;", function(err, results) {
        if(err) {
          throw err;
        }

        console.log(arguments);
        cb(results);
      });
    }
  };
};
