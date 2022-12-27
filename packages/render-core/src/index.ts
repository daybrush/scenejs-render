import { createFFmpeg, fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";

// [
//     '-r',
//     60,
//     '-loop',
//     '1',
//     '-i',
//     './.scene_ch/frame%d.png',
//     '-y',
//     '-b:v',
//     '4096k',
//     '-vcodec',
//     'libx264',
//     '-filter:v',
//     'scale=w=1920:h=1080',
//     '-t',
//     2,
//     '-cpu-used',
//     '1',
//     '-pix_fmt',
//     'yuva420p',
//     '-f',
//     [ 'mp4' ],
//     'output.mp4'
//   ]


export const DEFAULT_CODECS = {
    mp4: "libx264",
    webm: "libvpx-vp9",
};

export interface RenderVideoOptions {
    duration: number;
    inputs: string[];
    multi?: boolean;
    hasMedia?: boolean;
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
}

export class Renderer {
    private _ffmpeg!: FFmpeg;
    private _ready!: Promise<void>;
    public async init() {
        this._ffmpeg = this._ffmpeg || createFFmpeg({ log: true });

        const ffmpeg = this._ffmpeg;


        if (!this._ready) {
            this._ready = ffmpeg.load();
        }

        await this._ready;
        return ffmpeg;
    }
    public async writeImage(fileName: string, file: string | Buffer | File | Blob) {
        await this.init();

        this._ffmpeg.FS("writeFile", fileName, await fetchFile(file));
    }
    public async renderVideo(options: RenderVideoOptions) {
        const {
            ext = "mp4",
            fps = 60,
            codec,
            duration,
            hasMedia,
            inputs,
            bitrate,
        } = options;

        const parsedCodec = codec || DEFAULT_CODECS[ext || "mp4"] || DEFAULT_CODECS.mp4;
        const outputOption = [
            `-cpu-used`, "1",
            "-pix_fmt", "yuva420p",
        ];

        if (hasMedia) {
            outputOption.push(
                "-acodec", "aac",
                // audio bitrate
                '-b:a', "128k",
                // audio channels
                "-ac", "2",
            );
        }

        const ffmpeg = await this.init();
        const totalFrame = duration * fps;
        console.log(`Processing start (ext: ${ext}, codec: ${parsedCodec}, totalframe: ${totalFrame + 1}, duration: ${duration}, fps: ${fps}, media: ${hasMedia})`);

        // size ${width}x${height}
        //  'scale=w=1920:h=1080',
        // -f mp4
        const inputOption = inputs.map(fileName => ["-i", fileName]).flat();
        await ffmpeg!.run(
            `-r`, `${fps}`,
            ...inputOption,
            `-c:v`, parsedCodec,
            `-loop`, `1`,
            `-t`, `${duration}`,
            "-y",
            `-b:v`, bitrate || "4096k",
            ...outputOption,
            `output.${ext}`,
        );

        return ffmpeg!.FS('readFile', `output.${ext}`);
    }
    public destroy() {
        try {
            this._ffmpeg?.exit();
        } catch (e) {

        }
        this._ffmpeg = null;
    }
}
