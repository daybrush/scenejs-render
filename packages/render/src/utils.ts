import * as fs from "fs";
import { Page, Browser } from "puppeteer";
import { OpenPageOptions } from "./types";

export async function openPage(browser: Browser, {
    width,
    height,
    path,
    scale,
    name,
    media,
    referer,
}: OpenPageOptions): Promise<Page> {
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


export function isLocalFile(url: string) {
    try {
        const protocol = new URL(url).protocol;

        if (!protocol || protocol.startsWith("file")) {
            return true;
        } else {
            return false;
        }
    } catch(e) {
    }
    return true;
}
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
