import { Page } from "puppeteer";
import { Animator, AnimatorState } from "scenejs";

export type RendererStatus = "idle" | "start" | "finish" | "capturing" | "processing" | "error";
export interface RenderOptions {
    name?: string;
    media?: string;
    port?: string | number;
    fps?: number;
    width?: number;
    height?: number;
    output?: string;
    startTime?: number;
    cache?: number | undefined | "";
    cacheFolder?: string;
    scale?: number;
    multi?: number;
    input?: string;
    duration?: number | undefined | "";
    iteration?: number | undefined | "";
    bitrate?: string;
    codec?: string;
    referer?: string;
    ffmpegPath?: string;
    imageType?: "png" | "jpeg";
    alpha?: number | undefined | "";
}
export interface CaptureCommonOptions {
    /**
     * Whether only MediaScene exists
     */
    hasOnlyMedia: boolean;
    /**
     * scene's name in window
     */
    name: string;
    /**
     * scene's start delay
     */
    delay: number;
    /**
     * fps to capture screen
     */
    fps: number;
    /**
     * scene's media name in window
     */
    media: string;
    /**
     * Whether MediaScene exists
     */
    hasMedia: boolean;
    /**
     * scene's play spedd
     */
    playSpeed: number;
    /**
     * Skip frame number to capture
     */
    skipFrame: number;
    /**
     * Start frame number to capture
     */
    startFrame: number;
    /**
     * End frame number to capture
     */
    endFrame: number;
    /**
     * the time the scene ends
     */
    endTime: number;
    /**
     * Total number of frames to capture
     */
    totalFrame: number;
    /**
     * Image type for recording
     * alpha can be used.
     * @default "png"
     */
    imageType: "png" | "jpeg";
    /**
     * Image type for recording
     * @default "png"
     */
    alpha: boolean;
    /**
     * cache folder name
     * @default ".scene_cache"
     */
    cacheFolder: string;
}

export interface CaptureSceneOptions {
    media: string;
    name: string;
    fps: number;
    width: number;
    height: number;
    startTime: number | undefined | "";
    duration: number | undefined | "";
    iteration: number | undefined | "";
    cache?: number | undefined | "";
    scale: number,
    multi: number,
    referer: string;
    cacheFolder: string;
    isVideo?: boolean;
    /**
     * file path
     */
    path: string;
    /**
     * Image type for recording
     * @default "png"
     */
    imageType: "png" | "jpeg";
    /**
     * Image type for recording
     * @default "png"
     */
    alpha: boolean;
}
export interface CaptureLoopOptions extends CaptureCommonOptions {
    /**
     * puppeteer's opend page
     */
    page: Page;
}

export interface OpenPageOptions {
    /**
     * file path
     */
    path: string;
    /**
     * page width
     */
    width: number;
    /**
     * page height
     */
    height: number;
    /**
     * page scale
     */
    scale: number;
    /**
     * browser's referer
     */
    referer: string;
}

export interface RenderingInfoOptions {
    iteration: AnimatorState["iteration"];
    iterationCount: AnimatorState["iterationCount"];
    delay: AnimatorState["delay"];
    playSpeed: AnimatorState["playSpeed"];
    duration: AnimatorState["duration"];

    parentDuration: number;
    parentStartTime: number;
    parentFPS: number;

    multi: number;
}
export interface SubCaptureOptions extends OpenPageOptions, CaptureCommonOptions {

}


export interface OnCaptureStart {
    type: "captureStart";
    isCache: boolean;
    duration: number;
}


export interface OnCapture {
    type: "capture";
    frame: number,
    frameCount?: number;
    totalFrame: number;
}

export interface OnProcess {
    type: "process";
    processing: number;
}
