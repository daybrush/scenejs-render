const { fstat } = require("fs");
const core = require("./dist/core.cjs");
const fs = require('fs');

const renderer = new core.Renderer();


const results = [];

for (let i = 0; i <= 120; ++i) {
    results.push(renderer.writeImage(`frame${i}.png`, `./.scene_ch/frame${i}.png`));
}


Promise.all(results).then(async () => {
    const output = await renderer.renderVideo({
        inputs: ["frame%d.png"],
        duration: 2,
        fps: 60,
        ext: "mp4",
    });

    fs.writeFileSync("output.mp4", output);

    renderer.destroy();
});
