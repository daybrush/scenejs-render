
<p align="middle"><img src="https://daybrush.com/scenejs/images/clapperboard.png" width="250"/></p>
<h2 align="middle">Scene.js Recorder</h2>
<p align="middle">
<a href="https://www.npmjs.com/package/@scenejs/recorder" target="_blank"><img src="https://img.shields.io/npm/v/@scenejs/recorder.svg?style=flat-square&color=007acc&label=version" alt="npm version" /></a>
<img src="https://img.shields.io/badge/language-typescript-blue.svg?style=flat-square"/>
<a href="https://github.com/daybrush/scenejs/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/github/license/daybrush/scenejs.svg?style=flat-square&label=license&color=08CE5D"/></a>
</p>


<p align="middle">🎬 Make a movie of CSS animation through <a href="https://github.com/daybrush/scenejs">Scene.js</a></p>


<p align="middle"><a href="https://daybrush.com/scenejs-render"><strong>Official Site</strong></a> &nbsp;/&nbsp; <a href="https://daybrush.com/scenejs-render/release/latest/doc"><strong>API</strong></a> &nbsp;/&nbsp; <a href="https://github.com/daybrush/scenejs"><strong>Scene.js</strong></a> &nbsp;/&nbsp; <a href="https://github.com/daybrush/scena"><strong>Main Project</strong></a></p>
<br/>

Through the module, you can record by specifying the capture method manually and create a file manually through the data.

## ⚙️ Installation
```bash
$ npm install @scenejs/recorder
```
To run it locally, add `@ffmpeg/core` to devDependencies.

```bash
npm install @ffmpeg/core -D
```

## 🚀 Examples
* [Scene.js Recorder Browser Demo](https://scenejs-render-demo.netlify.app)
* [Scene.js Recorder Browser Source](https://github.com/daybrush/scenejs-render/tree/master/packages/recorder-react-demo)

## 🎬 How to use
#### Browser

Since `@ffmpeg/ffmpeg` is used, please refer to the document https://github.com/ffmpegwasm/ffmpeg.wasm.

Or, using a script tag in the browser (only works in some browsers, see list below):

> SharedArrayBuffer is only available to pages that are [cross-origin isolated](https://developer.chrome.com/blog/enabling-shared-array-buffer/#cross-origin-isolation). So you need to host [your own server](https://github.com/ffmpegwasm/ffmpegwasm.github.io/blob/main/server/server.js) with `Cross-Origin-Embedder-Policy: require-corp` and `Cross-Origin-Opener-Policy: same-origin` headers to use ffmpeg.wasm.


> Only browsers with SharedArrayBuffer support can use ffmpeg.wasm, you can check [HERE](https://caniuse.com/sharedarraybuffer) for the complete list.


```ts
import Recorder, { OnRequestCapture } from "@scenjs/recorder";
import Scene from "scenejs";

const scene = new Scene();
const recorder = new Recorder();

recorder.setAnimator(scene);
recorder.setCapturing("png", (e: OnRequestCapture) => {
    scene.setTime(e.time, true);
    // html to image
    return htmlToImage(element);
});

recorder.record().then(data => {
  const url = URL.createObjectURL(new Blob(
    [data.buffer],
    { type: 'video/mp4' },
  ));

  video.setAttribute("src", url);
  recorder.destroy();
});
```

#### Node

> Since `@scenejs/recorder` is a raw version of `@scenejs/render`, capturing and file creation are not performed.
If you want a completed Recorder, use [`@scenejs/render`](https://github.com/daybrush/scenejs-render/tree/master/packages/render).


```js
const Recorder = require("@scenejs/recorder");
const fs = require('fs');
const { Animator } = require("scenejs");

const recorder = new Recorder();
const animator = new Animator({
    duration: 2,
});


recorder.setAnimator(animator);
recorder.setRecording("png", e => {
    return `./frame${e.frame}.png`;
});
recorder.record().then(data => {
    fs.writeFileSync("output.mp4", output);
    recorder.destroy();
});
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
