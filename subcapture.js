const puppeteer = require('puppeteer');
const {openPage, caputreLoop} = require('./utils');


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
}) {
    const browser = await puppeteer.launch();
    const page = await openPage({
        browser,
        width,
        height,
        path,
        scale,
        name,
        media,
    });

    console.log(`Start SubCapture (startFrame: ${startFrame}, endFrame: ${endFrame})`)
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
    });


    await browser.close();
}



process.on('message', async (data) => {
    await capture(data);

    process.exit();
});
