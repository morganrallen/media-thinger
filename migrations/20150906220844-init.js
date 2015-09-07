var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable("media", {
    id: {
      autoIncrement: true,
      type: "int",
      primary: true
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
