import ffmpeg from "fluent-ffmpeg";
import { sendMessage } from "./utils";
import { DEFAULT_CODECS } from "./consts";

export default async function processVideo({
    duration,
    codec,
    fps,
    output,
    width,
    height,
    isMedia,
    bitrate,
    multi,
}) {
    const ext = output.match(/(?<=\.)[^.]+$/g);
    codec = codec || ext && DEFAULT_CODECS[ext[0]] || DEFAULT_CODECS.mp4;

    return new Promise(async (resolve, reject) => {
        const frames = [];
        const totalFrame = duration * fps;

        for (let i = 0; i <= totalFrame; ++i) {
            frames[i] = `./.scene_cache/frame${i}.png`;
        }

        console.log(`Processing start (width: ${width}, height: ${height}, totalframe: ${totalFrame + 1}, duration: ${duration}, fps: ${fps}, media: ${isMedia})`);

        sendMessage({
            type: "process",
            processing: 0,
        });
        const converter = ffmpeg()
            .addInput("./.scene_cache/frame%d.png")
            // .addInput('./test.mp3')
            .inputFPS(fps)
            .loop(duration)
            .on("error", err => {
                console.log("An error occurred: " + err.message);
                reject();
            })
            .on("progress", progress => {
                const percent = (progress.frames || 0) / (totalFrame + 1) * 100;
                sendMessage({
                    type: "process",
                    processing: percent,
                });
                console.log("Processing: " + percent  + "% done");
            })
            .on("end", () => {
                console.log("Processing finished !");
                resolve();
            })
            .videoBitrate(bitrate)
            .videoCodec(codec)
            .outputOption([
                `-cpu-used ${multi}`,
                "-pix_fmt yuv420p",
            ])
            .size(`${width}x${height}`)
            .format("mp4");
        if (isMedia) {
            converter.addInput("./.scene_cache/merge.mp3")
                .audioCodec("aac")
                .audioBitrate("128k")
                // .audioFrequency(22050)
                .audioChannels(2);
        }
        converter.save(output);
    });
}
