"use strict";

exports.up = function(db, callback) {
  db.createTable("thumbnails", {
    id: {
      autoIncrement: true,
      type: "int",
      primaryKey: true
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
