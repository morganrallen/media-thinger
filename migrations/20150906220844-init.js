"use strict";

exports.up = function(db, callback) {
  db.createTable("media", {
    id: {
      autoIncrement: true,
      type: "int",
      primaryKey: true
    },

    name: "string",
    file: {
      type: "string",
      unique: true
    },
    added: {
      type: "datetime",
      defaultValue: new String("CURRENT_TIMESTAMP")
    }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable("media", callback);
};
