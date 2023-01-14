/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { ReactSceneResult, useScene } from "react-scenejs";
import { selectorAll } from "scenejs";

export const SquareTransition = React.forwardRef<ReactSceneResult>((_, ref) => {
    const scene = useScene({
        ".square-transition-container .scene1": {
            0: {
                opacity: 1,
            },
            0.1: {
                opacity: 0,
            },
            options: {
                delay: 2,
            },
        },
        ".square-transition-container .scene2": {
            0: {
                opacity: 0,
            },
            0.1: {
                opacity: 1,
            },
            options: {
                easing: "ease-in-out",
                delay: 2,
            },
        },
        ".square-transition-container .square": selectorAll(i => ({
            0: {
                opacity: 0,
                transform: {
                    scale: 0,
                },
            },
            0.5: {
                opacity: 1,
            },
            1: {
                transform: {
                    scale: 1,
                }
            },
            1.2: {
                transform: {
                    scale: 1,
                },
            },
            2: {
                opacity: 1,
            },
            3: {
                opacity: 0,
                transform: {
                    scale: 0,
                },
            },
            options: {
                easing: "ease-in-out",
                delay: 1 + (i % 6) * 0.1 + Math.floor(i / 6) * 0.2,
            },
        }), 21),
    }, {
        selector: true,
    });

    React.useImperativeHandle(ref, () => scene, []);
    return <div className="square-transition-container">
        <div className="scene scene1"><span>Scene 1</span></div>
        <div className="scene scene2"><span>Scene 2</span></div>
        <div className="square-transition">
            <div className="squares">
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
            </div>
            <div className="squares">
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
            </div>
            <div className="squares">
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
            </div>
        </div>
    </div>;
});

SquareTransition.displayName = "SquareTransition";
