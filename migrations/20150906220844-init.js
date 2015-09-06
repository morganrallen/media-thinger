var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable("media", {
    id: {
      type: "int",
      primary: true
    },

    name: "string",
    file: "string",
    added: {
      type: "datetime",
      defaultValue: new String("CURRENT_TIMESTAMP")
    }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable("media", callback);
};
