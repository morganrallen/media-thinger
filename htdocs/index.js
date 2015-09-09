"use strict";

var request = require("browser-request");
var videojs = require("video.js");

var elVideo = document.createElement("video");
elVideo.className = "video-js";
elVideo.id = "video_" + Date.now();

document.body.appendChild(elVideo);


var player = videojs(elVideo, {
  controls: true,
  height: 340,
  width: "100%"
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

  while(t.localName !== "li" && t.parentNode !== t) {
    t = t.parentNode;
  }

  play(t.getAttribute("data-url"), t.getAttribute("data-mime"));
}, false);

var catalog = require("./catalog");

function fetch() {
  catalog(function(err, xhr, res) {
    var list = "";

    for(var i = 0; i < res.length; i++) {
      var entry = res[i];
      var filename = entry.file;

      list += "<li class=\"gallery-video\" data-mime=\"" + entry.mime + "\" data-url=\"" + filename + "\">";

      if(entry.thumbnails.length > 0) {
        list += "<img src=\"/tn/" + entry.thumbnails[0] + "\" />";
      }

      list += "<div>" + filename.split("/").pop() + "</div>";

      list += "</li>";
    }

    elList.innerHTML = list;
  });
}

setInterval(function() {
  var i;
  var img = elList.querySelectorAll("img")[i = Math.floor(Math.random() * (elList.childNodes.length - 1))];
  img.src = img.src.replace(/_[0-9]\.png$/, "_" + Math.round(Math.random() * 4) + ".png");
}, 1000);

fetch();

var refresh = document.createElement("div");
refresh.class = "button refresh";
document.body.appendChild(refresh);
refresh.textContent = "REFRESH";
refresh.addEventListener("click", fetch, false);
