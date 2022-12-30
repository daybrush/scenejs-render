# @scenejs/render [![npm version](https://badge.fury.io/js/%40scenejs%2Frender.svg)](https://badge.fury.io/js/%40scenejs%2Frender)

Make a movie of CSS animation through [scenejs](https://github.com/daybrush/scenejs).


## Installation
```bash
$ npm install @scenejs/render
```

## How to use

```bash
# basic
$ render -i index.html
```

```bash
# export mp4
$ render -i index.html --name scene
# export only mp3
$ render -i index.html --name scene -o output.mp3
# export mp3 file and mp4 file
$ render -i index.html --name scene -o output.mp3,output.mp4
```

```
Usage: render [options] [command]

Commands:
  help     Display help
  version  Display version

Options:
  -a, --alpha <n>            If you use the png image type, you can create a video with a transparent background. (The video extension must be webm.) (defaults to 0)
  -b, --bitrate [value]      Bitrate of video (the higher the bit rate, the clearer the video quality) (defaults to "4096k")
  -c, --cache <n>            you can pass Capture. (0: false, 1: true) (defaults to 0)
  -C, --cacheFolder [value]  Cache folder name to save frame image (defaults to ".scene_cache")
  -C, --codec                Codec to encode video If you don't set it up, it's the default(mp4: libx264, webm:libvpx-vp9) (defaults to "")
  -d, --duration <n>         how many seconds to play (defaults to 0)
  -F, --ffmpegPath           If it's in the local ffmpeg binary file, set `ffmpegPath` (defaults to "")
  -f, --fps <n>              fps (defaults to 60)
  -h, --height <n>           Video height to render (defaults to 1080)
  -H, --help                 Output usage information
  -I, --imageType [value]    Image type to record video (png or jpeg) (defaults to "png")
  -i, --input [value]        File URL to Rendering (defaults to "index.html")
  -I, --iteration <n>        iterationCount of the Scene set by the user himself. (defaults to 0)
  -m, --media [value]        Name of mediaScene to render (defaults to "mediaScene")
  -M, --multi <n>            Number of processes to create. (defaults to 1)
  -n, --name [value]         the global variable name of the Scene, SceneItem, and Animator instance that will play the animation. (defaults to "scene")
  -o, --output [value]       Output file name (defaults to "output.mp4")
  -r, --referer              The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. (defaults to "")
  -s, --scale <n>            Scale of screen size (defaults to 1)
  -S, --startTime <n>        Time to start (defaults to 0)
  -v, --version              Output the version number
  -w, --width <n>            Video width to render (defaults to 1920)
```

### Programatically
```js
import { render } from "@scenejs/render";

render({
  input: "./index.html",
  name: "scene",
  output: "output.mp4",
});
```


### Result
```
Start Render
Start Workers (startTime: 0, endTime: 2, fps: 60, startFrame: 0, endFrame: 120, workers: 4)
Start Worker 0
Start Worker 1
Start Worker 2
Start Worker 3
Start Capture (startFame: 0, endFrame: 120, startTime: 0, endTime: 2, fps: 60, duration: 2, imageType: png)
Capture Progress: 0.826% (1 / 121)
- Captured Frame: 0
- Current Capturing Time: 0.192s, Expected Capturing Time: 23.232s
...
Capture Progress: 100% (121 / 121)
- Captured Frame: 30
- Current Capturing Time: 5.545s, Expected Capturing Time: 5.545s
End Capture
Start Video Process (ext: mp4, fps: 60, duration: 2)
Video Processing Progress: 0%
- Current Processing Time: 0.099s, Expected Processing Time: Infinitys
Video Processing Progress: 9.09%
- Current Processing Time: 0.665s, Expected Processing Time: 7.315s
...
Video Processing Progress: 100%
- Current Processing Time: 6.977s, Expected Processing Time: 6.977s
End Video Process
Created Video: output.mp4
End Render (Rendering Time: 15.747s)
```