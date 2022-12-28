import Scene, { Animator, OnAnimate, SceneItem } from "scenejs";
import { MediaSceneInfo } from "@scenejs/media";
import { FileType, RecordInfoOptions, RenderVideoOptions } from "./types";
import { createFFmpeg, fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";


export const DEFAULT_CODECS = {
    mp4: "libx264",
    webm: "libvpx-vp9",
};

export class Recorder {
    private _animator!: Animator;
    private _imageType!: "jpeg" | "png";
    private _ffmpeg!: FFmpeg;
    private _ready!: Promise<void>;

    private _recording!: (e: { frame: number }) => Promise<FileType> | FileType;
    constructor() {

    }
    public setRecording(
        imageType: "jpeg" | "png",
        recording: (e: { frame: number }) => Promise<FileType> | FileType,
    ) {
        this._imageType = imageType;
        this._recording = recording;
    }
    public setAnimator(animator: Animator) {
        this._animator = animator;
    }
    public setMediaInfo(mediaInfo: MediaSceneInfo) {

    }
    public async record(options: RenderVideoOptions & RecordInfoOptions) {
        const recordInfo = this._getRecordInfo(options);

        const startFrame = recordInfo.startFrame;
        const endFrame = recordInfo.endFrame;
        const imageType = this._imageType;

        let pipe!: Promise<void>;

        await this.init();
        for (let i = startFrame; i <= endFrame; ++i) {
            const callback = ((currentFrame: number) => {
                return async () => {
                    const data = await this._recording({
                        frame: currentFrame,
                    });

                    await this.writeFile(`frame${currentFrame - startFrame}.${imageType}`, data);
                };
            })(i);

            if (pipe) {
                pipe = pipe.then(callback);
            } else {
                pipe = callback();
            }
        }
        await pipe;
        return this.renderVideo(options);
    }

    protected _getRecordInfo(options: RecordInfoOptions) {
        const animator = this._animator;
        const inputIteration = options.iteration;
        const inputDuration = options.duration || 0;
        const inputStartTime = options.startTime || 0;
        const inputFPS = options.fps || 60;
        const inputMulti = options.multi || 1;
        const sceneIterationCount = inputIteration || animator.getIterationCount();
        const sceneDelay = animator.getDelay();
        const playSpeed = animator.getPlaySpeed();
        const duration = animator.getDuration();
        let iterationCount = 0;

        if (sceneIterationCount === "infinite") {
            iterationCount = inputIteration || 1;
        } else {
            iterationCount = inputIteration || sceneIterationCount;
        }
        const totalDuration = sceneDelay + duration * (iterationCount);
        const endTime = inputDuration > 0
            ? Math.min(inputStartTime + inputDuration, totalDuration)
            : totalDuration;
        const startTime = Math.min(inputStartTime, endTime);
        const startFrame = Math.floor(startTime * inputFPS / playSpeed);
        const endFrame = Math.ceil(endTime * inputFPS / playSpeed);
        const dist = Math.ceil((endFrame - startFrame) / (inputMulti || 1));
        const loops: Array<{
            startFrame: number;
            endFrame: number;
        }> = [];

        for (let i = 0; i < inputMulti; ++i) {
            loops.push({
                startFrame: startFrame + dist * i + (i === 0 ? 0 : 1),
                endFrame: startFrame + dist * (i + 1),
            });
        }

        return {
            loops,
            iterationCount,
            startTime,
            endTime,
            startFrame,
            endFrame,
        }
    }
    public async init() {
        this._ffmpeg = this._ffmpeg || createFFmpeg({ log: true });

        const ffmpeg = this._ffmpeg;


        if (!this._ready) {
            this._ready = ffmpeg.load();
        }

        await this._ready;
        return ffmpeg;
    }
    public async writeFile(fileName: string, file: string | Buffer | File | Blob) {
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
        const inputOption = [
            "-i", `frame%d.${this._imageType}`,
        ];
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
