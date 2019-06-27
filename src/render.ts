import { createServer } from "http-server";
import captureScene from "./capture";
import processMedia from "./processMedia";
import processVideo from "./processVideo";
import { rmdir } from "./utils";
import { RenderOptions } from "./types";

function openServer(port) {
    const server = createServer({
        cache: -1,
    });

    server.listen(port, "0.0.0.0", () => {
        console.log("Open Server", port);
    });

    return server;
}

export default async function render({
    name = "scene",
    media = "mediaScene",
    port = "3033",
    fps = 60,
    width = 1920,
    height = 1080,
    output = "output.mp4",
    startTime,
    cache,
    scale,
    multi,
    input = "./index.html",
    duration = 0,
    iteration = 0,
    bitrate = "4096k",
    codec,
    referer,
}: RenderOptions = {}) {
    let server;
    let path;

    if (input.match(/https*:\/\//g)) {
        path = input;
    } else {
        server = openServer(port);
        path = `http://0.0.0.0:${port}/${input}`;

    }
    console.log("Open Page: ", path);
    try {
        console.log("Start Rendering");

        const outputs = output.split(",");
        const videoOutputs = outputs.filter(file => file.match(/\.(mp4|webm)$/g));
        const isVideo = videoOutputs.length;
        const audioPath = outputs.find(file => file.match(/\.mp3$/g));

        const startProcessingTime = Date.now();
        const {
            duration: sceneDuration,
            mediaInfo,
        } = await captureScene({
            media,
            name,
            path,
            fps,
            width,
            height,
            startTime,
            duration,
            iteration,
            cache,
            scale,
            multi,
            isVideo,
            referer,
        });
        const isMedia = await processMedia(mediaInfo, input, audioPath);

        server && server.close();
        if (isVideo) {
            await Promise.all(videoOutputs.map(file => {
                return processVideo({
                    duration: sceneDuration,
                    bitrate,
                    codec,
                    fps,
                    output: file,
                    width,
                    height,
                    multi,
                    isMedia,
                });
            }));
        }
        !cache && rmdir("./.scene_cache");
        const endProcessingTime = Date.now();

        console.log(`End Rendering(Rendering Time: ${(endProcessingTime - startProcessingTime) / 1000}s)`);
    } catch (e) {
        console.error(e);
        process.exit(200);
        return;
    }
    process.exit(0);
}
