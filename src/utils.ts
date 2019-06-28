import * as fs from "fs";
import { IObject } from "@daybrush/utils";

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
export async function caputreLoop({
    isOnlyMedia,
    page,
    name,
    delay,
    fps,
    media,
    isMedia,
    playSpeed,
    startFrame,
    endFrame,
    endTime,
    totalFrame,
}) {
    async function loop(frame) {
        const time = Math.min(frame * playSpeed / fps, endTime);

        console.log(`Capture frame: ${frame}, time: ${time}`);
        !isOnlyMedia && await page.evaluate(`${name}.setTime(${time - delay}, true)`);
        isMedia && await page.evaluate(`${media}.setTime(${time})`);
        await page.screenshot({ path: `./.scene_cache/frame${frame}.png` });

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
    const page = await browser.newPage();

    page.setUserAgent(browser.userAgent() + " Scene.js");
    page.setViewport({
        width: width / scale,
        height: height / scale,
        deviceScaleFactor: scale,
    });
    await page.goto(path, {
        referer,
    });

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
