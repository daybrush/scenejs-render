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
async function convertAudio(path, startTime, endTime) {
    console.log("Convert Audio", path);
    return new Promise((resolve, reject) => {
        ffmpeg(path)
        .seekInput(startTime)
        .inputOptions(`-to ${endTime}`)
        // .audioCodec('aac')
        // .audioBitrate('128k')
        .on('error', function(err) {
            console.log('An error occurred: ' + err.message);
            reject();
        })
        .on('end', function() {
            resolve();
        })
        .save("./.scene_cache/" + path);
    });
}
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

        await Promise.all(audios.map(audio => {
            return convertAudio(audio[0], audio[3], audio[4]);
        }));

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

        // audios.forEach(audio => {
        //     converter.addInput("./.scene_cache/" + audio[0])
        //     // .audioFilters(["adelay=5000|5000"])
        // })
            converter.addInput("concat:./.scene_cache/test.mp3|./.scene_cache/test2.mp3");
            converter.audioCodec('aac')
            .audioBitrate('128k')
            // .audioFrequency(22050)
            .audioChannels(4)
            .save(output);
    });
}
async function convertAudio2(path, startTime, endTime) {
    console.log("Convert Audio", path);
    return new Promise((resolve, reject) => {
        ffmpeg()
        .addInput("./.scene_cache/test.mp3")
        // .audioFilters(["adelay=2000|2000"])
        .addInput("./.scene_cache/test2.mp3")
        .inputOptions(`-filter_complex amerge`)
        // .audioFilters([
        //     "amerge",
        //     // "amovie=./.scene_cache/test.mp3 [l]",
        //     // "amovie=./.scene_cache/test2.mp3 [r]",
        //     // "[l] [r] amerge",
        // ])
        // .inputOptions(`-to ${endTime}`)
        // .audioCodec('aac')
        // .audioBitrate('128k')
        .on('error', function(err) {
            console.log('An error occurred: ' + err.message);
            reject();
        })
        .on('end', function() {
            resolve();
        })
        .save("./.scene_cache/test3.mp3");
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
    let duration;

    // const {
    //     duration: sceneDuration,
    // } = await caputreScene({
    //     name,
    //     path,
    //     fps,
    //     width,
    //     height,
    //     startTime,
    //     duration
    // });

    await convertAudio2();
    // await recordVideo({
    //     duration: 12.857142857142857,
    //     fps,
    //     output,
    //     width,
    //     height,
    //     audios: [
    //         ["./test.mp3", 0, 10, 20, 25],
    //         ["./test2.mp3", 0, 10, 40, 45],
    //     ],
    // });

//    rmdir("./.scene_cache");
})();