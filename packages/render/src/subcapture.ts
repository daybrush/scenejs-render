import puppeteer from "puppeteer";
import { SubCaptureOptions } from "./types";
import { openPage, caputreLoop } from "./utils";

async function capture({
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
    startFrame,
    endFrame,
    totalFrame,
    hasMedia,
    skipFrame,
    referer,
    imageType,
    alpha,
    cacheFolder,
}: SubCaptureOptions) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
    });
    const page = await openPage({
        browser,
        width,
        height,
        path,
        scale,
        name,
        media,
        referer,
    });

    console.log(`Start SubCapture (startFrame: ${startFrame}, endFrame: ${endFrame})`);
    await caputreLoop({
        page,
        name,
        fps,
        delay,
        media,
        hasMedia,
        playSpeed,
        startFrame,
        endFrame,
        endTime,
        totalFrame,
        skipFrame,
        hasOnlyMedia: false,
        imageType,
        alpha: !!alpha,
        cacheFolder,
    });

    await browser.close();
}

process.on("message", async data => {
    await capture(data as any);

    process.exit();
});
