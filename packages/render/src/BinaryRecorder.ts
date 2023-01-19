import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";
import * as fs from "fs";
import * as path from "path";
import { RecorderOptions, RecordInfoOptions, RenderVideoOptions } from "@scenejs/recorder";
import { FFmpeg, FSMethodArgs, FSMethodNames, LogCallback, ProgressCallback } from "@ffmpeg/ffmpeg";
import { RenderRecorder } from "./RenderRecorder";

// Binary
// [
//     '-i',
//     '.scene_ch/frame%d.png',
//     '-y',
//     '-r',
//     '60',
//     '-c:v',
//     'libx264',
//     '-loop',
//     '1',
//     '-t',
//     '2',
//     '-y',
//     '-b:v',
//     '4096k',
//     '-cpu-used',
//     '8',
//     '-pix_fmt',
//     'yuva420p',
//     '.scene_ch/output.mp4'
//   ]
// Audio
// "-ss", `${startTime}`,
// "-to", `${endTime}`,
// "-i", fileName,
// "-filter:a", `adelay=${delay * playSpeed * 1000}|${delay * playSpeed * 1000},atempo=${playSpeed},volume=${volume}`,
// `audio${length++}.mp3`,

// "-filter_complex", `amix=inputs=${audiosLength}:duration=longest:dropout_transition=1000,volume=${audiosLength}`,

// audioOutputOpion.push(
//     "-acodec", "aac",
//     // audio bitrate
//     '-b:a', "128k",
//     // audio channels
//     "-ac", "2",
// );

interface BinaryRecorderOptions extends RecorderOptions {
    ffmpegPath: string;
    cacheFolder: string;
}

