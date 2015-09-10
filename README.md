Goal
----
Simple local streaming media server that assumes you want little more than streaming within your local network.

Movivation
----------
Media servers like Plex are... well.... comPlex. Not only that, many are increasingly less open.
I wanted a media server that didn't require any frontend at all, open you're browser and stream
to an HTML video tag. That's all.

Setup
-----
```
git clone https://github.com/morganrallen/media-thinger.git
cd media-thinger
npm install
node index.js
```

Features (what's working)
-------------------------
* Can find and play `video/mp4` given a starting directory (default: $HOME/Downloads)
* Generate thumbnails if ffmpeg is available
* Gallery of videos on frontend
* Seeking, pausing, resuming videos

Futures (see what I did there?)
-------------------------------
* Figure out codecs so more videos play on more platforms
* Admin interface (add directories, label/tag media, blah)
