const puppeteer = require('puppeteer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require("fs");
const scene = require("scenejs");

async function caputreScene({
    name,
    path,
    startTime = 0,
    duration,
    fps,
    width,
    height,
}) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.setViewport({
        width,
        height,
    });
    await page.goto(path);

    const playSpeed = await page.evaluate(`${name}.getPlaySpeed()`);
    const iterationCount = await page.evaluate(`${name}.getIterationCount()`);
    const delay = await page.evaluate(`${name}.getDelay()`);
    const sceneDuration = iterationCount === "infinite" ? delay + await page.evaluate(`${name}.getDuration()`) : await page.evaluate(`${name}.getTotalDuration()`);
    const endTime = typeof duration === "undefined" ? sceneDuration : Math.min(startTime + duration, sceneDuration);

    const startFrame = startTime  * fps / playSpeed;
    const endFrame = endTime * fps / playSpeed;


    console.log(`Start Capture (startTime: ${startTime}, endTime: ${endTime}, fps: ${fps}, startFrame: ${startFrame}, endFrame: ${endFrame})`);;

    
    if (!fs.existsSync("./.scene_cache")) {
        fs.mkdirSync("./.scene_cache");
    }
    async function loop(frame) {
        const time = Math.min(frame * playSpeed / fps, endTime);

        console.log(`Capture frame: ${frame}, time: ${time}`);
        await page.evaluate(`${name}.setTime(${time - delay}, true)`);
        await page.screenshot({ path: `./.scene_cache/frame${frame}.png` });

        if (time === endTime) {
            return;
        }
        await loop(frame + 1);
    }

    await loop(startFrame);
    await browser.close();


    return {
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
    audios,
}) {
    return new Promise(async (resolve, reject) => {
        const frames = [];
        for (let i = 0; i <= duration * fps; ++i) {
            frames[i] = `./.scene_cache/frame${i}.png`;
        }

        await Promise.all(audios.map(([path, delay, startTime, endTime], i) => {
            return convertAudio(i, path, delay, startTime, endTime);
        }));
        await mergeAudios(audios.length);

        console.log(`Processing start (totalframe: ${frames.length}, duration: ${duration}, fps: ${fps})`);
        const converter = ffmpeg()
            .addInput('./.scene_cache/frame%d.png')
            // .addInput('./test.mp3')
            .inputFPS(fps)
            .loop(duration)
            .on('error', function(err) {
                console.log('An error occurred: ' + err.message);
                reject();
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
            .addInput("./.scene_cache/merge.mp3")
            .audioCodec('aac')
            .audioBitrate('128k')
            // .audioFrequency(22050)
            .audioChannels(4)
            .save(output);
    });
}
async function convertAudio(i, path, delay, startTime, endTime) {
    console.log("Convert Audio", path);
    return new Promise((resolve, reject) => {
        ffmpeg(path)
        .seekInput(startTime)
        .inputOptions(`-to ${endTime}`)
        .audioFilters([`adelay=${delay * 1000}|${delay * 1000}`, `atempo=2`])
        .on('error', function(err) {
            console.log('An error occurred: ' + err.message);
            reject();
        })
        .on('end', function() {
            resolve();
        })
        .save(`./.scene_cache/audio${i}.mp3`);
    });
}
async function mergeAudios(count) {
    console.log("Merge Audios");
    return new Promise((resolve, reject) => {
        const converter = ffmpeg();
        for (let i = 0; i < count; ++i) {
            converter.addInput(`./.scene_cache/audio${i}.mp3`);
        }
        
        converter.inputOptions(`-filter_complex amix=inputs=${count}:duration=longest`)
        .on('error', function(err) {
            console.log('An error occurred: ' + err.message);
            reject();
        })
        .on('end', function() {
            resolve();
        })
        .save("./.scene_cache/merge.mp3");
    });
}
(async () => {
    const name = "scene";
    const path = "http://127.0.0.1:8080/test.html";
    const fps = 60;
    const width = 1920;
    const height = 1080;
    const output = "output.mp4";
    const startTime = 0;
    const audios = [
        ["./test.mp3", 0, 20, 25],
        ["./test2.mp3", 1, 40, 45],
    ];
    let duration;

    const {
        duration: sceneDuration,
    } = await caputreScene({
        name,
        path,
        fps,
        width,
        height,
        startTime,
        duration
    });
    await recordVideo({
        duration: sceneDuration,
        fps,
        output,
        width,
        height,
        audios,
    });
   rmdir("./.scene_cache");
})();