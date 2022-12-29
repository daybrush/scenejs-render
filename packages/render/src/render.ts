import puppeteer, { ConsoleMessage, Page } from "puppeteer";
import { openPage, rmdir } from "./utils";
import * as fs from "fs";
import { Animator, IterationCountType } from "scenejs";
import { RenderOptions } from "./types";
import Recorder from "@scenejs/recorder";
import { MediaSceneInfo } from "@scenejs/media";
import { ChildOptions, ChildWorker, RecordOptions } from "./types";
import { createChildWorker, recordChild } from "./child";
import * as pathModule from "path";
import * as url from "url";
import { Blob } from "buffer";
import { RenderRecorder } from "./RenderRecorder";

async function getMediaInfo(page: Page, media: string) {
    if (!media) {
        return;
    }
    try {
        return await page.evaluate(`${media}.finish().getInfo()`) as MediaSceneInfo;
    } catch (e) {
        //
    }

    return;
}

export default async function render({
    name = "scene",
    media = "mediaScene",
    fps = 60,
    width = 1920,
    height = 1080,
    input: inputPath = "./index.html",
    output: outputPath = "output.mp4",
    startTime: inputStartTime = 0,
    duration: inputDuration = 0,
    iteration: inputIteration = 0,
    scale,
    multi,
    bitrate = "4096k",
    codec,
    referer,
    imageType = "png",
    alpha = 0,
    cache,
    cacheFolder = ".scene_cache",
    cpuUsed,
}: RenderOptions = {}) {
    let path;

    if (inputPath.match(/https*:\/\//g)) {
        path = inputPath;
    } else {
        path = url.pathToFileURL(pathModule.resolve(process.cwd(), inputPath)).href;
    }
    const outputs = outputPath.split(",");
    const videoOutputs = outputs.filter(file => file.match(/\.(mp4|webm)$/g));
    const isVideo = videoOutputs.length > 0;
    const audioPath = outputs.find(file => file.match(/\.mp3$/g));
    const recorder = new RenderRecorder({
        log: true,
    });

    recorder.init();

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
    });

    const page = await openPage(browser, {
        name,
        media,
        width,
        height,
        path,
        scale,
        referer,
    });

    const mediaInfo = await getMediaInfo(page, media);
    const hasMedia = !!mediaInfo;

    if (hasMedia) {
        await recorder.recordMedia(mediaInfo, {
            inputPath,
        });
    }

    if (!isVideo) {
        console.log("No Video");

        if (audioPath && hasMedia) {
            console.log("Audio File is created")
            fs.writeFileSync(audioPath, recorder.getAudioFile());
        } else {
            throw new Error("Add Audio Input");
        }
        return;

    }

    let hasOnlyMedia = false;
    let iterationCount: IterationCountType;
    let delay: number;
    let playSpeed: number;
    let duration: number;


    try {
        iterationCount = inputIteration || await page.evaluate(`${name}.getIterationCount()`) as IterationCountType;
        delay = await page.evaluate(`${name}.getDelay()`) as number;
        playSpeed = await page.evaluate(`${name}.getPlaySpeed()`) as number;
        duration = await page.evaluate(`${name}.getDuration()`) as number;
    } catch (e) {
        if (hasMedia) {
            console.log("Only Media Scene");
            hasOnlyMedia = true;
            iterationCount = 1;
            delay = 0;
            playSpeed = 1;
            duration = mediaInfo.duration;
        } else {
            throw e;
        }
    }
    const animator = new Animator({
        delay,
        duration,
        iterationCount,
        playSpeed,
    });

    recorder.setAnimator(animator);

    const {
        startFrame,
        startTime,
        endFrame,
        endTime,
    } = recorder.getRecordInfo({
        fps,
        startTime: inputStartTime || 0,
        iteration: inputIteration || 0,
        duration: inputDuration || 0,
        multi,
    });

    let isCache = false;

    if (cache) {
        try {
            const cacheInfo = fs.readFileSync(`./${cacheFolder}/cache.txt`, "utf8");
            const temp = JSON.stringify({ startTime, endTime, fps, startFrame, endFrame });
            if (cacheInfo === temp) {
                isCache = true;
            }
        } catch (e) {
            isCache = false;
        }
    }
    !isCache && rmdir(`./${cacheFolder}`);
    !fs.existsSync(`./${cacheFolder}`) && fs.mkdirSync(`./${cacheFolder}`);

    const childOptions: ChildOptions = {
        hasOnlyMedia,
        name,
        media,
        path,
        width,
        height,
        scale,
        delay,
        hasMedia,
        referer,
        imageType,
        alpha: !!alpha,
        cacheFolder,
        playSpeed,
        fps,
        endTime,
        skipFrame: startFrame,
    };
    const workers: ChildWorker[] = [
        {
            workerIndex: 0,
            start() {
                console.log("Start Worker 0");
                return Promise.resolve();
            },
            record(recordOptions: RecordOptions) {
                return recordChild(
                    page,
                    childOptions,
                    recordOptions,
                );
            },
            disconnect() {
                return browser.close();
            }
        }
    ];
    recorder.setRenderRecording(imageType, workers, isCache, cacheFolder);

    if (isCache) {
        console.log(`Use Cache (startTime: ${startTime}, endTime: ${endTime}, fps: ${fps}, startFrame: ${startFrame}, endFrame: ${endFrame})`);
    } else {
        console.log(`Start Record (startTime: ${startTime}, endTime: ${endTime}, fps: ${fps}, startFrame: ${startFrame}, endFrame: ${endFrame}, workers: ${multi})`);

        for (let i = 1; i < multi; ++i) {
            workers.push(createChildWorker(i));
        }

        await Promise.all(workers.map(worker => worker.start(childOptions)));
    }
    const ext = pathModule.parse(videoOutputs[0]).ext.replace(/^\./g, "") as "mp4" | "webm";
    const data = await recorder.record({
        ext,
        fps,
        startTime: inputStartTime || 0,
        iteration: inputIteration || 0,
        duration: inputDuration || 0,
        multi,
        codec,
        bitrate,
        cpuUsed,
    });

    console.log(`Created Video: ${outputPath}`);
    fs.writeFileSync(outputPath, data);

    cache && fs.writeFileSync(`./${cacheFolder}/cache.txt`, JSON.stringify({ startTime, endTime, fps, startFrame, endFrame }));
    !cache && rmdir(cacheFolder);

    await Promise.all(workers.map(worker => worker.disconnect()));


    recorder.destroy();
}
