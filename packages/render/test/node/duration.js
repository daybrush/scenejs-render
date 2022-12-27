// const { getVideoDurationInSeconds } = require('get-video-duration')

// // From a local path...
// getVideoDurationInSeconds(`./output.mp4`).then((duration) => {
//     console.log(duration)
// })

const fs = require("fs").promises;
const buff = Buffer.alloc(100);
const header = Buffer.from("mvhd");
async function main() {
    const file = await fs.open("./output.mp4", "r");
    const { buffer } = await file.read(buff, 0, 100, 0);
    await file.close();
    const start = buffer.indexOf(header) + 17;
    const timeScale = buffer.readUInt32BE(start);
    const duration = buffer.readUInt32BE(start + 4);
    const audioLength = Math.floor((duration / timeScale) * 1000) / 1000;
    console.log(start, timeScale, duration, audioLength);
}
main();
