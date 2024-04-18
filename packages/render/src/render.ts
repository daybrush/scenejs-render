import puppeteer, { Page } from "puppeteer";
import { isLocalFile, openPage, rmdir } from "./utils";
import * as fs from "fs";
import { IterationCountType } from "scenejs";
import { RenderOptions } from "./types";
import { createTimer } from "@scenejs/recorder";
import { MediaSceneInfo } from "@scenejs/media";
import { ChildOptions, ChildWorker, RecordOptions } from "./types";
import { createChildWorker, recordChild } from "./child";
import * as pathModule from "path";
import * as url from "url";
import { fetchFile } from "@ffmpeg/ffmpeg";
import { isString } from "@daybrush/utils";
import { BinaryRecorder } from "./BinaryRecorder";
import { RenderRecorder } from "./RenderRecorder";
import { Logger } from "./Logger";

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

/**
 * @namespace Render
 */
/**
 * @memberof Render
 * @param options
 * @return {$ts:Promise<void>}
 * @example
import { render } from "@scenejs/render";

render({
  input: "./index.html",
  name: "scene",
  output: "output.mp4",
});
 */
async function render(options: RenderOptions = {}) {
    const {
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
        scale = 1,
        multi = 1,
        bitrate = "4096k",
        codec,
        referer,
        imageType = "png",
        alpha = 0,
        cache,
        cacheFolder = ".scene_cache",
        cpuUsed,
        ffmpegLog,
        buffer,
        ffmpegPath,
        noLog,
        created,
        logger: externalLogger,
    } = options;
    let path;

    if (inputPath.match(/^https?:\/\//)) {
        path = inputPath;
    } else {
        path = url.pathToFileURL(pathModule.resolve(process.cwd(), inputPath)).href;
    }
    const logger = new Logger(externalLogger, !noLog);
    const timer = createTimer();

    logger.log("Start Render");
    const outputs = outputPath.split(",");
    const videoOutputs = outputs.filter(file => file.match(/\.(mp4|webm)$/g));
    const isVideo = videoOutputs.length > 0;
    const audioPath = outputs.find(file => file.match(/\.mp3$/g));
    const recorder = ffmpegPath ? new BinaryRecorder({
        ffmpegPath,
        cacheFolder,
        log: !!ffmpegLog,
        logger,
    }) : new RenderRecorder({
        log: !!ffmpegLog,
        logger,
    });


    // create a Recorder instance and call `created` hook function.
    created?.(recorder);
    recorder.init();

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
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
            logger.log("Only Media Scene");
            hasOnlyMedia = true;
            iterationCount = 1;
            delay = 0;
            playSpeed = 1;
            duration = mediaInfo.duration;
        } else {
            throw e;
        }
    }

    recorder.setAnimator({
        delay,
        duration,
        iterationCount,
        playSpeed,
    });

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

    // Process Cache: Pass Capturing
    let isCache = false;
    const nextInfo = JSON.stringify({ inputPath, startTime, endTime, fps, startFrame, endFrame, imageType });

    if (cache) {
        try {
            const cacheInfo = fs.readFileSync(`./${cacheFolder}/cache.txt`, "utf8");

            if (cacheInfo === nextInfo) {
                isCache = true;
            }
        } catch (e) {
            isCache = false;
        }
    }

    !isCache && rmdir(`./${cacheFolder}`);
    !fs.existsSync(`./${cacheFolder}`) && fs.mkdirSync(`./${cacheFolder}`);


    if (hasMedia) {
        recorder.setFetchFile(data => {
            if (isString(data) && isLocalFile(data)) {
                let fileName = data;
                try {
                    fileName = new URL(data).pathname;
                } catch (e) { }

                return Promise.resolve().then(() => {
                    return fs.readFileSync(fileName);
                });
            }
            return fetchFile(data);
        });

        await recorder.recordMedia(mediaInfo, {
            inputPath,
        });
    }

    if (!isVideo) {
        logger.log("No Video");

        if (audioPath && hasMedia) {
            logger.log("Audio File is created")
            fs.writeFileSync(audioPath, recorder.getAudioFile());
        } else {
            throw new Error("Add Audio Input");
        }
        return;
    }


    if (hasMedia) {
        fs.writeFileSync(`./${cacheFolder}/merge.mp3`, recorder.getAudioFile());
    }


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
        buffer: !!buffer,
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
                logger.log("Start Worker 0");
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
    recorder.setRenderCapturing(imageType, workers, isCache, cacheFolder);

    if (isCache) {
        logger.log(`Use Cache (startTime: ${startTime}, endTime: ${endTime}, fps: ${fps}, startFrame: ${startFrame}, endFrame: ${endFrame})`);
    } else {
        logger.log(`Start Workers (startTime: ${startTime}, endTime: ${endTime}, fps: ${fps}, startFrame: ${startFrame}, endFrame: ${endFrame}, workers: ${multi})`);

        for (let i = 1; i < multi; ++i) {
            workers.push(createChildWorker(i));
        }

        await Promise.all(workers.map(worker => worker.start(childOptions)));
    }
    const ext = pathModule.parse(videoOutputs[0]).ext.replace(/^\./g, "") as "mp4" | "webm";

    recorder.once("captureEnd", () => {
        cache && fs.writeFileSync(`./${cacheFolder}/cache.txt`, nextInfo);
    });
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

    logger.log(`Created Video: ${outputPath}`);
    fs.writeFileSync(outputPath, data);

    !cache && rmdir(cacheFolder);

    await Promise.all(workers.map(worker => worker.disconnect()));


    recorder.destroy();
    logger.log(`End Render (Rendering Time: ${timer.getCurrentInfo(1).currentTime}s)`);

    return recorder;
}


export default render;
