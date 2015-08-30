"use strict";

var request = require("browser-request");
var videojs = require("video.js");

var elVideo = document.createElement("video");

elVideo.className = "video-js";
elVideo.id = "video_" + Date.now();

document.body.appendChild(elVideo);

var player = videojs(elVideo, {
  controls: true
}, function() {
  console.log("have you got a video?");
});


function play(video) {
  elVideo.src = "/play?video=" + video;
  player.play();
}

var elList = document.createElement("ul");
document.body.appendChild(elList);
elList.addEventListener("click", function(evt) {
  var t = evt.target;

  if(t.localName !== "li") {
    return;
  }

  play(t.getAttribute("data-url"));
}, false);

var catalog = require("./catalog");

catalog(function(err, xhr, res) {
  var list = "";

  for(var i = 0; i < res.length; i++) {
    list += "<li data-url=\"" + res[i] + "\">" + res[i].split("/").pop() + "</li>";
  }

  elList.innerHTML = list;
});
