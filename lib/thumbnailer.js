"use strict";

var ffmpeg = require("fluent-ffmpeg");

module.exports = function(catalog, db) {
  var tr = catalog.createNewMediaStream();

  tr.on("data", function(entry) {
    var file = entry.file;

    console.log("Starting thumbnailer on %s", file);

    tr.pause();

    var baseName = file.split("/").pop().split(".");
    baseName.pop();
    baseName = baseName.join(".");

    ffmpeg(file)
    .on("error", function() {
      console.log("thumbnailer errored on %s", file);
      tr.resume();
    }).on("end", function() {
      console.log("thumbnailer done on %s", file);

      db.serialize(function() {
        var q = db.prepare("INSERT INTO thumbnails (mediaId, file) VALUES (?, ?);");

        for(var i = 1; i <= 4; i++) {
          q.run(entry.mediaID, baseName + "_" + i + ".png");
        }

        q.finalize(function(err) {
          if(err) {
            console.error(err);
          }

          tr.resume();
        });
      });
    }).screenshots({
      count: 4,
      fastSeek: true,
      filename: baseName + "_%i.png",
      folder: "./thumbnails/",
      size: "320x?"
    });
  });
};
