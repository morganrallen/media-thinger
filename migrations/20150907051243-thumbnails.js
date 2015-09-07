"use strict";

exports.up = function(db, callback) {
  db.createTable("thumbnails", {
    id: {
      autoIncrement: true,
      primary: true,
      type: "int"
    },

    mediaId: "int",
    file: {
      type: "string",
      unique: true
    }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable("thumbnails", callback);
};
