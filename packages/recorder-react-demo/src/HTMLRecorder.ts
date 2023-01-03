import Recorder, { RecorderOptions } from "@scenejs/recorder";
import { toBlob } from "html-to-image";
// import domtoimage from "dom-to-image-more";
import { Animator } from "scenejs";


export class HTMLRecorder extends Recorder {
    protected _el!: HTMLElement;
    constructor(options: RecorderOptions = {}) {
        super(options);

        this.setCapturing("png", e => {
            this._animator.setTime(e.time, true);
            return toBlob(this._el, {
                pixelRatio: 2,
                // bgcolor: "#fff",
                backgroundColor: "#fff",
                skipFonts: true,
                style: {
                    position: "relative",
                    left: "0px",
                    top: "0px",
                    right: "auto",
                    bottom: "auto",
                    margin: "0",
                },
                filter(node: HTMLElement) {
                    // console.log(node);
                    return true;
                }
            });
        });
    }
    public setElement(el: HTMLElement) {
        this._el = el;
    }
    public async recordElement(animator: Animator, el: HTMLElement) {
        try {
            this.setAnimator(animator);
            this.setElement(el);

            const data = await this.record();
            const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

            return url;
        } catch (e) {
            console.error(e);
        }
        return "";
    }
}
