import { IterationCountType } from "scenejs";

/**
 * @typedef
 */
export interface RenderOptions {
    fps?: number;
    output?: string;
    startTime?: number;
    cache?: number | undefined | "";
    cacheFolder?: string;
    multi?: number;
    input?: string;
    duration?: number | undefined | "";
    iteration?: number | undefined | "";
    bitrate?: string;
    codec?: string;
    /**
     * Image type to record video (png or jpeg)
     * If png is selected, webm and alpha are available.
     * @default "png"
     */
    imageType?: "png" | "jpeg";
    /**
     * If you use the png image type, you can create a video with a transparent background. (The video extension must be webm.)
     * @default false
     */
    alpha?: boolean | number | undefined | "";
    /**
     * Number of cpus to use for ffmpeg video or audio processing
     * @default 8
     */
    cpuUsed?: number;
    /**
     * page width
     */
    width?: number;
    /**
     * page height
     */
    height?: number;
    /**
     * scene's name in window
     */
    name?: string;
    /**
     * scene's media name in window
     */
    media?: string;
    /**
     * file path or url
     */
    path?: string;
    /**
     * page scale
     */
    scale?: number;
    /**
     * browser's referer
     */
    referer?: string;
    /**
     * Whether to show ffmpeg's logs
     * @default false
     */
    ffmpegLog?: boolean;
}


export type ChildMessage = {
    type: "startChild";
    data: ChildOptions;
} | {
    type: "record";
    data: RecordOptions;
}

export interface RecordOptions {
    frame: number;
}

export interface OpenPageOptions {
    /**
     * page width
     */
    width: number;
    /**
     * page height
     */
    height: number;
    /**
     * scene's name in window
     */
    name: string;
    /**
     * scene's media name in window
     */
    media: string;
    /**
     * file path or url
     */
    path: string;
    /**
     * page scale
     */
    scale: number;
    /**
     * browser's referer
     */
    referer: string;
}

export interface ChildOptions extends OpenPageOptions {
    /**
     * whether to apply alpha
     * @default true
     */
    alpha: boolean;
    /**
     * Image type for recording
     * alpha can be used.
     * @default "png"
     */
    imageType: "png" | "jpeg";
    /**
     * Whether only MediaScene exists
     */
    hasOnlyMedia: boolean;
    /**
     * scene's start delay
     */
    delay: number;
    /**
     * Whether MediaScene exists
     */
    hasMedia: boolean;
    /**
     * cache folder name
     * @default ".scene_cache"
     */
    cacheFolder: string;
    /**
     * scene's play spedd
     */
    playSpeed: number;
    /**
     * fps to capture screen
     */
    fps: number;
    /**
     * the time the scene ends
     */
    endTime: number;
    /**
     * Skip frame number to capture
     */
    skipFrame: number;
}

export interface SeekOptions {
    inputStartTime?: number | "";
    inputDuration?: number | "";
    inputIteration?: number | "";
    delay: number;
    duration: number;
    iterationCount: IterationCountType;
}


export interface ChildWorker {
    workerIndex: number;
    disconnect(): Promise<void>;
    start(options: ChildOptions): Promise<void>;
    record(options: RecordOptions): Promise<string | Buffer>;
}
