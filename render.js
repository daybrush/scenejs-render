const puppeteer = require('puppeteer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const createServer = require('http-server').createServer;
const { fork } = require('child_process');
const { openPage, caputreLoop, sendMessage } = require('./utils');
const { isUndefined } = require("@daybrush/utils");
const DEFAULT_CODECS = {
    "mp4": "libx264",
    "webm": "libvpx-vp9",
};

async function getMediaInfo(page, media) {
    if (!media) {
        return;
    }
    try {
        return await page.evaluate(`${media}.finish().getInfo()`);
    } catch (e) {
    }

    return;
}
async function forkCapture(datas) {
    const compute = fork(__dirname + '/subcapture.js');

    return new Promise(resolve => {
        compute.on('message', result => {
            sendMessage(result);
        });
        compute.on("close", () => {
            resolve();
        })
        compute.on("exit", () => {
            resolve();
        })
        compute.send(datas);
    });
}
async function captureScene({
    name,
    media,
    path,
    startTime = 0,
    duration,
    iteration,
    fps,
    width,
    height,
    cache,
    scale,
    multi,
    isVideo,
}) {
    const browser = await puppeteer.launch({
        headless: true,
    });
    const page = await openPage({
        browser,
        name,
        media,
        width,
        height,
        path,
        scale,
    });

    const mediaInfo = await getMediaInfo(page, media);
    const isMedia = !!mediaInfo;

    if (!isVideo) {
        console.log("No Video");
        return {
            mediaInfo: mediaInfo || {},
            duration: isMedia ? mediaInfo.duration : 0,
        }
    }


    let isOnlyMedia = false;
    let iterationCount;
    let delay;
    let playSpeed;
    let sceneDuration;
    let totalDuration;
    let endTime;
    let startFrame;
    let endFrame;

    try {
        iterationCount = await page.evaluate(`${name}.getIterationCount()`);
        delay = await page.evaluate(`${name}.getDelay()`);
        playSpeed = await page.evaluate(`${name}.getPlaySpeed()`);
        sceneDuration = await page.evaluate(`${name}.getDuration()`);

        if (iterationCount === "infinite") {
            iterationCount =  iteration || 1;
        }
        totalDuration = delay + sceneDuration * iterationCount;
        endTime = duration > 0
            ? Math.min(startTime + duration, totalDuration)
            : totalDuration;
        startFrame = Math.floor(startTime * fps / playSpeed);
        endFrame = Math.ceil(endTime * fps / playSpeed);
    } catch (e) {
        if (isMedia) {
            console.log("Only Media Scene");
            isOnlyMedia = true;
            iterationCount = 1;
            delay = 0;
            playSpeed = 1;
            sceneDuration = mediaInfo.duration;
            endTime = isUndefined(duration) ? sceneDuration : Math.min(startTime + duration, sceneDuration);
            startFrame = Math.floor(startTime * fps / playSpeed);
            endFrame = Math.ceil(endTime * fps / playSpeed);
        } else {
            throw e;
        }
    }
    let isCache = false;

    if (cache) {
        try {
            const cacheInfo = fs.readFileSync("./.scene_cache/cache.txt", "utf8");
            const temp = JSON.stringify({ startTime, endTime, fps, startFrame, endFrame });
            if (cacheInfo === temp) {
                isCache = true;
            }
        } catch (e) {
            isCache = false;
        }
    }
    !isCache && rmdir("./.scene_cache");
    !fs.existsSync("./.scene_cache") && fs.mkdirSync("./.scene_cache");

    if (isCache) {
        console.log(`Use Cache (startTime: ${startTime}, endTime: ${endTime}, fps: ${fps}, startFrame: ${startFrame}, endFrame: ${endFrame})`);;
    } else {
        console.log(`Start Capture (startTime: ${startTime}, endTime: ${endTime}, fps: ${fps}, startFrame: ${startFrame}, endFrame: ${endFrame}, multi-process: ${multi})`);;
        const dist = Math.ceil((endFrame - startFrame) / multi);
        let loops = [];

        for (let i = 1; i < multi; ++i) {
            const processStartFrame = startFrame + dist * i + 1;
            const processEndFrame = startFrame + dist * (i + 1);

            loops.push(forkCapture({
                isOnlyMedia,
                name,
                media,
                path,
                endTime,
                fps,
                width,
                height,
                scale,
                delay,
                playSpeed,
                startFrame: processStartFrame,
                endFrame: processEndFrame,
                isMedia,
                totalFrame: endFrame,
            }));
        }
        const mainLoop = caputreLoop({
            isOnlyMedia,
            page,
            name,
            fps,
            delay,
            media,
            isMedia,
            playSpeed,
            startFrame,
            endFrame: startFrame + dist,
            endTime,
            totalFrame: endFrame,
        });
        loops.push(mainLoop);
        await Promise.all(loops);
    }
    fs.writeFileSync("./.scene_cache/cache.txt", JSON.stringify({ startTime, endTime, fps, startFrame, endFrame }));
    await browser.close();
    return {
        mediaInfo: mediaInfo || {},
        duration: (endTime - startTime) / playSpeed,
    }
}

function rmdir(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file) {
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
    codec,
    fps,
    output,
    width,
    height,
    isMedia,
    bitrate,
    multi,
}) {
    const ext = output.match(/(?<=\.)[^.]+$/g);
    codec = codec || ext && DEFAULT_CODECS[ext[0]] || codecs["mp4"];

    return new Promise(async (resolve, reject) => {
        const frames = [];
        for (let i = 0; i <= duration * fps; ++i) {
            frames[i] = `./.scene_cache/frame${i}.png`;
        }

        console.log(`Processing start (width: ${width}, height: ${height}, totalframe: ${frames.length}, duration: ${duration}, fps: ${fps}, media: ${isMedia})`);

        sendMessage({
            processing: 0,
        });
        const converter = ffmpeg()
            .addInput('./.scene_cache/frame%d.png')
            // .addInput('./test.mp3')
            .inputFPS(fps)
            .loop(duration)
            .on('error', function (err) {
                console.log('An error occurred: ' + err.message);
                reject();
            })
            .on('progress', function (progress) {
                sendMessage({
                    processing: progress.percent,
                });
                console.log('Processing: ' + progress.percent + '% done');
            })
            .on('end', function () {
                console.log('Processing finished !');
                resolve();
            })
            .videoBitrate(bitrate)
            .videoCodec(codec)
            .outputOption([
                `-cpu-used ${multi}`,
                "-pix_fmt yuv420p",
            ])
            .size(`${width}x${height}`)
            .format("mp4")
        if (isMedia) {
            converter.addInput("./.scene_cache/merge.mp3")
                .audioCodec('aac')
                .audioBitrate('128k')
                // .audioFrequency(22050)
                .audioChannels(2)
        }
        converter.save(output);
    });
}
async function convertAudio({
    i,
    path,
    delay,
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
            .audioFilters([`adelay=${delay * playSpeed * 1000}|${delay * playSpeed * 1000}`, `atempo=${playSpeed}`, `volume=${volume}`])
            .on('error', function (err) {
                console.log('An audio error occurred: ' + err.message);
                resolve();
            })
            .on('end', function () {
                resolve();
            })
            .save(`./.scene_cache/audio${i}.mp3`);
    });
}

