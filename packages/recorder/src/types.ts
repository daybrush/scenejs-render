export type FileType = string | Buffer | File | Blob;
export interface RenderVideoOptions {
    inputs: string[];
    hasMedia?: boolean;
    /**
     * custom scene's duration
     * @default scene's duration
     */
    duration?: number;
    /**
     * @default 60
     */
    fps?: number;
    /**
     * @default "libx264"
     */
    codec?: string;
    /**
     * @default "4096k"
     */
    bitrate?: string;
    /**
     * @default "mp4"
     */
    ext?: "mp4" | "webm";
    /**
     * @default 8
     */
    cpuUsed?: number;
}

export interface RecordInfoOptions {
    iteration?: number;
    /**
     *
     */
    duration?: number;
    /**
     *
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
