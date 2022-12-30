
<p align="middle"><img src="https://daybrush.com/scenejs/images/clapperboard.png" width="250"/></p>
<h2 align="middle">Scene.js Render</h2>
<p align="middle">
<a href="https://www.npmjs.com/package/@scenejs/render" target="_blank"><img src="https://img.shields.io/npm/v/@scenejs/render.svg?style=flat-square&color=007acc&label=version" alt="npm version" /></a>
<img src="https://img.shields.io/badge/language-typescript-blue.svg?style=flat-square"/>
<a href="https://github.com/daybrush/scenejs/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/github/license/daybrush/scenejs.svg?style=flat-square&label=license&color=08CE5D"/></a>
</p>


<p align="middle">🎬 Make a movie of CSS animation through <a href="https://github.com/daybrush/scenejs">Scene.js</a></p>

<p align="middle"><a href="https://daybrush.com/scenejs"><strong>Official Site</strong></a> &nbsp;/&nbsp; <a href="https://github.com/daybrush/scenejs"><strong>Scene.js</strong></a> &nbsp;/&nbsp; <a href="https://github.com/daybrush/scena"><strong>Main Project</strong></a></p>
<br/>


## ⚙️ Installation

```bash
$ npm install @scenejs/render
```

## 🎬 How to use

```bash
# basic
$ render -i index.html
```
```bash
$ npx @scenejs/render -i index.html
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
  -B, --bitrate [value]      Bitrate of video (the higher the bit rate, the clearer the video quality) (defaults to "4096k")
  -b, --buffer <n>           Whether to use buffer instead of saving frame image file in capturing (cache is disabled.) (defaults to 0)
  -c, --cache <n>            If there are frames in the cache folder, the capture process is passed. (defaults to 0)
  -C, --cacheFolder [value]  Cache folder name to save frame image (defaults to ".scene_cache")
  -C, --codec                Codec to encode video If you don't set it up, it's the default(mp4: libx264, webm:libvpx-vp9) (defaults to "")
  -C, --cpuUsed <n>          Number of cpus to use for ffmpeg video or audio processing (defaults to 8)
  -d, --duration <n>         Input how many seconds to play (defaults to 0)
  -F, --ffmpegLog <n>        Whether to show ffmpeg's logs (defaults to 0)
  -f, --fps <n>              fps (defaults to 60)
  -h, --height <n>           Video height to render (defaults to 1080)
  -H, --help                 Output usage information
  -I, --imageType [value]    Image type to record video (png or jpeg) (defaults to "png")
  -i, --input [value]        File URL to Rendering (defaults to "index.html")
  -I, --iteration <n>        Input iterationCount of the Scene set by the user himself. (defaults to 0)
  -m, --media [value]        Name of mediaScene to render (defaults to "mediaScene")
  -M, --multi <n>            Number of browsers to be used for capturing (defaults to 1)
  -n, --name [value]         the global variable name of the Scene, SceneItem, and Animator instance that will play the animation. (defaults to "scene")
  -o, --output [value]       Output file name (defaults to "output.mp4")
  -r, --referer              The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. (defaults to "")
  -s, --scale <n>            Scale of screen size (defaults to 1)
  -S, --startTime <n>        Input for start time (defaults to 0)
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


## ⭐️ Show Your Support
Please give a ⭐️ if this project helped you!


## 👏 Contributing

If you have any questions or requests or want to contribute to `scenejs-render` or other packages, please write the [issue](https://github.com/daybrush/scenejs-render/issues) or give me a Pull Request freely.


### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].

<a href="https://github.com/daybrush/scenejs-render/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=daybrush/scenejs-render" />
</a>


## Sponsors
<p align="center">
	<a href="https://daybrush.com/sponsors/sponsors.svg">
		<img src="https://daybrush.com/sponsors/sponsors.svg"/>
	</a>
</p>


## 🐞 Bug Report

If you find a bug, please report to us opening a new [Issue](https://github.com/daybrush/scenejs-render/issues) on GitHub.



## 📝 License

This project is [MIT](https://github.com/daybrush/scenejs-render/blob/master/LICENSE) licensed.

```
MIT License

Copyright (c) 2016 Daybrush

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
