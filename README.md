# @scenejs/render [![npm version](https://badge.fury.io/js/%40scenejs%2Frender.svg)](https://badge.fury.io/js/%40scenejs%2Frender)



Make a movie of CSS animation through [scenejs](https://github.com/daybrush/scenejs).

In order to be able to use this module, make sure you have [ffmpeg](https://ffmpeg.org/) installed on your system (including all necessary encoding libraries like libmp3lame or libx264).

## Installation
```bash
$ npm install @scenejs/render
```

## Usage
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
    -b, --bitrate [value]  Bitrate of video (the higher the bit rate, the clearer the video quality) (defaults to "4096k")
    -c, --cache <n>        you can pass Capture. (0: false, 1: true) (defaults to 0)
    -C, --codec            Codec to encode video If you don't set it up, it's the default(mp4: libx264, webm:libvpx-vp9) (defaults to "")
    -d, --duration <n>     how many seconds to play (defaults to 0)
    -f, --fps <n>          fps (defaults to 60)
    -h, --height <n>       Video height to render (defaults to 1080)
    -H, --help             Output usage information
    -i, --input [value]    File URL to Rendering (defaults to "index.html")
    -I, --iteration <n>    iterationCount of the Scene set by the user himself. (defaults to 0)
    -m, --media [value]    Name of mediaScene to render (defaults to "mediaScene")
    -M, --multi <n>        Number of processes to create. (defaults to 1)
    -n, --name [value]     Name of scene to render (defaults to "scene")
    -o, --output [value]   Output file name (defaults to "output.mp4")
    -p, --port <n>         Port to Rendering (defaults to 3033)
    -r, --referer          The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. (defaults to "")
    -s, --scale <n>        Scale of screen size (defaults to 1)
    -S, --startTime <n>    Time to start (defaults to 0)
    -v, --version          Output the version number
    -w, --width <n>        Video width to render (defaults to 1920)
```
## Result
```
Start Rendering
Start Capture (startTime: 0, endTime: 2, fps: 60, startFrame: 0, endFrame: 171.42857142857144)
Capture frame: 0, time: 0
Capture frame: 1, time: 0.011666666666666665
Capture frame: 2, time: 0.02333333333333333
Capture frame: 3, time: 0.034999999999999996
Capture frame: 4, time: 0.04666666666666666
Capture frame: 5, time: 0.058333333333333334
Capture frame: 6, time: 0.06999999999999999
...
frame: 71, time: 0.8283333333333333
Capture frame: 72, time: 0.84
Capture frame: 73, time: 0.8516666666666666
Capture frame: 74, time: 0.8633333333333333
Capture frame: 75, time: 0.875
Capture frame: 76, time: 0.8866666666666666
Capture frame: 77, time: 0.8983333333333333
Capture frame: 78, time: 0.9099999999999999
Capture frame: 79, time: 0.9216666666666666
Capture frame: 80, time: 0.9333333333333333
...
Capture frame: 101, time: 1.1783333333333332
Capture frame: 102, time: 1.19
Capture frame: 103, time: 1.2016666666666667
Capture frame: 104, time: 1.2133333333333334
...
Capture frame: 170, time: 1.9833333333333332
Capture frame: 171, time: 1.9949999999999999
Capture frame: 172, time: 2
Convert Audio ./test.mp3
Convert Audio ./test2.mp3
Merge Audios
Processing start (totalframe: 172, duration: 2.857142857142857, fps: 60)
Processing: 0% done
Processing: 0.5780346820809249% done
Processing: 9.971098265895954% done
Processing: 21.38728323699422% done
Processing: 41.47398843930636% done
Processing finished !
End Rendering(Rendering Time: 62.248s)
```