"use strict";

var sqlite = require("sqlite3");
var restify = require("restify");

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
require("./routes/catalog")(server, db);

server.get("/", restify.serveStatic({
  default: "index.html",
  directory: "./htdocs"
}));

var port = process.env.PORT || 8088;
var host = process.env.HOST || "0.0.0.0";

server.listen(port, host, function() {
  console.log("Server listening: http://%s", server.server._connectionKey.slice(2));
});