function initBinaryFFMpeg(ffmpegPath: string, cacheFolder: string, totalCountRef: { current: number }): FFmpeg {

    let fluentFfmpeg: FfmpegCommand | null = null;
    function initFfmpeg() {
        if (!fluentFfmpeg) {
            fluentFfmpeg = ffmpeg();
            fluentFfmpeg.setFfmpegPath(ffmpegPath);
        }
    }
    initFfmpeg();
    return {
        setProgress(progress: ProgressCallback): void {
            initFfmpeg();
            fluentFfmpeg.on("progress", e => {
                if ("percent" in e ) {
                    progress({ ratio: e.percent / 100 });
                } else {
                    const totalCount = totalCountRef.current;

                    progress({ ratio: (e.frames + 1) / totalCount });
                }
            });
        },
        run(...args: string[]): Promise<void> {
            const nextArgs = [...args];
            const length = nextArgs.length;

            const target = path.resolve(cacheFolder, nextArgs.splice(length - 1, 1)[0]);

            initFfmpeg();
            const mediaInputs: string[] = [];
            let hasMedia = false;
            let hasVideo = false;

            nextArgs.forEach((arg, i) => {
                const value = nextArgs[i + 1];
                if (arg === "-i") {
                    if (path.extname(value) === ".mp3") {
                        hasMedia = true;
                        mediaInputs.push(path.resolve(cacheFolder, value));
                    } else {
                        hasVideo = true;
                        fluentFfmpeg.addInput(path.resolve(cacheFolder, value));
                    }
                }
            });

            let fps = 60;
            let duration = 0;
            let videoBitrate = "4096k";
            let videoCodec = "libx264";
            let pixFmt = "yuva420p";
            let cpuUsed = 4;

            let audioCodec = "";
            let audioBitrate = "";
            let audioChannels = 0;
            let seekInput = 0;
            let to = 0;
            let audioFilter: string[] = [];
            let filterComplex = "";

            nextArgs.forEach((arg, i) => {
                const value = nextArgs[i + 1];

                if (arg === "-r") {
                    fps = parseFloat(value);
                } else if (arg === "-c:v") {
                    videoCodec = value;
                } else if (arg === "-t") {
                    duration = parseFloat(value);
                    fluentFfmpeg.loop(value);
                } else if (arg === "-b:v") {
                    videoBitrate = value;
                } else if (arg === "-pix_fmt") {
                    pixFmt = value;
                } else if (arg === "-cpu-used") {
                    cpuUsed = parseFloat(value);
                } else if (arg === "-acodec") {
                    audioCodec = value;
                } else if (arg === "-b:a") {
                    audioBitrate = value;
                } else if (arg === "-ac") {
                    audioChannels = parseFloat(value);
                } else if (arg === "-ss") {
                    seekInput = parseFloat(value);
                } else if (arg === "-to") {
                    to = parseFloat(value);
                } else if (arg === "-filter:a") {
                    audioFilter = value.split(",");
                } else if (arg === "-filter_complex") {
                    filterComplex = value;
                }
            });

            if (hasVideo) {
                fluentFfmpeg
                    .inputFPS(fps)
                    .loop(duration)
                    .videoBitrate(videoBitrate)
                    .videoCodec(videoCodec)
                    .outputOption([
                        "-pix_fmt", pixFmt,
                        "-cpu-used", `${cpuUsed}`,
                    ]);
            }
            if (hasMedia) {
                mediaInputs.forEach(input => {
                    fluentFfmpeg.addInput(input);
                });
                if (seekInput) {
                    fluentFfmpeg.seekInput(seekInput);
                }
                if (to) {
                    fluentFfmpeg.inputOption(["-to", `${to}`]);
                }
                if (audioFilter.length) {
                    fluentFfmpeg.audioFilter(audioFilter);
                }
                if (filterComplex) {
                    fluentFfmpeg.inputOptions([
                        "-filter_complex", filterComplex,
                    ]);
                }
                if (audioCodec) {
                    fluentFfmpeg.audioCodec(audioCodec);
                }
                if (audioBitrate) {
                    fluentFfmpeg.audioBitrate(audioBitrate);
                }
                if (audioChannels) {
                    fluentFfmpeg.audioChannels(audioChannels);
                }
            }
            if (hasMedia || hasVideo) {
                fluentFfmpeg.save(target);
            } else {
                return Promise.resolve();
            }

            return new Promise(resolve => {
                fluentFfmpeg.on("end", () => {
                    fluentFfmpeg = null;
                    resolve();
                }).on("error", e => {
                    console.log(`Error: ${target}`, e.message);
                    fluentFfmpeg = null;
                    resolve();
                });
            });
        },
        FS<Method extends FSMethodNames>(method: Method, ...args: FSMethodArgs[Method]): any {
            if (method === "readFile") {
                return new Uint8Array(fs.readFileSync(path.resolve(cacheFolder, args[0])));
            } else if (method === "readdir") {
                return fs.readdirSync(path.resolve(cacheFolder, args[0]))
            } else if (method === "writeFile") {
                fs.writeFileSync(path.resolve(cacheFolder, args[0]), args[1]);
                return Promise.resolve();
            }
            return null as any;
        },
        setLogger(log: LogCallback){
            return;
        },
        setLogging(logging: boolean) {

        },
        exit() {
            fluentFfmpeg?.kill("0");
            fluentFfmpeg = null;
        },
        async load() {
            return;
        },
        isLoaded() {
            return true;
        },
    };
}
export class BinaryRecorder extends RenderRecorder {
    private _totalCountRef =  { current: 0 };
    constructor(protected options: BinaryRecorderOptions) {
        super(options);
    }
    public async init() {
        if (!this._ready) {
            const options = this.options;
            this._ffmpeg = initBinaryFFMpeg(options.ffmpegPath, options.cacheFolder, this._totalCountRef);
            this._ready = Promise.resolve();
        }
        return this._ffmpeg;
    }
    public async writeFile(fileName: string, file: string | Buffer | File | Blob): Promise<void> {
        await this.init();

        const data = await this._fetchFile(file);

        if (!data) {
            return;
        }

        fs.writeFileSync(path.resolve(this.options.cacheFolder, fileName), data);
    }
    public async record(options: RenderVideoOptions & RecordInfoOptions = {}) {
        this.once("captureStart", e => {
            this._totalCountRef.current = e.endFrame - e.startFame + 1;
        });
        return super.record(options);
    }
}
