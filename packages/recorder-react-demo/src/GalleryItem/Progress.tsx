import { RefObject, useEffect, useRef } from "react";
import { ReactSceneResult } from "react-scenejs";
import { OnEvent } from "@scena/event-emitter";
import Scene, { OnSceneAnimate } from "scenejs";



export interface ProgressProps {
    sceneRef: RefObject<ReactSceneResult>;
    enabled?: boolean;
}
export function Progress(props: ProgressProps) {
    const playerRef = useRef<HTMLDivElement>(null);
    const sceneRef = props.sceneRef;

    useEffect(() => {
        const playButton = playerRef.current!.querySelector(".play")!;
        const progressInput = playerRef.current!.querySelector<HTMLInputElement>(".progress")!;
        const scene = sceneRef.current!;

        function onPlay() {
            playButton.className = "pause";
        }
        function onPaused() {
            playButton.className = "play";
        }
        function onAnimate(e: OnEvent<OnSceneAnimate, Scene>) {
            progressInput.value = `${100 * e.time / e.currentTarget.getDuration()}`;
        }
        function onClick() {
            scene.isPaused() ? scene.play() : scene.pause();
        }
        function onInput() {
            scene.pause();
            scene.setTime(`${progressInput.value}%`);
        }

        scene.on("play", onPlay);
        scene.on("paused", onPaused);
        scene.on("animate", onAnimate);

        playButton.addEventListener("click", onClick);
        progressInput.addEventListener("input", onInput);

        return () => {
            scene.off("play", onPlay);
            scene.off("paused", onPaused);
            scene.off("animate", onAnimate);
            playButton.removeEventListener("click", onClick);
            progressInput.removeEventListener("input", onInput);
        };
    }, [sceneRef]);
    return <div className="player" ref={playerRef}>
        <div className="play"></div>
        <input className="progress" type="range" min="0" max="100" defaultValue={0} />
    </div>;
}