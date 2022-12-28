const { fstat } = require("fs");
const Recorder = require("./dist/recorder.cjs");
const fs = require('fs');
const { Animator } = require("scenejs");

const animator = new Animator({
    duration: 2,
});
const recorder = new Recorder();

recorder.setAnimator(animator);
recorder.setRecording("png", e => {
    return `./.scene_ch/frame${e.frame}.png`;
});

(async () => {
    const output = await recorder.record({
        duration: 2,
        fps: 60,
        ext: "mp4",
    });
    fs.writeFileSync("output.mp4", output);
    recorder.destroy();
})();
