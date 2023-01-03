import { IterationCountType } from "scenejs";

/**
 * @memberof Recorder
 * @typedef
 */
export type FileType = string | Buffer | File | Blob | null;

/**
 * @memberof Recorder
 * @typedef
 */
export interface RenderMediaInfoOptions {
    /**
     *
     */
    inputPath?: string;
}

/**
 * @memberof Recorder
 * @typedef
 */
export interface RecorderOptions {
    /**
     * Whether to show ffmpeg's log
     */
    log?: boolean;
}

/**
 * @memberof Recorder
 * @typedef
 */
export interface RenderVideoOptions {
    /**
     * custom scene's duration
     * @default scene's duration
     */
    duration?: number;
    /**
     * fps
     * @default 60
     */
    fps?: number;
    /**
     * Codec to encode video If you don't set it up, it's the default (mp4: libx264, webm: libvpx-vp9)
     * @default "libx264"
     */
    codec?: string;
    /**
     * Bitrate of video (the higher the bit rate, the clearer the video quality)
     * @default "4096k"
     */
    bitrate?: string;
    /**
     * file extension
     * @default "mp4"
     */
    ext?: "mp4" | "webm";
    /**
     * Number of cpus to use for ffmpeg video or audio processing
     * @default 8
     */
    cpuUsed?: number;
}

/**
 * @memberof Recorder
 * @typedef
 */
export interface RecordInfoOptions {
    /**
     * Input iterationCount of the Scene set by the user himself
     * @default 0
     */
    iteration?: number;
    /**
     * input how many seconds to play
     */
    duration?: number;
    /**
     * Input for start time
     * @default 0
     */
    startTime?: number;
    /**
     * @default 60
     */
    fps?: number;
    /**
     * @default 1
     */
    multi?: number;
}

/**
 * @memberof Recorder
 * @typedef
 */
export interface OnRequestCapture {
    /**
     * caputring frame
     */
    frame: number;
    /**
     * capturing time
     */
    time: number;
    /**
     * worker index
     */
    workerIndex: number;
}

/**
 * @memberof Recorder
 * @typedef
 */
export interface OnProcessAudioStart {
    /**
     * Number of audios included in mediaInfo
     */
    audiosLength: number;
}

/**
 * @memberof Recorder
 * @typedef
 */
export interface OnCaptureStart {
    /**
     * The starting frame of the animator to capture.
     */
    startFame: number;
    /**
     * The end frame of the animator to capture.
     */
    endFrame: number;
    /**
     * The starting time of the animator to capture.
     */
    startTime: number;
    /**
     * The end time of the animator to capture.
     */
    endTime: number;
    /**
     * Length of time of the animator to capture
     */
    duration: number;
    /**
     * The number of split captures.
     */
    multi: number;
    /**
     * fps
     */
    fps: number;
    /**
     * Image type (or extension) to capture
     */
    imageType: "png" | "jpeg";
}

/**
 * @memberof Recorder
 * @typedef
 */
export interface OnCapture {
    /**
     * Progress rate captured
     */
    ratio: number;
    /**
     * Number of frames captured
     */
    frameCount: number;
    /**
     * Total number of frames to capture
     */
    totalFrame: number;
    /**
     * Current capturing progress time
     */
    currentCapturingTime: number;
    /**
     * Expected time for all capturing.
     */
    expectedCapturingTime: number;
    /**
     * Frame Information Captured Now
     */
    frameInfo: { frame: number; time: number; };
}

/**
 * @memberof Recorder
 * @typedef
 */
export interface OnProcess {
    /**
     * Current progress percentage
     */
    ratio: number;
    /**
     * Current processing progress time
     */
    currentProcessingTime: number;
    /**
     * Expected time for all processing.
     */
    expectedProcessingTime: number;
}

export interface AnimatorLike {
    getIterationCount(): IterationCountType;
    getDelay(): number;
    getDuration(): number;
    getPlaySpeed(): number;
    setTime(time: number | string, isTick?: boolean): any;
}
