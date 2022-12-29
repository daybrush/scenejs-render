import Recorder, { RecorderOptions } from "@scenejs/recorder";
import { ChildWorker } from "./types";


export class RenderRecorder extends Recorder {
    constructor(options?: RecorderOptions) {
        super(options);

        this.on("progress", e => {
            console.log(
                `Capture Progress: ${e.frameCount / e.totalFrame * 100}% (${e.frameCount} / ${e.totalFrame})`
                + `\n- Recorded Frame: ${e.frameInfo.frame}, Time: ${e.frameInfo.time}`
                + `\n- current recording time: ${e.currentRecordingTime / 1000}s, expected recording time: ${e.expectedRecordingTime / 1000}s`
            );
        });
        this.on("audioProcess", e => {
            console.log(
                `Audio Processing Progress: ${e.ratio * 100}%`
                + `\n- Current processing time: ${e.currentProcessingTime / 1000}s, expected processing time: ${e.expectedProcessingTime / 1000}s`
            );
        });
        this.on("videoProcess", e => {
            console.log(
                `Video Processing Progress: ${e.ratio * 100}%`
                + `\n- Current processing time: ${e.currentProcessingTime / 1000}s, expected processing time: ${e.expectedProcessingTime / 1000}s`
            );
        });
    }
    public setRenderRecording(
        imageType: "png" | "jpeg",
        workers: ChildWorker[],
        isCache?: boolean,
        cacheFolder?: string,
    ) {
        if (isCache) {
            this.setRecording(imageType, async e => {
                return `./${cacheFolder}/frame${e.frame}.${imageType}`;
            });
        } else {
            this.setRecording(imageType, async e => {
                const fileName = await workers[e.workerIndex].record({
                    frame: e.frame,
                });

                return fileName;
            });
        }
    }
}
