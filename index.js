"use strict";

var restify = require("restify");

var server = restify.createServer({
  name: "media-thinger"
});

var io = require("socket.io").listen(server.server);
server.io = io;

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

require("./lib/browserify")(server);
require("./lib/catalog")(server);

server.get("/", restify.serveStatic({
  default: "index.html",
  directory: "./htdocs"
}));

var port = process.env.PORT || 8088;

server.listen(port, function() {
  console.log("Server listening: %s", port);
});
