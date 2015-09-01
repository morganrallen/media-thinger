"use strict";

var bunyan = require("bunyan");
var fs = require("fs");
var restify = require("restify");
var browserify = require("browserify");
var hmr = require("browserify-hmr");
var watchify = require("watchify");
var xtend = require("xtend");

var server = restify.createServer();
server.on("after", restify.auditLogger({
  log: bunyan.createLogger({
    name: "audit",
    stream: process.stdout
  })
}));

server.get("/", restify.serveStatic({
  directory: "./htdocs/",
  default: "index.html"
}));

var b = browserify(xtend(watchify.args, {
  debug: true
}));

b.plugin(hmr, {});
b.add("./htdocs/index.js");

var w = watchify(b);
w.on("update", function(files) {
  console.log(files);
  w.bundle().on("error", console.log.bind(console));
});

w.bundle().on("error", console.log.bind(console));

server.get("/app.js", function(req, res) {
  res.setHeader("content-type", "text/javascript");

  var bundle = w.bundle();
  bundle.on("error", function(err) {
    res.end(err);
  });

  bundle.pipe(res);
});

var catalog = require("./catalog");

server.get("/list", function(req, res) {
  res.setHeader("content-type", "text/json");
  res.end(JSON.stringify(catalog.list("video/mp4")));
});

server.use(restify.queryParser({ mapParams: false }));

server.get("/play", function(req, res) {
  if(catalog.list("video/mp4").indexOf(req.query.video) !== -1) {
    res.setHeader("content-type", "video/mp4");
    fs.createReadStream(req.query.video).pipe(res);
  } else {
    res.end();
  }
});

server.listen(3030, function() {
  console.log("listening on 3030");
});
