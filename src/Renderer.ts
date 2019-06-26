import Component from "@egjs/component";
import { fork } from "child_process";
import { IObject } from "@daybrush/utils";
import { RendererStatus } from "./types";
import { IDLE, START, CAPTURING, PROCESSING, FINISH } from "./consts";

export default class Renderer extends Component {
    public startTime = 0;
    public endTime = 0;
    public captureFrames = 0;
    public progress = 0;
    public status: RendererStatus = IDLE;
    public process = null;
    public pathname = "";
    public isEnd = false;
    public start(options = {}) {
        this.startTime = Date.now();
        this.endTime = 0;
        this.captureFrames = 0;
        this.progress = 0;
        this.status = START;
        this.isEnd = false;
        this.trigger("start");

        this.process = fork(
            __dirname + "/index.js",
            Object.keys(options).map(key => `--${key}=${options[key]}`),
        );
        this.process.on("message", message => {
            if ("frame" in message) {
                // capturing 90%
                this.status = CAPTURING;
                ++this.captureFrames;
                this.progress = (this.captureFrames / message.totalFrame) * 90;

                this.trigger("render");
                this.trigger("capture", {
                    frame: message.frame,
                    frameCount: this.captureFrames,
                    totalFrame: message.totalFrame,
                });
            } else if ("processing" in message) {
                // processing 10%
                this.status = PROCESSING;
                this.progress = Math.min(100, 80 + (message.processing / 100 * 20));

                if (this.progress >= 100) {
                    this.isEnd = true;
                }
                this.trigger("render");
                this.trigger("process", {
                    processing: message.processing,
                });
            } else {
                // end
                this.finish();
            }
        });
        this.process.on("error", () => {
            console.log("ERR");
            this.cancel();
        });
        this.process.on("close", () => {
            console.log("CLOSE");
            this.finish();
        });
        this.process.on("exit", exitCode => {
            console.log("EXIT", exitCode);
            if (exitCode === 200) {
                this.cancel();
            } else {
                this.finish();
            }
        });
    }
    public finish() {
        if (!this.process) {
            return;
        }
        this.process = null;
        this.progress = 100;

        if (!this.isEnd) {
            this.trigger("render");
            this.trigger("process", {
                processing: 100,
            });
        }
        this.status = FINISH;
        this.endTime = Date.now();

        this.trigger("finish");
    }
    public cancel() {
        if (!this.process) {
            return;
        }

        this.trigger("cancel");
        this.process.kill();
        this.process = null;
        this.startTime = 0;
        this.endTime = 0;
        this.progress = 0;
        this.status = IDLE;
        this.captureFrames = 0;

    }
    public getProgressInfo() {
        let time = 0;
        const status = this.status;

        if (status === FINISH) {
            time = this.endTime - this.startTime;
        } else if (status !== START && status !== IDLE) {
            time =  Date.now() - this.startTime;
        }
        return {
            time,
            progress: this.progress,
            status,
        };
    }
    public trigger(name: string, param: IObject<any> = {}): boolean {
        const info = this.getProgressInfo();

        return super.trigger(name, {
            ...info,
            ...param,
        });
    }
}
