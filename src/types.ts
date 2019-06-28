
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
}
