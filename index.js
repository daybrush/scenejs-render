#!/usr/bin/env node

const args = require('args');
const render = require("./render").render;

args
    .option('input', 'File URL to Rendering', 'index.html')
    .option('port', 'Port to Rendering', 3033)
    .option('name', 'Name of scene to render', 'scene')
    .option('media', 'Name of mediaScene to render', 'mediaScene')
    .option('scale', 'Scale of screen size', 1)
    .option('fps', 'fps', 60)
    .option('width', 'Video width to render', 600)
    .option('height', 'Video height to render', 400)
    .option('output', 'Output file name', 'output.mp4')
    .option('startTime', 'Time to start', 0)
    .option('duration', 'how many seconds to play')
    .option('cache', 'you can pass Capture. (0: false, 1: true)', 0)
    .option('multi', 'Number of processes to create.', 1);

(async () => {
    const flags = args.parse(process.argv);

    await render(flags);
})();
