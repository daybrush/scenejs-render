import Scene, { Animator, AnimatorOptions } from "scenejs";
import { MediaSceneInfo } from "@scenejs/media";
import { FileType, OnCapture, OnRequestCapture, OnProcess, RecordInfoOptions, RenderVideoOptions, RenderMediaInfoOptions, RecorderOptions, OnCaptureStart, OnProcessAudioStart, AnimatorLike } from "./types";
import { createFFmpeg, fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";
import EventEmitter from "@scena/event-emitter";
import { createTimer, hasProtocol, isAnimatorLike, resolvePath } from "./utils";


export const DEFAULT_CODECS = {
    mp4: "libx264",
    webm: "libvpx-vp9",
};

/**
 * A recorder that captures the screen and creates a video or audio file
 * @example
import Recorder, { OnRequestCapture } from "@scenjs/recorder";
import Scene from "scenejs";

const scene = new Scene();
const recorder = new Recorder();

recorder.setAnimator(scene);
recorder.setCapturing("png", (e: OnRequestCapture) => {
    scene.setTime(e.time, true);
    // html to image
    return htmlToImage(element);
});

recorder.record().then(data => {
  const url = URL.createObjectURL(new Blob(
    [data.buffer],
    { type: 'video/mp4' },
  ));

  video.setAttribute("src", url);
  recorder.destroy();
});
 */
export class Recorder extends EventEmitter<{
    captureStart: OnCaptureStart;
    capture: OnCapture;
    captureEnd: {};
    processVideoStart: Required<RenderVideoOptions>;
    processVideo: OnProcess;
    processVideoEnd: {};
    processAudioStart: OnProcessAudioStart;
    processAudio: OnProcess;
    processAudioEnd: {};
}> {
    protected _animator!: AnimatorLike;
    protected _imageType!: "jpeg" | "png";
    protected _ffmpeg!: FFmpeg;
    protected _ready!: Promise<void>;
    protected _hasMedia!: boolean;
    protected _fetchFile: (data: FileType) => Promise<Uint8Array | null> = fetchFile;
    protected _capturing!: (e: OnRequestCapture) => Promise<FileType> | FileType;
    public recordState: "initial" | "loading" | "capture" | "process" = "initial";

    /**
     *
     */
    constructor(protected _options: RecorderOptions = {}) {
        super();
    }
    /**
     * Set up a function to import files. Defaults to fetchData from `@ffmpeg/ffmpeg`
     * @sort 1
     */
    public setFetchFile(fetchFile: (data: FileType) => Promise<Uint8Array | null>) {
        this._fetchFile = fetchFile;
    }
    /**
     * Set the function to get the image to be captured per frame.
     * @sort 1
     * @param - image extension of the file
     * @param - A function that returns the image to be captured per frame.
     */
    public setCapturing(
        imageType: "jpeg" | "png",
        capturing: (e: OnRequestCapture) => Promise<FileType> | FileType,
    ) {
        this._imageType = imageType;
        this._capturing = capturing;
    }
    /**
     * Set the animator to record.
     * @sort 1
     */
    public setAnimator(animator: AnimatorLike | Partial<AnimatorOptions>) {
        this._animator
            = isAnimatorLike(animator)
                ? animator
                : new Animator(animator);
    }
    /**
     * Get the result of audio processing.
     * @sort 1
     */
    public getAudioFile(): Uint8Array {
        return this._ffmpeg.FS("readFile", "merge.mp3");
    }
    /**
     * Start audio processing.
     * @sort 1
     * @param mediaInfo - media info
     * @param options - media info options
     * @returns {$ts:Promise<Uint8Array>}
     */
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

        /**
         * The event is fired when audio process starts.
         * @memberof Recorder
         * @event processAudioStart
         * @param {Recorder.OnProcessAudioStart} - Parameters for the `processAudioStart` event
         */
        this.emit("processAudioStart", {
            audiosLength,
        });
        audios.forEach(fileName => {
            inputOption.push("-i", fileName);
        });
        ffmpeg.setProgress(e => {
            const ratio = e.ratio;
            const {
                currentTime,
                expectedTime,
            } = timer.getCurrentInfo(e.ratio);
            /**
             * The event is fired when audio processing is in progress.
             * @memberof Recorder
             * @event processAudio
             * @param {Recorder.OnProcess} - Parameters for the `processAudio` event
             */
            this.emit("processAudio", {
                currentProcessingTime: currentTime,
                expectedProcessingTime: expectedTime,
                ratio,
            });
        });
        await ffmpeg.run(
            ...inputOption,
            "-filter_complex", `amix=inputs=${audiosLength}:duration=longest:dropout_transition=1000,volume=${audiosLength}`,
            "merge.mp3",
        );
        /**
         * The event is fired when audio process ends.
         * @memberof Recorder
         * @event processAudioEnd
         */
        this.emit("processAudioEnd");
        if (ffmpeg.FS("readdir", "./").indexOf("merge.mp3") >= 0) {
            this._hasMedia = true;

            return this.getAudioFile();
        }
    }
    /**
     * Start capturing and video processing.
     * @sort 1
     * @param options - record options
     * @returns {$ts:Promise<Uint8Array>}
     */
    public async record(options: RenderVideoOptions & RecordInfoOptions = {}) {

        const recordInfo = this.getRecordInfo(options);

        const rootStartFrame = recordInfo.startFrame;
        const rootEndFrame = recordInfo.endFrame;
        const imageType = this._imageType;
        const totalFrame = rootEndFrame - rootStartFrame + 1;
        const fps = options.fps || 60;
        let frameCount = 0;

        this.recordState = "loading";
        await this.init();

        const timer = createTimer();
        /**
         * The event is fired when capture starts.
         * @memberof Recorder
         * @event captureStart
         * @param {Recorder.OnCaptureStart} - Parameters for the `captureStart` event
         */
        this.emit("captureStart", {
            startFame: rootStartFrame,
            endFrame: rootEndFrame,
            startTime: recordInfo.startTime,
            endTime: recordInfo.endTime,
            duration: recordInfo.duation,
            multi: options.multi || 1,
            imageType,
            fps,
        });

        this.recordState = "capture";
        await Promise.all(recordInfo.loops.map((loop, workerIndex) => {
            let pipe = Promise.resolve();
            const startFrame = loop.startFrame;
            const endFrame = loop.endFrame;

            for (let i = startFrame; i <= endFrame; ++i) {
                const callback = ((currentFrame: number) => {
                    return async () => {
                        const time = currentFrame / fps;
                        const data = await this._capturing({
                            workerIndex,
                            frame: currentFrame,
                            time,
                        });

                        await this.writeFile(`frame${currentFrame - rootStartFrame}.${imageType}`, data);
                        ++frameCount;

                        const ratio = frameCount / totalFrame;
                        const {
                            currentTime: currentCapturingTime,
                            expectedTime: expectedCapturingTime,
                        } = timer.getCurrentInfo(ratio);
                        /**
                         * The event is fired when frame capturing is in progress.
                         * @memberof Recorder
                         * @event capture
                         * @param {Recorder.OnCapture} - Parameters for the `capture` event
                         */
                        this.emit("capture", {
                            ratio,
                            frameCount,
                            totalFrame,
                            frameInfo: {
                                frame: currentFrame,
                                time,
                            },
                            currentCapturingTime,
                            expectedCapturingTime,
                        });
                    };
                })(i);
                pipe = pipe.then(callback);
            }
            return pipe;
        }));

        /**
         * The event is fired when capture ends.
         * @memberof Recorder
         * @event captureEnd
         */
        this.emit("captureEnd");
        return await this.renderVideo({
            ...options,
            duration: recordInfo.duation,
        });
    }
    /**
     * Get the information to be recorded through options.
     * @sort 1
     */
    public getRecordInfo(options: RecordInfoOptions = {}) {
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

        const data = await this._fetchFile(file);

        if (!data) {
            return;
        }
        this._ffmpeg.FS("writeFile", fileName, data);
    }
    public async renderVideo(options: RenderVideoOptions) {
        const {
            ext = "mp4",
            fps = 60,
            codec,
            duration,
            bitrate: bitrateOption,
            cpuUsed,
        } = options;

        const hasMedia = this._hasMedia;
        const parsedCodec = codec || DEFAULT_CODECS[ext || "mp4"] || DEFAULT_CODECS.mp4;
        const bitrate = bitrateOption || "4096k";
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


        this.recordState = "process";
        const timer = createTimer();
        /**
         * The event is fired when process video starts.
         * @memberof Recorder
         * @event processVideoStart
         * @param {Recorder.OnProcessVideoStart} - Parameters for the `processVideoStart` event
         */
        this.emit("processVideoStart", {
            ext,
            fps,
            codec: parsedCodec,
            duration,
            bitrate,
            cpuUsed,
        });
        ffmpeg.setProgress(e => {
            const ratio = e.ratio;
            const {
                currentTime,
                expectedTime,
            } = timer.getCurrentInfo(e.ratio);
            /**
             * The event is fired when frame video processing is in progress.
             * @memberof Recorder
             * @event processVideo
             * @param {Recorder.OnProcess} - Parameters for the `processVideo` event
             */
            this.emit("processVideo", {
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
            `-b:v`, bitrate,
            ...outputOption,
            `output.${ext}`,
        );
        /**
         * The event is fired when process video ends
         * @memberof Recorder
         * @event processVideoEnd
         */
        this.emit("processVideoEnd");
        this.recordState = "initial";
        return ffmpeg!.FS('readFile', `output.${ext}`);
    }
    /**
     * Quit ffmpeg.
     * @sort 1
     */
    public exit() {
        try {
            this.recordState = "initial";
            this._ready = null;
            this._ffmpeg?.exit();
        } catch (e) {

        }
        this._ffmpeg = null;
    }
    /**
     * Remove the recorder and ffmpeg instance.
     * @sort 1
     */
    public destroy() {
        this.off();
        this.exit();
    }
}
