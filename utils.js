
exports.caputreLoop = async function caputreLoop({
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
}) {
    async function loop(frame) {
        const time = Math.min(frame * playSpeed / fps, endTime);

        console.log(`Capture frame: ${frame}, time: ${time}`);
        await page.evaluate(`${name}.setTime(${time - delay}, true)`);

        isMedia && await page.evaluate(`${media}.setTime(${time})`);
        await page.screenshot({ path: `./.scene_cache/frame${frame}.png` });

        if (time === endTime || frame >= endFrame) {
            return;
        }
        await loop(frame + 1);
    }

    await loop(startFrame);
}

exports.openPage = async function openPage({
    browser,
    width,
    height,
    path,
    scale,
    name,
    media
}) {
    const page = await browser.newPage();

    page.setViewport({
        width: width / scale,
        height: height / scale,
        deviceScaleFactor: scale,
    });
    await page.goto(path);

    try {
        await page.evaluate(`${name}.finish()`);
    } catch (e) {

    }
    try {
        await page.evaluate(`${media}.finish()`);
    } catch (e) {

    }
    return page;
}
