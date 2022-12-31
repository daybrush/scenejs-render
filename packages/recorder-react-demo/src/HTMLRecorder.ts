import Recorder, { RecorderOptions } from "@scenejs/recorder";
import { toBlob } from "html-to-image";


export class HTMLRecorder extends Recorder {
    protected _el!: HTMLElement;
    constructor(options: RecorderOptions = {}) {
        super(options);

        this.setCapturing("png", e => {
            this._animator.setTime(e.time, true);
            return toBlob(this._el, {
                pixelRatio: 4,
                backgroundColor: "#fff",
                style: {
                    position: "relative",
                    left: "0px",
                    top: "0px",
                    right: "auto",
                    bottom: "auto",
                    margin: "0",
                },
            });
        });
    }
    public setElement(el: HTMLElement) {
        this._el = el;
    }
}
