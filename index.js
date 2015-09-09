"use strict";

var path = require("path");
var sqlite = require("sqlite3");
var restify = require("restify");
var ecstatic = require("ecstatic");

var db = new sqlite.Database("./db/media.sqlite");
var server = restify.createServer({
  name: "media-thinger"
});

var io = require("socket.io").listen(server.server);
server.io = io;

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

require("./lib/browserify")(server);
var catalog = require("./routes/catalog")(server, db);
require("./lib/thumbnailer")(catalog, db);

var stat = ecstatic({
  baseDir: "tn",
  root: __dirname + "/thumbnails/"
});

server.get(/\/tn\/.*/, function(req, res, next) {
  stat(req, res, next);
});

server.get("/", restify.serveStatic({
  default: "index.html",
  directory: "./htdocs"
}));

var port = process.env.PORT || 8088;
var host = process.env.HOST || "0.0.0.0";

server.listen(port, host, function() {
  console.log("Server listening: http://%s", server.server._connectionKey.slice(2));
});
