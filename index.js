#!/usr/bin/env node

const puppeteer = require('puppeteer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const args = require('args');
const createServer = require('http-server').createServer;


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
    .option('cache', 'you can pass Capture. (0: false, 1: true)', 0);
    

async function captureScene({
    name,
    media,
    path,
    startTime = 0,
    duration,
    fps,
    width,
    height,
    cache,
    scale,
}) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.setViewport({
        width,
        height,
        deviceScaleFactor: scale,
    });
    await page.goto(path);

    let isMedia = true;
    try {
        if (!media || !await page.evaluate(`${media}.finish()`)) {
            isMedia = false;
        }
    } catch (e) {
        isMedia = false;
    }
    const playSpeed = await page.evaluate(`${name}.finish().getPlaySpeed()`);
    const iterationCount = await page.evaluate(`${name}.getIterationCount()`);
    const delay = await page.evaluate(`${name}.getDelay()`);
    const sceneDuration = iterationCount === "infinite" ? delay + await page.evaluate(`${name}.getDuration()`) : await page.evaluate(`${name}.getTotalDuration()`);
    const endTime = typeof duration === "undefined" ? sceneDuration : Math.min(startTime + duration, sceneDuration);

    const startFrame = startTime  * fps / playSpeed;
    const endFrame = endTime * fps / playSpeed;


    if (!fs.existsSync("./.scene_cache")) {
        fs.mkdirSync("./.scene_cache");
    }
    let isCache = false;
    if (cache) {
        try {
            const cacheInfo = fs.readFileSync("./.scene_cache/cache.txt", "utf8");
            const temp = JSON.stringify({startTime, endTime, fps, startFrame, endFrame});
            if (cacheInfo === temp) {
                isCache = true;
            }
        } catch (e) {
            isCache = false;
        }
    }
    if (isCache) {
        console.log(`Use Cache (startTime: ${startTime}, endTime: ${endTime}, fps: ${fps}, startFrame: ${startFrame}, endFrame: ${endFrame})`);;
    } else {
        console.log(`Start Capture (startTime: ${startTime}, endTime: ${endTime}, fps: ${fps}, startFrame: ${startFrame}, endFrame: ${endFrame})`);;
        async function loop(frame) {
            const time = Math.min(frame * playSpeed / fps, endTime);

            console.log(`Capture frame: ${frame}, time: ${time}`);
            await page.evaluate(`${name}.setTime(${time - delay}, true)`);

            isMedia && await page.evaluate(`${media}.setTime(${time})`);
            if (media) {}
            await page.screenshot({ path: `./.scene_cache/frame${frame}.png` });

            if (time === endTime) {
                return;
            }
            await loop(frame + 1);
        }

        await loop(startFrame);
    }
    fs.writeFileSync("./.scene_cache/cache.txt", JSON.stringify({startTime, endTime, fps, startFrame, endFrame}));
    const mediaInfo = isMedia ? await page.evaluate(`${media}.getInfo()`) : {};

    await browser.close();

    return {
        mediaInfo,
        duration: (endTime - startTime) / playSpeed,
    }
}
function rmdir(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file) {
        var curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
            rmdir(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
};

async function recordVideo({
    duration,
    fps,
    output,
    width,
    height,
    mediaInfo,
}) {
    return new Promise(async (resolve, reject) => {
        const frames = [];
        for (let i = 0; i <= duration * fps; ++i) {
            frames[i] = `./.scene_cache/frame${i}.png`;
        }

       
        const isMedia = await recordMedia(mediaInfo);

        console.log(`Processing start (totalframe: ${frames.length}, duration: ${duration}, fps: ${fps}, media: ${isMedia})`);
        const converter = ffmpeg()
            .addInput('./.scene_cache/frame%d.png')
            // .addInput('./test.mp3')
            .inputFPS(fps)
            .loop(duration)
            .on('error', function(err) {
                console.log('An error occurred: ' + err.message);
                reject();
            })
            .on('progress', function(progress) {
                console.log('Processing: ' + progress.percent + '% done');
            })
            .on('end', function() {
                console.log('Processing finished !');
                resolve();
            })
            .videoBitrate(1024)
            .videoCodec('libx264')
            .outputOption('-pix_fmt yuv420p')
            .size(`${width}x${height}`)
            .format('mp4')
            if (isMedia) {
                converter.addInput("./.scene_cache/merge.mp3")
                .audioCodec('aac')
                .audioBitrate('128k')
                // .audioFrequency(22050)
                .audioChannels(4)
            }
            converter.save(output);
    });
}
async function convertAudio({
    i,
    path,
    time,
    seek,
    playSpeed,
    volume,
}) {
    console.log("Convert Audio", path);
    const [startTime, endTime] = seek;
    return new Promise((resolve, reject) => {
        ffmpeg(path)
        .seekInput(startTime)
        .inputOptions(`-to ${endTime}`)
        .audioFilters([`adelay=${time * playSpeed * 1000}|${time * playSpeed * 1000}`, `atempo=${playSpeed}`, `volume=${volume}`])
        .on('error', function (err) {
            console.log('An error occurred: ' + err.message);
            reject();
        })
        .on('end', function() {
            resolve();
        })
        .save(`./.scene_cache/audio${i}.mp3`);
    });
}
async function recordMedia(mediaInfo) {
    console.log("Convert Medias");
    let length = 0;

    await Promise.all(Object.keys(mediaInfo).map(path => {
        const info = mediaInfo[path];
        const times = Object.keys(info);

        return Promise.all(times.map(time => {
            const {seek, volume, playSpeed} = info[time];

            return convertAudio({
                i: length++,
                path,
                time: parseFloat(time),
                seek,
                playSpeed,
                volume,
            });
        }));
    }));

    if (!length) {
        return false;
    }

    console.log("Merge Medias");
    return new Promise((resolve, reject) => {
        const converter = ffmpeg();
        for (let i = 0; i < length; ++i) {
            converter.addInput(`./.scene_cache/audio${i}.mp3`);
        }
        
        converter.inputOptions(`-filter_complex amix=inputs=${length}:duration=longest`)
        .on('error', function(err) {
            console.log('An error occurred: ' + err.message);
            reject(false);
        })
        .on('end', function() {
            resolve(true);
        })
        .save("./.scene_cache/merge.mp3");
    });
}
function openServer(port) {
    const server = createServer({
        cache: -1,
    });

    server.listen(port, '0.0.0.0', function () {
        console.log("Open Server", port);
    });

    return server;
}
(async () => {
    const flags = args.parse(process.argv);
    const {
        name,
        media,
        port,
        fps,
        width,
        height,
        output,
        startTime,
        cache,
        scale,
     } = flags;
    const path = `http://0.0.0.0:${port}/${flags.input}`;
    let duration;
    const server = openServer(port);
    console.log("Start Rendering")
    const startProcessingTime = Date.now();
    const {
        duration: sceneDuration,
        mediaInfo,
    } = await captureScene({
        media,
        name,
        path,
        fps,
        width,
        height,
        startTime,
        duration,
        cache,
        scale,
    });
    await recordVideo({
        duration: sceneDuration,
        fps,
        output,
        width,
        height,
        mediaInfo,
    });
   !cache && rmdir("./.scene_cache");
   const endProcessingTime = Date.now();

   console.log(`End Rendering(Rendering Time: ${(endProcessingTime - startProcessingTime) / 1000}s)`);

   server.close();
})();