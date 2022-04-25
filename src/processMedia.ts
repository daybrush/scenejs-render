import ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";
import { hasProtocol, resolvePath } from "./utils";

async function convertAudio({
    i,
    path,
    skip,
    delay,
    seek,
    playSpeed,
    volume,
}) {
    console.log("Convert Audio", path);
    const [startTime, endTime] = seek;
    return new Promise<void>(resolve => {
        const audioPath = `./.scene_cache/audio${i}.mp3`;

        ffmpeg(path)
            .seekInput(startTime)
            .inputOptions([`-itsoffset ${-skip * playSpeed}`, `-to ${endTime}`])
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

export default async function processMedia(startTime, mediaInfo, input, output) {
    console.log("Process Media");
    let length = 0;
    const medias = mediaInfo.medias;
    const duration = mediaInfo.duration;

    if (!duration || !medias) {
        return false;
    }

    !fs.existsSync("./.scene_cache") && fs.mkdirSync("./.scene_cache");

    await Promise.all(medias.map(media => {
        const url = media.url;
        const seek = media.seek;
        const delay = media.delay - startTime;
        const playSpeed = media.playSpeed;
        const volume = media.volume;

        const path = hasProtocol(url) ? url : resolvePath(input, url);

        return convertAudio({
            i: length++,
            path,
            skip: delay < 0 ? -delay : 0,
            delay: delay > 0 ? delay : 0,
            seek,
            playSpeed,
            volume,
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
            if (fs.existsSync(`./.scene_cache/audio${i}.mp3`)) {
                converter.addInput(`./.scene_cache/audio${i}.mp3`);
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
            .save("./.scene_cache/merge.mp3");
    });

    if (result && output) {
        fs.copyFileSync("./.scene_cache/merge.mp3", output);
    }
    return result;
}
