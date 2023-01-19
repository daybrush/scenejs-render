
/**
 * @typedef
 * @memberof Render
 */
export interface RenderOptions {
    /**
     * File URL to Rendering
     * @default "./index.html"
     */
    input?: string;
    /**
     * fps
     * @default 60
     */
    fps?: number;
    /**
     * Output file name
     * @default "output.mp4"
     */
    output?: string;
    /**
     * Input for start time
     * @default 0
     */
    startTime?: number;
    /**
     * Whether to use buffer instead of saving frame image file in capturing (cache is disabled.)
     * @default false
     */
    buffer?: boolean | number | undefined | "";
    /**
     * If there are frames in the cache folder, the capture process is passed.
     * @default false
     */
    cache?: boolean | number | undefined | "";
    /**
     * Cache folder name to save frame image
     * @default ".scene_cache"
     */
    cacheFolder?: string;
    /**
     * Number of browsers to be used for capturing
     * @default 1
     */
    multi?: number;
    /**
     * Input how many seconds to play
     * @default 0
     */
    duration?: number | undefined | "";
    /**
     * Input iterationCount of the Scene set by the user himself.
     * @default 0
     */
    iteration?: number | undefined | "";
    /**
     * Bitrate of video (the higher the bit rate, the clearer the video quality)
     * @default "4096k"
     */
    bitrate?: string;
    /**
     * Codec to encode video If you don't set it up, it's the default
     * @default "mp4: libx264, webm:libvpx-vp9"
     */
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
     * If you want to use native ffmpeg for faster speed, write the path of ffmpeg.
     */
    ffmpegPath?: string;
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
     * Whether to use buffer instead of saving frame image file in capturing (cache is disabled.)
     */
    buffer: boolean;
    /**
     * whether to apply alpha
     * @default false
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

export interface ChildWorker {
    workerIndex: number;
    disconnect(): Promise<void>;
    start(options: ChildOptions): Promise<void>;
    record(options: RecordOptions): Promise<string | Buffer>;
}
