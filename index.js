#!/usr/bin/env node

const args = require('args');
const render = require("./dist/render.cjs").render;

args
    .option('input', 'File URL to Rendering', 'index.html')
    .option('port', 'Port to Rendering', 3033)
    .option('name', 'Name of scene to render', 'scene')
    .option('media', 'Name of mediaScene to render', 'mediaScene')
    .option('scale', 'Scale of screen size', 1)
    .option('fps', 'fps', 60)
    .option('width', 'Video width to render', 1920)
    .option('height', 'Video height to render', 1080)
    .option('output', 'Output file name', 'output.mp4')
    .option('startTime', 'Time to start', 0)
    .option('duration', 'how many seconds to play', 0)
    .option('iteration', 'iterationCount of the Scene set by the user himself.', 0)
    .option('cache', 'you can pass Capture. (0: false, 1: true)', 0)
    .option('multi', 'Number of processes to create.', 1)
    .option("codec", "Codec to encode video If you don't set it up, it's the default(mp4: libx264, webm:libvpx-vp9)", "")
    .option("bitrate", "Bitrate of video (the higher the bit rate, the clearer the video quality)", "4096k")
    .option("referer", "The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed.", "");

(async () => {
    const flags = args.parse(process.argv);

    await render(flags);
})();
