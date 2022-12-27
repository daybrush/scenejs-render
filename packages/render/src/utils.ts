import * as fs from "fs";
import { IObject } from "@daybrush/utils";
import { CaptureLoopOptions, RenderingInfoOptions } from "./types";
import type { Browser } from "puppeteer";

export function hasProtocol(url) {
    try {
        const protocol = new URL(url).protocol;

        if (protocol) {
            return true;
        }
    } catch(e) {
    }
    return false;
}
export function resolvePath(path1, path2) {
    let paths = path1.split("/").slice(0, -1).concat(path2.split("/"));

    paths = paths.filter((directory, i) => {
        return i === 0 || directory !== ".";
    });

    let index = -1;

// tslint:disable-next-line: no-conditional-assignment
    while ((index = paths.indexOf("..")) > 0) {
        paths.splice(index - 1, 2);
    }
    return paths.join("/");
}

export function rmdir(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(file => {
            const currentPath = path + "/" + file;

            if (fs.lstatSync(currentPath).isDirectory()) { // recurse
                rmdir(currentPath);
            } else { // delete file
                fs.unlinkSync(currentPath);
            }
        });
        fs.rmdirSync(path);
    }
}
export function sendMessage(message: IObject<any>) {
    process.send && process.send(message);
}
export async function caputreLoop(options: CaptureLoopOptions) {
    const {
        hasOnlyMedia,
        page,
        name,
        delay,
        fps,
        media,
        hasMedia,
        playSpeed,
        skipFrame,
        startFrame,
        endFrame,
        endTime,
        totalFrame,
        imageType,
        alpha,
        cacheFolder,
    } = options;
    async function loop(frame) {
        const time = Math.min(frame * playSpeed / fps, endTime);

        console.log(`Capture frame: ${frame}, time: ${time}`);

        const func = new Function(`
        if (${!hasOnlyMedia}) {
            ${name}.setTime(${time - delay}, true);
        }
        if (${!!hasMedia}) {
            ${media}.setTime(${time});
        }
        var scenes = [];

        function forEach(item) {
            if (!item) {
                return;
            }
            // MediaScene
            if ("getMediaItem" in item) {
                // Media
                var element = item.getMediaItem().getElements()[0];

                if (element && element.seeking) {
                    scenes.push(new Promise(function (resolve) {
                        element.addEventListener("seeked", function () {
                            resolve();
                        }, {
                            once: true,
                        });
                    }));
                }
                return;
            }
            // Scene
            if ("getItem" in item && "forEach" in item) {
                item.forEach(forEach);
            }
        }
        forEach(${name});
        return Promise.all(scenes);`);
        await page.evaluate(func as any);

        await page.screenshot({
            type: imageType,
            path: `./${cacheFolder}/frame${frame - skipFrame}.${imageType}`,
            omitBackground: alpha,
        });


        sendMessage({ type: "capture", frame, totalFrame });
        if (time === endTime || frame >= endFrame) {
            return;
        }
        await loop(frame + 1);
    }

    await loop(startFrame);
}

export async function openPage({
    browser,
    width,
    height,
    path,
    scale,
    name,
    media,
    referer,
}) {
    const page = await (browser as Browser).newPage();

    page.setUserAgent(browser.userAgent() + " Scene.js");
    page.setViewport({
        width: width / scale,
        height: height / scale,
        deviceScaleFactor: scale,
    });
    await page.goto(path, {
        referer,
    });

    const result = await page.evaluate(`(async () => {
        const timeout = Date.now() + 10000;

        async function retry() {
            if (Date.now() > timeout) {
                return false;
            }
            if (typeof ${name} !== "undefined") {
                return true;
            }
            return await new Promise(resolve => {
                setTimeout(async () => {
                    resolve(retry());
                }, 500);
            })
        }

        return await retry();
    })()`);

    if (!result) {
        throw new Error("Timeout: 10000ms");
    }
    try {
        await page.evaluate(`${name}.finish()`);
    } catch (e) {
        //
    }
    try {
        await page.evaluate(`${media}.finish()`);
    } catch (e) {
        //
    }
    return page;
}

export function getRenderingInfo(state: RenderingInfoOptions) {
    const {
        parentFPS,
        parentStartTime,
        parentDuration,
        playSpeed,
        multi,
    } = state;

    let iterationCount = 0;
    if (state.iterationCount === "infinite") {
        iterationCount = state.iteration || 1;
    } else {
        iterationCount = state.iterationCount;
    }
    const totalDuration = state.delay + state.duration * (iterationCount);
    const endTime = parentDuration > 0
        ? Math.min(parentStartTime + parentDuration, totalDuration)
        : totalDuration;
    const startTime = Math.min(parentStartTime, endTime);
    const startFrame = Math.floor(startTime * parentFPS / playSpeed);
    const endFrame = Math.ceil(endTime * parentFPS / playSpeed);

    const dist = Math.ceil((endFrame - startFrame) / multi);
    const loops: Array<{
        startFrame: number;
        endFrame: number;
    }> = [];

    for (let i = 0; i < multi; ++i) {
        loops.push({
            startFrame: startFrame + dist * i +  (i === 0 ? 0 : 1),
            endFrame: startFrame + dist * (i + 1),
        });
    }

    return {
        loops,
        iterationCount,
        startTime,
        endTime,
        startFrame,
        endFrame,
    };
}
