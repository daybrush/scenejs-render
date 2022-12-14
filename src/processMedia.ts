import ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";
import { hasProtocol, resolvePath } from "./utils";

async function convertAudio({
    i,
    path,
    delay,
    seek,
    playSpeed,
    volume,
    cacheFolder,
}) {
    console.log("Convert Audio", path);
    const [startTime, endTime] = seek;
    return new Promise<void>(resolve => {
        const audioPath = `./${cacheFolder}/audio${i}.mp3`;

        ffmpeg(path)
            .seekInput(startTime)
            .inputOptions(`-to ${endTime}`)
            .audioFilters([`adelay=${delay * playSpeed * 1000}|${delay * playSpeed * 1000}`, `atempo=${playSpeed}`, `volume=${volume}`])
            .on("error", err => {
                console.log(`An audio error path: ${audioPath}, occurred: ${err.message}`);
                resolve();
            })
            .on("end", () => {
                resolve();
            })
            .save(audioPath);
    });
}

export default async function processMedia({
    mediaInfo,
    input,
    output,
    cacheFolder,
}) {
    console.log("Process Media");
    let length = 0;
    const medias = mediaInfo.medias;
    const duration = mediaInfo.duration;

    if (!duration || !medias) {
        return false;
    }

    !fs.existsSync(`./${cacheFolder}`) && fs.mkdirSync(`./${cacheFolder}`);

    await Promise.all(medias.map(media => {
        const url = media.url;
        const seek = media.seek;
        const delay = media.delay;
        const playSpeed = media.playSpeed;
        const volume = media.volume;

        const path = hasProtocol(url) ? url : resolvePath(input, url);

        return convertAudio({
            i: length++,
            path,
            delay,
            seek,
            playSpeed,
            volume,
            cacheFolder,
        });
    }));

    if (!length) {
        return false;
    }

    console.log("Merge Medias");
    const result = await new Promise((resolve, reject) => {
        const converter = ffmpeg();
        let inputLengths = 0;
        for (let i = 0; i < length; ++i) {
            if (fs.existsSync(`./${cacheFolder}/audio${i}.mp3`)) {
                converter.addInput(`./${cacheFolder}/audio${i}.mp3`);
                ++inputLengths;
            }
        }

        converter.inputOptions(`-filter_complex amix=inputs=${inputLengths}:duration=longest`)
            .on("error", err => {
                console.log("An merge error occurred: " + err.message);
                reject(false);
            })
            .on("end", () => {
                resolve(true);
            })
            .save(`./${cacheFolder}/merge.mp3`);
    });

    if (result && output) {
        fs.copyFileSync(`./${cacheFolder}/merge.mp3`, output);
    }
    return result;
}
