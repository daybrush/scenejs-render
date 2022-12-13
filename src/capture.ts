import puppeteer from "puppeteer";
import { openPage, caputreLoop, sendMessage, rmdir, getRenderingInfo } from "./utils";
import * as fs from "fs";
import { isUndefined } from "@daybrush/utils";
import { fork } from "child_process";
import { IterationCountType } from "scenejs";
import { SubCaptureOptions } from "./types";

async function forkCapture(datas: SubCaptureOptions) {
    const compute = fork(__dirname + "/subcapture.js");

    return new Promise<void>(resolve => {
        compute.on("message", (result: any) => {
            sendMessage(result);
        });
        compute.on("close", () => {
            resolve();
        });
        compute.on("exit", () => {
            resolve();
        });
        compute.send(datas);
    });
}

async function getMediaInfo(page, media) {
    if (!media) {
        return;
    }
    try {
        return await page.evaluate(`${media}.finish().getInfo()`);
    } catch (e) {
        //
    }

    return;
}

export default async function captureScene({
    name,
    media,
    path,
    startTime: startTimeOption = 0,
    duration,
    iteration,
    fps,
    width,
    height,
    cache,
    scale,
    multi,
    isVideo,
    referer,
}) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
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
        referer,
    });

    const mediaInfo = await getMediaInfo(page, media);
    const hasMedia = !!mediaInfo;

    if (!isVideo) {
        console.log("No Video");
        return {
            mediaInfo: mediaInfo || {},
            duration: hasMedia ? mediaInfo.duration : 0,
        };
    }

    let hasOnlyMedia = false;
    let iterationCount: IterationCountType;
    let delay: number;
    let playSpeed: number;
    let sceneDuration: number;
    let info: ReturnType<typeof getRenderingInfo>;


    try {
        iterationCount = iteration || await page.evaluate(`${name}.getIterationCount()`);
        delay = await page.evaluate(`${name}.getDelay()`);
        playSpeed = await page.evaluate(`${name}.getPlaySpeed()`);
        sceneDuration = await page.evaluate(`${name}.getDuration()`);

        info = getRenderingInfo({
            iteration,
            iterationCount,
            delay,
            playSpeed,
            duration: sceneDuration,
            parentDuration: duration,
            parentFPS: fps,
            parentStartTime: 0,
            multi,
        });

        iterationCount = info.iterationCount;
    } catch (e) {
        if (hasMedia) {
            console.log("Only Media Scene");
            hasOnlyMedia = true;
            iterationCount = 1;
            delay = 0;
            playSpeed = 1;
            sceneDuration = mediaInfo.duration;

            info = getRenderingInfo({
                iteration,
                iterationCount,
                delay,
                playSpeed,
                duration: sceneDuration,
                parentDuration: duration,
                parentFPS: fps,
                parentStartTime: 0,
                multi,
            });
        } else {
            throw e;
        }
    }
    iterationCount = info.iterationCount;
    const endTime = info.endTime;
    const startTime = info.startTime;
    const startFrame = info.startFrame;
    const endFrame = info.endFrame;
    const loops = info.loops;
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

    sendMessage({
        type: "captureStart",
        isCache,
        duration: (endTime - startTime) / playSpeed,
    });
    if (isCache) {
        console.log(`Use Cache (startTime: ${startTime}, endTime: ${endTime}, fps: ${fps}, startFrame: ${startFrame}, endFrame: ${endFrame})`);
    } else {
        console.log(`Start Capture (startTime: ${startTime}, endTime: ${endTime}, fps: ${fps}, startFrame: ${startFrame}, endFrame: ${endFrame}, multi-process: ${multi})`);

        const captures = loops.map((loop, i) => {
            if (i == 0) {
                return caputreLoop({
                    hasOnlyMedia,
                    page,
                    name,
                    fps,
                    delay,
                    media,
                    hasMedia,
                    playSpeed,
                    skipFrame: startFrame,
                    startFrame: loop.startFrame,
                    endFrame: loop.endFrame,
                    endTime,
                    totalFrame: endFrame,
                });
            } else {
                return forkCapture({
                    hasOnlyMedia,
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
                    skipFrame: startFrame,
                    startFrame: loop.startFrame,
                    endFrame: loop.endFrame,
                    hasMedia,
                    totalFrame: endFrame,
                    referer,
                });
            }
        });
        await Promise.all(captures);
    }
    fs.writeFileSync("./.scene_cache/cache.txt", JSON.stringify({ startTime, endTime, fps, startFrame, endFrame }));
    await browser.close();
    return {
        mediaInfo: mediaInfo || {},
        duration: (endTime - startTime) / playSpeed,
    };
}
