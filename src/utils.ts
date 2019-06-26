export function sendMessage(message) {
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

        sendMessage({ frame, totalFrame });
        console.log(`Capture frame: ${frame}, time: ${time}`);
        !isOnlyMedia && await page.evaluate(`${name}.setTime(${time - delay}, true)`);
        isMedia && await page.evaluate(`${media}.setTime(${time})`);
        await page.screenshot({ path: `./.scene_cache/frame${frame}.png` });

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
