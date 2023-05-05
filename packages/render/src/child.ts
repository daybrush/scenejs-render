import puppeteer from "puppeteer";
import type { Page, Browser } from "puppeteer";
import { openPage } from "./utils";
import { ChildOptions, RecordOptions, ChildWorker } from "./types";


export function getTimeFunction(options: ChildOptions, time: number) {
    const {
        hasOnlyMedia,
        hasMedia,
        name,
        delay,
        media,
    } = options;
    return new Function(`
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
}

export async function recordChild(
    page: Page,
    childOptions: ChildOptions,
    data: RecordOptions,
) {
    const {
        imageType,
        alpha,
        cacheFolder,
        playSpeed,
        fps,
        endTime,
        skipFrame,
    } = childOptions;

    const frame = data.frame;
    const time = Math.min(frame * playSpeed / fps, endTime);
    const timeFunction = getTimeFunction(childOptions, time);

    await page.evaluate(timeFunction as any);

    const fileName = `./${cacheFolder}/frame${frame - skipFrame}.${imageType}`;

    await page.screenshot({
        type: imageType,
        path: fileName,
        omitBackground: alpha,
    });

    return fileName;
}


export function createChildWorker(workerIndex: number): ChildWorker {
    let browser!: Browser;
    let page!: Page;
    let ready!: Promise<void>;
    let childOptions!: ChildOptions;

    return {
        workerIndex,
        async start(options: ChildOptions) {
            childOptions = options;

            console.log(`Start Worker ${workerIndex}`);
            ready = new Promise<void>(async resolve => {
                browser = await puppeteer.launch({
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                });
                page = await openPage(browser, options);
                resolve();
            });

            return ready;
        },
        record(options: RecordOptions) {
            return recordChild(page, childOptions, options);
        },
        disconnect() {
            return browser.close();
        },
    };
}
