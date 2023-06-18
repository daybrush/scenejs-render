#!/usr/bin/env node

const args = require('args');
const render = require("./dist/render.cjs").render;

args
    .option('input', 'File URL to Rendering', 'index.html')
    .option('name', 'the global variable name of the Scene, SceneItem, and Animator instance that will play the animation.', 'scene')
    .option('media', 'Name of mediaScene to render', 'mediaScene')
    .option('scale', 'Scale of screen size', 1)
    .option('fps', 'fps', 60)
    .option('width', 'Video width to render', 1920)
    .option('height', 'Video height to render', 1080)
    .option('output', 'Output file name', 'output.mp4')
    .option('startTime', 'Input for start time', 0)
    .option('duration', 'Input how many seconds to play', 0)
    .option('iteration', 'Input iterationCount of the Scene set by the user himself.', 0)
    .option("buffer", "Whether to use buffer instead of saving frame image file in capturing (cache is disabled.)", 0)
    .option('cache', 'If there are frames in the cache folder, the capture process is passed.', 0)
    .option('cacheFolder', 'Cache folder name to save frame image', ".scene_cache")
    .option('multi', 'Number of browsers to be used for capturing', 1)
    .option('cpuUsed', 'Number of cpus to use for ffmpeg video or audio processing', 8)
    .option("codec", "Codec to encode video If you don't set it up, it's the default(mp4: libx264, webm:libvpx-vp9)", "")
    .option("bitrate", "Bitrate of video (the higher the bit rate, the clearer the video quality)", "4096k")
    .option("referer", "The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed.", "")
    .option("imageType", "Image type to record video (png or jpeg)", "png")
    .option("alpha", "If you use the png image type, you can create a video with a transparent background. (The video extension must be webm.)", 0)
    .option("ffmpegPath", "If you want to use native ffmpeg for faster speed, input the path of ffmpeg.", "")
    .option("ffmpegLog", "Whether to show ffmpeg's logs", false)
    .option("noLog", "Whether to Scene.js Render's logs", false);


const flags = args.parse(process.argv);

render(flags);