function resolvePath(path1, path2) {
    var paths = path1.split("/").slice(0, -1).concat(path2.split("/"));

    paths = paths.filter(function (directory, i) {
        return i === 0 || directory !== ".";
    });

    var index = -1

    while ((index = paths.indexOf("..")) > 0) {
        paths.splice(index - 1, 2);
    }
    return paths.join("/");
}


async function recordMedia(mediaInfo, input, output) {
    console.log("Convert Medias");
    let length = 0;
    const medias = mediaInfo.medias;
    const duration = mediaInfo.duration;

    if (!duration || !medias) {
        return false;
    }

    !fs.existsSync("./.scene_cache") && fs.mkdirSync("./.scene_cache");

    await Promise.all(medias.map(media => {
        const url = media.url;
        const seek = media.seek;
        const delay = media.delay;
        const playSpeed = media.playSpeed;
        const volume = media.volume;
        const path = resolvePath(input, url);

        return convertAudio({
            i: length++,
            path,
            delay,
            seek,
            playSpeed,
            volume,
        });
    }));

    if (!length) {
        return false;
    }

    console.log("Merge Medias");
    const result = await new Promise((resolve, reject) => {
        const converter = ffmpeg();
        let inputLengths = 0;
        for (let i = 0; i < length; ++i) {
            if (fs.existsSync(`./.scene_cache/audio${i}.mp3`)) {
                converter.addInput(`./.scene_cache/audio${i}.mp3`);
                ++inputLengths;
            }
        }

        converter.inputOptions(`-filter_complex amix=inputs=${inputLengths}:duration=longest`)
            .on('error', function (err) {
                console.log('An merge error occurred: ' + err.message);
                reject(false);
            })
            .on('end', function () {
                resolve(true);
            })
            .save("./.scene_cache/merge.mp3");
    });

    if (result && output) {
        fs.copyFileSync("./.scene_cache/merge.mp3", output)
    }
    return result;
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

exports.render = async function render({
    name = "scene",
    media = "mediaScene",
    port = "3033",
    fps = 60,
    width = 1920,
    height = 1080,
    output = "output.mp4",
    startTime,
    cache,
    scale,
    multi,
    input = "./index.html",
    duration = 0,
    iteration = 0,
    bitrate = "4096k",
    codec,
}) {
    let server;
    let path;

    if (input.match(/https*:\/\//g)) {
        path = input;
    } else {
        server = openServer(port);
        path = `http://0.0.0.0:${port}/${input}`;

    }
    console.log("Open Page: ", path);
    try {
        console.log("Start Rendering");

        const outputs = output.split(",");
        const videoOutputs = outputs.filter(file => file.match(/\.(mp4|webm)$/g));
        const isVideo = videoOutputs.length;
        const audioPath = outputs.find(file => file.match(/\.mp3$/g));

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
            iteration,
            cache,
            scale,
            multi,
            isVideo,
        });
        const isMedia = await recordMedia(mediaInfo, input, audioPath);

        server && server.close();
        if (isVideo) {
            await Promise.all(videoOutputs.map(file => {
                return recordVideo({
                    duration: sceneDuration,
                    bitrate,
                    codec,
                    fps,
                    output: file,
                    width,
                    height,
                    multi,
                    isMedia,
                });
            }));
        }
        !cache && rmdir("./.scene_cache");
        const endProcessingTime = Date.now();

        console.log(`End Rendering(Rendering Time: ${(endProcessingTime - startProcessingTime) / 1000}s)`);
    } catch (e) {
        console.error(e);
        process.exit(200);
        return;
    }
    process.exit(0);
}
