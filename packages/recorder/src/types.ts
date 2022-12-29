export type FileType = string | Buffer | File | Blob;

export interface RenderMediaInfoOptions {
    inputPath?: string;
}

export interface RecorderOptions {
    /**
     * Whether to show ffmpeg's log
     */
    log?: boolean;
}
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

export interface OnRecord {
    /**
     * recording frame
     */
    frame: number;
    /**
     * recording time
     */
    time: number;
    /**
     * worker index
     */
    workerIndex: number;
}

export interface OnProgress {
    frameCount: number;
    totalFrame: number;
    currentRecordingTime: number;
    expectedRecordingTime: number;
    frameInfo: { frame: number; time: number; };
}

export interface OnProcess {
    currentProcessingTime: number;
    expectedProcessingTime: number;
    ratio: number;
}
