import { RenderModal } from "./RenderModal";
import { SquareTransition } from "./SquareTransition/SquareTransition";
import { Card } from "./Card/Card";
import { Clapper1 } from "./Clapper1/Clapper1";
import { Clapper2 } from "./Clapper2/Clapper2";
import { GalleryItem } from "./GalleryItem/GalleryItem";
import { MotionEffect } from "./MotionEffect/MotionEffect";
import { SmokeTransition } from "./SmokeTransition/SmokeTransition";

export function Gallery() {
    return <div className="gallery">
        <p style={{
            fontWeight: "bold",
            lineHeight: 1.3,
        }}>
            * I recommend checking out the Scene.js Recorder demo in Chrome. <br />
            * In Safari, the `html-to-image` module may not render some parts. <br />
            &nbsp;&nbsp;Use `@scenejs/render` in Node env. <br/>
            * On mobile, memory issues may occur.
        </p>
        <RenderModal />
        <GalleryItem
            title="Motion Effect"
            sceneComponent={MotionEffect}
            width={200}
            height={200}
        />
        <GalleryItem
            title="Clapper 1"
            sceneComponent={Clapper1}
            width={350}
            height={350} />
        <GalleryItem
            title="Card"
            sceneComponent={Card}
            width={350}
            height={360} />
        <GalleryItem
            title="Clapper 2"
            sceneComponent={Clapper2}
            width={400}
            height={400} />
        <GalleryItem
            title="Square Transition"
            sceneComponent={SquareTransition}
            width={720}
            height={360} />
        {/* <GalleryItem
            title="Smoke Transition"
            sceneComponent={SmokeTransition}
            width={800}
            height={400} /> */}
    </div>;
}