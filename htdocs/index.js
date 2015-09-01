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
elVideo.controls = true;

function play(video, type) {
  elVideo.setAttribute("type", type);

  player.src({
    src: "/play?video=" + video,
    type: type
  });
  player.play();
}

var elList = document.createElement("ul");
document.body.appendChild(elList);
elList.addEventListener("click", function(evt) {
  var t = evt.target;

  if(t.localName !== "li") {
    return;
  }

  play(t.getAttribute("data-url"), t.getAttribute("data-mime"));
}, false);

var catalog = require("./catalog");

function fetch() {
  catalog(function(err, xhr, res) {
    var list = "";

    for(var filename in res) {
      var entry = res[filename];

      list += "<li data-mime=\"" + entry.mime + "\" data-url=\"" + filename + "\">" + filename.split("/").pop() + "</li>";
    }

    elList.innerHTML = list;
  });
}

fetch();

var refresh = document.createElement("div");
refresh.class = "button refresh";
document.body.appendChild(refresh);
refresh.textContent = "REFRESH";
refresh.addEventListener("click", fetch, false);
