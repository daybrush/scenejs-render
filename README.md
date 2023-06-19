
<p align="middle"><img src="https://daybrush.com/scenejs/images/clapperboard.png" width="250"/></p>
<h2 align="middle">Scene.js Render</h2>
<p align="middle">
<a href="https://www.npmjs.com/package/@scenejs/render" target="_blank"><img src="https://img.shields.io/npm/v/@scenejs/render.svg?style=flat-square&color=007acc&label=version" alt="npm version" /></a>
<img src="https://img.shields.io/badge/language-typescript-blue.svg?style=flat-square"/>
<a href="https://github.com/daybrush/scenejs/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/github/license/daybrush/scenejs.svg?style=flat-square&label=license&color=08CE5D"/></a>
</p>


<p align="middle">🎬 Make a movie of CSS animation through <a href="https://github.com/daybrush/scenejs">Scene.js</a></p>

<p align="middle"><a href="https://daybrush.com/scenejs-render"><strong>Official Site</strong></a> &nbsp;/&nbsp; <a href="https://daybrush.com/scenejs-render/release/latest/doc"><strong>API</strong></a> &nbsp;/&nbsp; <a href="https://github.com/daybrush/scenejs"><strong>Scene.js</strong></a> &nbsp;/&nbsp; <a href="https://github.com/daybrush/scena"><strong>Main Project</strong></a></p>
<br/>

<p align="center">
<img src="https://raw.githubusercontent.com/daybrush/scenejs-render/master/demo/images/screenshot.png" alt="screenshot" />
</p>


## 🎬 How to use
#### Node
It reads a file from Node through a command and records (capture and video process) to create a video (or audio) file.


See [**`@scenejs/render` page**](https://github.com/daybrush/scenejs-render/tree/master/packages/render)

```bash
$ npm install @scenejs/render
```

```bash
$ npx @scenejs/render -i index.html
```

```nodejs
 const  render = require("@scenejs/render");
 const options = {
	 input: <URL of the file containing the scene>,
	 name: "scene",
	 mediaScene: "mediaScene",
	 output: <Output file name>,
	 ffmpegPath: "/usr/bin/ffmpeg",
	 width: width,
	 height:height,
	 fps:30,
	 imageType : "jpeg",
	 multi:2,
         buffer:true,
	 scale:scale,
	 cacheFolder: "cacheFolderPath"
    };
    await render.render(options);    
```
Make sure that the scene variable is declared and accessible in the global(window) scope or else a timeout will occur. If scene variable is declared using another name, make sure to update the "name" parameter in the option with the name of your scene variable

If you are running multiple instances of the render function simultaneously, make sure to specify unique cachefolder paths or the frames will get mixed up.




#### Browser
Through the module, you can record by specifying the capture method manually and create a file manually through the data.


See [**`@scenejs/recorder` page**](https://github.com/daybrush/scenejs-render/tree/master/packages/recorder)

```bash
$ npm install @scenejs/recorder
```


```js
import Recorder from "@scenjs/recorder";
import Scene, { OnAnimate } from "scenejs";

const scene = new Scene();
const recorder = new Recorder();

recorder.setAnimator(scene);
recorder.setCapturing("png", (e: OnAnimate) => {
  // html to image
});

recorder.record().then(data => {
  const url = URL.createObjectURL(new Blob(
    [data.buffer],
    { type: 'video/mp4' },
  ));

  video.setAttribute("src", url);
});
```


Since `@ffmpeg/ffmpeg` is used, please refer to the document https://github.com/ffmpegwasm/ffmpeg.wasm.

Or, using a script tag in the browser (only works in some browsers, see list below):

> SharedArrayBuffer is only available to pages that are [cross-origin isolated](https://developer.chrome.com/blog/enabling-shared-array-buffer/#cross-origin-isolation). So you need to host [your own server](https://github.com/ffmpegwasm/ffmpegwasm.github.io/blob/main/server/server.js) with `Cross-Origin-Embedder-Policy: require-corp` and `Cross-Origin-Opener-Policy: same-origin` headers to use ffmpeg.wasm.


> Only browsers with SharedArrayBuffer support can use ffmpeg.wasm, you can check [HERE](https://caniuse.com/sharedarraybuffer) for the complete list.





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
