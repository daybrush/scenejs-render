import { useStoreStateSetValue } from "@scena/react-store";
import { toSvg } from "html-to-image";
import * as React from "react";
import { ReactSceneResult } from "react-scenejs";
import { Poly } from "react-shape-svg";
import { $container, $scene } from "../RenderModal";
import { Progress } from "./Progress";

export interface GalleryItemProps {
    sceneComponent: React.ForwardRefExoticComponent<React.RefAttributes<ReactSceneResult>>;
    title: string;
    width: number;
    height: number;
}
export function GalleryItem(props: GalleryItemProps) {
    const SceneComponent = props.sceneComponent;
    const galleryElementRef = React.useRef<HTMLDivElement>(null);
    const sceneRef = React.useRef<ReactSceneResult>(null);

    const setScene = useStoreStateSetValue($scene);
    const setContainer = useStoreStateSetValue($container);
    const [duration, setDuration] = React.useState("0s");

    React.useEffect(() => {
        sceneRef.current!.setTime(0);
        setDuration(`${sceneRef.current!.getTotalDuration()}s`);
    }, []);

    React.useEffect(() => {
        const galleryElement = galleryElementRef.current!;
        const playButton = galleryElement.querySelector(".example-hover .play")!;
        const pausedButton = galleryElement.querySelector(".example-hover .paused")!;
        const scene = sceneRef.current!;

        function onPlay() {
            playButton.classList.remove("display");
            pausedButton.classList.add("display");
        }
        function onPaused() {
            playButton.classList.add("display");
            pausedButton.classList.remove("display");
        }

        scene.on("play", onPlay);
        scene.on("paused", onPaused);

        return () => {
            scene.off("play", onPlay);
            scene.off("paused", onPaused);
        };
    }, [sceneRef]);

    return (<div className="gallery-item" ref={galleryElementRef}>
        <h4 className="name" id="motion-effect">{props.title}</h4>
        <ul>
            <li>Size: {props.width} x {props.height}</li>
            <li>Duration: {duration}</li>
            <li>Code: <a href="https://github.com" target="_blank" rel="noreferrer">JS</a> / <a href="https://github.com" target="_blank" rel="noreferrer">React</a></li>
        </ul>
        <div className="capture" onClick={() => {
            toSvg(galleryElementRef.current!.querySelector<HTMLElement>(".example-container")!, {
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
            }).then(url => {
                const result = galleryElementRef.current!.querySelector<HTMLElement>(".result")!;

                result.style.display = "block";
                result.innerHTML = `<img src="${url}" />`;
                // result.innerHTML = `${decodeURIComponent(url.replace("data:image/svg+xml;charset=utf-8,", ""))}`;
            });
        }}></div>
        <div className="record" onClick={() => {
            setContainer(galleryElementRef.current);
            setScene(sceneRef.current!);
        }}></div>
        <div className="example" style={{
            height: `${props.height}px`,
        }}>
            <div className="example-viewer">
                <div className="example-container" style={{
                    width: `${props.width}px`,
                }}>
                    <SceneComponent ref={sceneRef} />
                </div>
            </div>
            <div className="example-hover" onClick={() => {
                const scene = sceneRef.current!;

                if (scene.isPaused()) {
                    scene.play();
                } else {
                    scene.pause();
                }
            }}>
                <div className="button play display" >
                    <Poly
                        strokeWidth={10}
                        left={5}
                        top={5}
                        right={5}
                        bottom={5}
                        width={50}
                        rotate={90}
                        fill="#333"
                        stroke="#333"
                    />
                </div>
                <div className="button paused"></div>
            </div>
        </div>
        <Progress sceneRef={sceneRef} />
        <div className="result" style={{
            height: `${props.height}px`,
        }}>
            <video controls={true} />
        </div>
    </div>);
}