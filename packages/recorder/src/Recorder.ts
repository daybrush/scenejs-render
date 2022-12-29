import Scene, { Animator, AnimatorOptions } from "scenejs";
import { MediaSceneInfo } from "@scenejs/media";
import { FileType, OnProgress, OnRecord, OnProcess, RecordInfoOptions, RenderVideoOptions, RenderMediaInfoOptions, RecorderOptions } from "./types";
import { createFFmpeg, fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";
import EventEmitter from "@scena/event-emitter";
import { createTimer, hasProtocol, isAnimator, resolvePath } from "./utils";


export const DEFAULT_CODECS = {
    mp4: "libx264",
    webm: "libvpx-vp9",
};

export class Recorder extends EventEmitter<{
    progress: OnProgress;
    videoProcess: OnProcess;
    audioProcess: OnProcess;
}> {
    private _animator!: Animator;
    private _imageType!: "jpeg" | "png";
    private _ffmpeg!: FFmpeg;
    private _ready!: Promise<void>;
    private _mediaInfo!: MediaSceneInfo;
    private _hasMedia!: boolean;
    private _fetchFile: (data: string | Buffer | Blob | File) => Promise<Uint8Array> = fetchFile;

    private _recording!: (e: OnRecord) => Promise<FileType> | FileType;
    constructor(private _options: RecorderOptions) {
        super();
    }
    public setFetchFile(fetchFile: (data: string | Buffer | Blob | File) => Promise<Uint8Array>) {
        this._fetchFile = fetchFile;
    }
    public setRecording(
        imageType: "jpeg" | "png",
        recording: (e: OnRecord) => Promise<FileType> | FileType,
    ) {
        this._imageType = imageType;
        this._recording = recording;
    }
    public setAnimator(animator: Animator | Partial<AnimatorOptions>) {
        this._animator
            = isAnimator(animator)
                ? animator
                : new Animator(animator);
    }
    public getAudioFile() {
        return this._ffmpeg.FS("readFile", "merge.mp3");
    }
    public async recordMedia(mediaInfo: MediaSceneInfo, options?: RenderMediaInfoOptions) {
        let length = 0;
        const medias = mediaInfo.medias;
        const duration = mediaInfo.duration;

        if (!duration || !medias) {
            return;
        }
        const ffmpeg = await this.init();

        await medias.reduce(async (pipe, media) => {
            await pipe;
            const url = media.url;
            const seek = media.seek;
            const delay = media.delay;
            const playSpeed = media.playSpeed;
            const volume = media.volume;

            const path = hasProtocol(url) ? url : resolvePath(options?.inputPath ?? "", url);
            const [startTime, endTime] = seek;
            const fileName = path.match(/[^/]+$/g)?.[0] ?? path;


            await this.writeFile(fileName, path);
            await ffmpeg.run(
                "-ss", `${startTime}`,
                "-to", `${endTime}`,
                "-i", fileName,
                "-filter:a", `adelay=${delay * playSpeed * 1000}|${delay * playSpeed * 1000},atempo=${playSpeed},volume=${volume}`,
                `audio${length++}.mp3`,
            );
        }, Promise.resolve());

        if (!length) {
            return;
        }

        const files = ffmpeg.FS("readdir", "./");
        const audios = files.filter(fileName => fileName.match(/audio[\d]+.mp3/));
        const audiosLength = audios.length;

        if (!audiosLength) {
            return;
        }
        const inputOption: string[] = [];
        const timer = createTimer();

        audios.forEach(fileName => {
            inputOption.push("-i", fileName);
        });
        ffmpeg.setProgress(e => {
            const ratio = e.ratio;
            const {
                currentTime,
                expectedTime,
            } = timer.getCurrentInfo(e.ratio);
            this.emit("audioProcess", {
                currentProcessingTime: currentTime,
                expectedProcessingTime: expectedTime,
                ratio,
            });
        });
        await ffmpeg.run(
            ...inputOption,
            "-filter_complex", `amix=inputs=${audiosLength}:duration=longest`,
            "merge.mp3",
        );

        if (ffmpeg.FS("readdir", "./").indexOf("merge.mp3") >= 0) {
            this._hasMedia = true;

            return this.getAudioFile();
        }
    }
    public async record(options: RenderVideoOptions & RecordInfoOptions) {
        const recordInfo = this.getRecordInfo(options);

        const rootStartFrame = recordInfo.startFrame;
        const imageType = this._imageType;
        const totalFrame = recordInfo.endFrame - rootStartFrame + 1;
        const fps = options.fps;
        let frameCount = 0;
        await this.init();

        const timer = createTimer();
        await Promise.all(recordInfo.loops.map((loop, workerIndex) => {
            let pipe = Promise.resolve();
            const startFrame = loop.startFrame;
            const endFrame = loop.endFrame;

            for (let i = startFrame; i <= endFrame; ++i) {
                const callback = ((currentFrame: number) => {
                    return async () => {
                        const data = await this._recording({
                            workerIndex,
                            frame: currentFrame,
                            time: currentFrame * fps,
                        });

                        await this.writeFile(`frame${currentFrame - rootStartFrame}.${imageType}`, data);
                        ++frameCount;

                        const {
                            currentTime: currentRecordingTime,
                            expectedTime: expectedRecordingTime,
                        } = timer.getCurrentInfo(frameCount / totalFrame);
                        this.emit("progress", {
                            frameCount,
                            totalFrame,
                            frameInfo: {
                                frame: currentFrame,
                                time: currentFrame * fps,
                            },
                            currentRecordingTime,
                            expectedRecordingTime,
                        });
                    };
                })(i);
                pipe = pipe.then(callback);
            }
            return pipe;
        }));
        return await this.renderVideo({
            ...options,
            duration: recordInfo.duation,
        });
    }

    public getRecordInfo(options: RecordInfoOptions) {
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
            duation: (endTime - startTime) / playSpeed,
            loops,
            iterationCount,
            startTime,
            endTime,
            startFrame,
            endFrame,
        }
    }
    public async init() {
        this._ffmpeg = this._ffmpeg || createFFmpeg({ log: this._options.log });

        const ffmpeg = this._ffmpeg;


        if (!this._ready) {
            this._ready = ffmpeg.load();
        }

        await this._ready;
        return ffmpeg;
    }
    public async writeFile(fileName: string, file: string | Buffer | File | Blob) {
        await this.init();

        this._ffmpeg.FS("writeFile", fileName, await this._fetchFile(file));
    }
    public async renderVideo(options: RenderVideoOptions) {
        const {
            ext = "mp4",
            fps = 60,
            codec,
            duration,
            bitrate,
            cpuUsed,
        } = options;

        const hasMedia = this._hasMedia;
        const parsedCodec = codec || DEFAULT_CODECS[ext || "mp4"] || DEFAULT_CODECS.mp4;
        const inputOption = [
            "-i", `frame%d.${this._imageType}`,
        ];
        const audioOutputOpion: string[] = [];
        const outputOption = [
            `-cpu-used`, `${cpuUsed || 8}`,
            "-pix_fmt", "yuva420p",
        ];


        if (ext === "webm") {
            outputOption.push(
                "-row-mt", "1",
            );
        }
        if (hasMedia) {
            inputOption.push(
                "-i", "merge.mp3",
            );
            audioOutputOpion.push(
                "-acodec", "aac",
                // audio bitrate
                '-b:a', "128k",
                // audio channels
                "-ac", "2",
            );
        }

        const ffmpeg = await this.init();


        const timer = createTimer();
        ffmpeg.setProgress(e => {
            const ratio = e.ratio;
            const {
                currentTime,
                expectedTime,
            } = timer.getCurrentInfo(e.ratio);
            this.emit("videoProcess", {
                currentProcessingTime: currentTime,
                expectedProcessingTime: expectedTime,
                ratio,
            });
        });

        await ffmpeg!.run(
            `-r`, `${fps}`,
            ...inputOption,
            ...audioOutputOpion,
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
        this.off();
        try {
            this._ffmpeg?.exit();
        } catch (e) {

        }
        this._ffmpeg = null;
    }
}
