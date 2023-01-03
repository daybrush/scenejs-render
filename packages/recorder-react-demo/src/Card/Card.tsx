/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { EASE_IN_OUT, selectorAll } from "scenejs";
import { ReactSceneResult, useScene } from "react-scenejs";
import { zoomIn } from "@scenejs/effects";
import { Poly } from "react-shape-svg";

export const Card = React.forwardRef<ReactSceneResult>((_, ref) => {
    const scene = useScene({
        ".card-wrapper.forward": {
            0: {
                transform: "rotateY(0deg)",
            },
            2: {
                transform: "rotateY(360deg)"
            },
        },
        ".card-wrapper.backward": {
            0: {
                transform: "rotateY(180deg)",
            },
            2: {
                transform: "rotateY(540deg)"
            },
        },
        ".shadow": {
            0: {
                transform: "scaleX(1)",
                easing: "ease-in",
            },
            0.5: {
                transform: "scaleX(0.16)",
                easing: "ease-out",
            },
            1: {
                transform: "scaleX(1)",
            },
            options: {
                iterationCount: 2,
            }
        }
    }, {
        selector: true,
        iterationCount: 4,
    });

    React.useImperativeHandle(ref, () => scene, []);
    return <div className="card-rotor">
        <div className="card-wrapper forward">
            <div className="card">
                <div className="mark">
                    <div className="crown">
                        <div className="left"></div>
                        <div className="center"></div>
                        <div className="right"></div>
                    </div>
                </div>
            </div>
        </div>
        <div className="card-wrapper backward">
            <div className="card">
                <div className="mark">
                    K
                </div>
            </div>
        </div>
        <div className="shadow"></div>
    </div>
});

Card.displayName = "Card";
