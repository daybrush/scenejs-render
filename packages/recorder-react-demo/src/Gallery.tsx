import { useStoreRoot } from "@scena/react-store";
import { Card } from "./Card/Card";
import { Clapper1 } from "./Clapper1/Clapper1";
import { Clapper2 } from "./Clapper2/Clapper2";
import { GalleryItem } from "./GalleryItem/GalleryItem";
import { MotionEffect } from "./MotionEffect/MotionEffect";
import { RenderModal } from "./RenderModal";


export function Gallery() {
    return <div className="gallery">
        <RenderModal />
        <GalleryItem
            title="Motion Effect"
            duration="2s"
            sceneComponent={MotionEffect}
            width={200}
            height={200}
        />
        <GalleryItem
            title="Clapper"
            duration="3.5s"
            sceneComponent={Clapper1}
            width={350}
            height={350} />
        <GalleryItem
            title="Card"
            duration="2s * 4"
            sceneComponent={Card}
            width={350}
            height={360} />
        <GalleryItem
            title="Clapper 2"
            duration="8.1s"
            sceneComponent={Clapper2}
            width={400}
            height={400} />
    </div>;
}