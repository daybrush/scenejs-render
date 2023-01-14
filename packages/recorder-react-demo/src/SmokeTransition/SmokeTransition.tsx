/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { ReactSceneResult, useScene } from "react-scenejs";
import { selectorAll } from "scenejs";

export const SmokeTransition = React.forwardRef<ReactSceneResult>((_, ref) => {
    const scene = useScene({
        ".smoke-transition-container .circle": {
            0: {
                opacity: 1,
            },
        },
    }, {
        selector: true,
    });

    React.useImperativeHandle(ref, () => scene, []);
    const circles: JSX.Element[] = [];

    for (let i = 0; i <= 10; ++i) {
        for (let j = 0; j <= 5; ++j) {
            let x = i * 80 + (Math.random() - 0.5) * 20;
            let y = -j * 80 + (Math.random() - 0.5) * 20;

            circles.push(<div key={`circle${i}-${j}`} className="circle" style={{
                transform: `translate(${x}px, ${y}px) scale(${1 + Math.random() / 1.5})`,
            }}></div>);

            if (i <= 1) {
                x += -Math.exp((2 - j) / 2) * 100;
                y = -j * 20 + (Math.random() - 0.5) * 20;
                circles.push(<div key={`circle${i}-${j}-2`} className="circle" style={{
                    transform: `translate(${x}px, ${y}px) scale(${1 + Math.random() / 1.5})`,
                }}></div>);
            }
        }
    }
    return <div className="smoke-transition-container">
        {/* <div className="scene scene1"><span>Scene 1</span></div>
        <div className="scene scene2"><span>Scene 2</span></div> */}
        <div className="smoke-transition">
            <div className="circles circles1" style={{
                transform: `translate(-50%)`,
            }}>
                {circles}
            </div>
            <div className="circles circles2" style={{
                transform: `translate(-30%)`,
            }}>
                {circles}
            </div>
        </div>
    </div>;
});

SmokeTransition.displayName = "SmokeTransition";
