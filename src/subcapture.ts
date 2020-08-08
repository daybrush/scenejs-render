import puppeteer from "puppeteer";
import { openPage, caputreLoop } from "./utils";
const Xvfb = require('xvfb');

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
    isMedia,
    referer,
}) {

    const xvfb = new Xvfb({silent: true, xvfb_args: ["-screen", "0", `${width}x${height}x24`, "-ac"],});
    xvfb.startSync()

    const browser = await puppeteer.launch();
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
        isMedia,
        playSpeed,
        startFrame,
        endFrame,
        endTime,
        totalFrame,
        isOnlyMedia: false,
    });

    await browser.close();
    xvfb.stopSync()

}

process.on("message", async data => {
    await capture(data);

    process.exit();
});
