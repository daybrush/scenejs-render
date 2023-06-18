import Recorder, { RecorderOptions } from "@scenejs/recorder";
import { ChildWorker, RenderRecorderOptions } from "./types";

function toFixed(num: number) {
    return parseFloat(num.toFixed(3));
}

export class RenderRecorder extends Recorder {
    constructor(options: RenderRecorderOptions) {
        super(options);

        const logger = options.logger;

        this.on("processVideoStart", e => {
            logger.log(`Start Video Process (ext: ${e.ext}, fps: ${e.fps}, duration: ${e.duration})`);
        });
        this.on("processVideoEnd", () => {
            logger.log("End Video Process");
        });
        this.on("processAudioStart", e => {
            logger.log(`Start Audio Process (audiosLength: ${e.audiosLength})`);
        });
        this.on("processAudioEnd", () => {
            logger.log("End Audio Process");
        });
        this.on("captureStart", e => {
            logger.log(`Start Capture (startFame: ${e.startFame}, endFrame: ${e.endFrame}, startTime: ${e.startTime}, endTime: ${e.endTime}, fps: ${e.fps}, duration: ${e.duration}, imageType: ${e.imageType})`);
        });
        this.on("captureEnd", () => {
            logger.log("End Capture");
        });
        this.on("capture", e => {
            logger.log(
                `Capture Progress: ${toFixed(e.frameCount / e.totalFrame * 100)}% (${e.frameCount} / ${e.totalFrame})`
                + `\n- Captured Frame: ${e.frameInfo.frame}`
                + `\n- Current Capturing Time: ${toFixed(e.currentCapturingTime)}s, Expected Capturing Time: ${toFixed(e.expectedCapturingTime)}s`
            );
        });
        this.on("processAudio", e => {
            logger.log(
                `Audio Preocessing Progress: ${toFixed(e.ratio * 100)}%`
                + `\n- Current processing Time: ${toFixed(e.currentProcessingTime)}s, Expected Preocessing Time: ${toFixed(e.expectedProcessingTime)}s`
            );
        });
        this.on("processVideo", e => {
            logger.log(
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
