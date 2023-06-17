const { render } = require("../dist/render.cjs");

// "test:nolog": "rollup -c && node ./index.js -i ./test/test.html --fps 60  -c 1 --cacheFolder .scene_ch --ffmpegPath ./ffmpeg -N",
render({
    input: "./test/test.html",
    fps: 60,
    ffmpegPath: "./ffmpeg",
    cache: true,
    noLog: true,
    logger: (...messages) => {
        console.log(messages);
    },
    created: inst => {
        inst.on("capture", e => {
            console.log(e.ratio);
        });
    },
});
