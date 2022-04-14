import { Page } from "puppeteer";

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
    scale?: number;
    multi?: number;
    input?: string;
    duration?: number | undefined | "";
    iteration?: number | undefined | "";
    bitrate?: string;
    codec?: string;
    referer?: string;
    ffmpegPath?: string;
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

export interface SubCaptureOptions extends OpenPageOptions, CaptureCommonOptions {

}
