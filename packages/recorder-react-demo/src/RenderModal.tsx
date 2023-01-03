/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { atom, useStoreRoot, useStoreState, useStoreStateSetValue, useStoreStateValue, useStoreValue } from "@scena/react-store";
import { useEffect, useState } from "react";
import { ReactSceneResult } from "react-scenejs";
import { HTMLRecorder } from "./HTMLRecorder";
import { createTimer } from "@scenejs/recorder";


export const $recorder = atom<HTMLRecorder | null>(null);
export const $scene = atom<ReactSceneResult | false>(false);
export const $container = atom<HTMLElement | null>(null);

export function RenderModal() {

    const recorder = React.useMemo(() => new HTMLRecorder(), []);

    useStoreValue($recorder, recorder);
    const sceneStore = useStoreValue($scene);
    const [scene, setScene] = useStoreState($scene);
    const container = useStoreStateValue($container);
    const [description, setDescription] = useState("Loading");
    const [leftTime, setLeftTime] = useState(0);
    const [ratio, setRatio] = useState(0);

    useEffect(() => {
        if (scene) {
            const timer = createTimer();
            setLeftTime(0);
            setDescription("Loading..");

            recorder.on("capture", e => {
                const nextRatio = e.ratio / 3 * 2;
                const info = timer.getCurrentInfo(nextRatio);

                setDescription(`Capturing Frame ${e.frameCount} / ${e.totalFrame}`);
                setLeftTime(info.expectedTime - info.currentTime);
                setRatio(nextRatio);
            });
            recorder.on("processVideo", e => {
                const nextRatio = 2 / 3 + e.ratio / 3;
                const info = timer.getCurrentInfo(nextRatio);

                setDescription(`Processing: ${e.ratio * 100}%`);
                setLeftTime(info.expectedTime - info.currentTime);
                setRatio(nextRatio);
            });
            recorder.on("processVideoEnd", () => {
                setDescription("End Rendering");
            });

            scene.setTime(0);
            recorder.recordElement(scene as any, container.querySelector<HTMLElement>(".example-container")!).then(url => {
                const result = container.querySelector<HTMLVideoElement>(".result")!;

                result.style.display = "block";
                result.querySelector<HTMLVideoElement>("video")!.src = url;

                setScene(false);
            }).catch(() => {
            });
        } else {
            try {
                recorder.off();
                recorder.exit();
            } catch (e) {

            }
        }
        return () => {
            try {
                recorder.off();
                recorder.exit();
            } catch (e) {

            }
        };
    }, [scene]);

    return <div className="record-container" style={{
        display: scene ? "block" : "none",
    }}>
        <div className="progress-container">
            <h3>Rendering</h3>
            <p>{description}</p>
            <div className="progress-total">
                <div className="progress-thumb" style={{
                    width: `${ratio * 100}%`,
                }}></div>
            </div>
            <p>Estimated Time Left: {leftTime.toFixed(3)}s</p>
            <p style={{
                textAlign: "center",
            }}><button className="cancel" onClick={() => {
                console.log(sceneStore.value);
                setScene(false);
            }}>Cancel</button></p>
        </div>
    </div>;
}