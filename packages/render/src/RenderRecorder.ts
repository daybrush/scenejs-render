import Recorder, { RecorderOptions } from "@scenejs/recorder";
import { ChildWorker } from "./types";

function toFixed(num: number) {
    return parseFloat(num.toFixed(3));
}

export class RenderRecorder extends Recorder {
    constructor(options?: RecorderOptions) {
        super(options);

        this.on("processVideoStart", e => {
            console.log(`Start Video Process (ext: ${e.ext}, fps: ${e.fps}, duration: ${e.duration})`);
        });
        this.on("processVideoEnd", () => {
            console.log("End Video Process");
        });
        this.on("processAudioStart", e => {
            console.log(`Start Audio Process (audiosLength: ${e.audiosLength})`);
        });
        this.on("processAudioEnd", () => {
            console.log("End Audio Process");
        });
        this.on("captureStart", e => {
            console.log(`Start Capture (startFame: ${e.startFame}, endFrame: ${e.endFrame}, startTime: ${e.startTime}, endTime: ${e.endTime}, fps: ${e.fps}, duration: ${e.duration}, imageType: ${e.imageType})`);
        });
        this.on("captureEnd", () => {
            console.log("End Capture");
        });
        this.on("capture", e => {
            console.log(
                `Capture Progress: ${toFixed(e.frameCount / e.totalFrame * 100)}% (${e.frameCount} / ${e.totalFrame})`
                + `\n- Captured Frame: ${e.frameInfo.frame}`
                + `\n- Current Capturing Time: ${toFixed(e.currentCapturingTime)}s, Expected Capturing Time: ${toFixed(e.expectedCapturingTime)}s`
            );
        });
        this.on("processAudio", e => {
            console.log(
                `Audio Preocessing Progress: ${toFixed(e.ratio * 100)}%`
                + `\n- Current processing Time: ${toFixed(e.currentProcessingTime)}s, Expected Preocessing Time: ${toFixed(e.expectedProcessingTime)}s`
            );
        });
        this.on("processVideo", e => {
            console.log(
                `Video Processing Progress: ${toFixed(e.ratio * 100)}%`
                + `\n- Current Processing Time: ${toFixed(e.currentProcessingTime)}s, Expected Processing Time: ${toFixed(e.expectedProcessingTime)}s`
            );
        });
    }
    public setRenderCapturing(
        imageType: "png" | "jpeg",
        workers: ChildWorker[],
        isCache?: boolean,
        cacheFolder?: string,
    ) {
        if (isCache) {
            this.setCapturing(imageType, async e => {
                return `./${cacheFolder}/frame${e.frame}.${imageType}`;
            });
        } else {
            this.setCapturing(imageType, async e => {
                const fileName = await workers[e.workerIndex].record({
                    frame: e.frame,
                });

                return fileName;
            });
        }
    }
}
