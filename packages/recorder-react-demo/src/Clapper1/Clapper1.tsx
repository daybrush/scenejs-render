/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { EASE_IN_OUT, selectorAll } from "scenejs";
import { ReactSceneResult, useScene } from "react-scenejs";
import { zoomIn } from "@scenejs/effects";
import { Poly } from "react-shape-svg";

export const Clapper1 = React.forwardRef<ReactSceneResult>((_, ref) => {
    const scene = useScene(() => {
        return {
            ".clapper1": {
                2: "transform: translate(-50%, -50%) rotate(0deg)",
                2.5: {
                    transform: "rotate(-15deg)",
                },
                3: {
                    transform: "rotate(0deg)",
                },
                3.5: {
                    transform: "rotate(-10deg)",
                },
            },
            ".clapper1 .clapper-container": {
                0: zoomIn({ duration: 1 }),
            },
            ".clapper1 .circle": {
                0.3: zoomIn({ duration: 1 }),
            },
            ".clapper1 .play": {
                0: {
                    transform: "translate(-50%, -50%)",
                },
                0.6: zoomIn({ duration: 1 }),
            },
            ".clapper1 .top .stick1": {
                2: {
                    transform: {
                        rotate: "0deg",
                    },
                },
                2.5: {
                    transform: {
                        rotate: "-20deg",
                    }
                },
                3: {
                    transform: {
                        rotate: "0deg",
                    }
                },
                3.5: {
                    transform: {
                        rotate: "-10deg",
                    }
                },
            },
            ".clapper1 .stick1 .rect": selectorAll(i => ({
                0: {
                    transform: {
                        scale: 0,
                        skew: "15deg",
                    }
                },
                0.7: {
                    transform: {
                        scale: 1,
                    }
                },
                options: {
                    delay: 0.6 + i * 0.1,
                },
            }), 6),
            ".clapper1 .stick2 .rect": selectorAll(i => ({
                0: {
                    transform: {
                        scale: 0,
                        skew: "-15deg",
                    }
                },
                0.7: {
                    transform: {
                        scale: 1,
                    }
                },
                options: {
                    delay: 0.8 + i * 0.1,
                },
            }), 6),
        };
    }, {
        easing: EASE_IN_OUT,
        selector: true,
    });


    React.useImperativeHandle(ref, () => scene, []);

    return <div className="clapper clapper1">
        <div className="clapper-container">
            <div className="clapper-body">
                <div className="top">
                    <div className="stick stick1">
                        <div className="rect"></div>
                        <div className="rect"></div>
                        <div className="rect"></div>
                        <div className="rect"></div>
                        <div className="rect"></div>
                        <div className="rect"></div>
                    </div>
                    <div className="stick stick2">
                        <div className="rect"></div>
                        <div className="rect"></div>
                        <div className="rect"></div>
                        <div className="rect"></div>
                        <div className="rect"></div>
                        <div className="rect"></div>
                    </div>
                </div>
                <div className="bottom"></div>
            </div>
            <div className="circle"></div>
            <div className="play">
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
        </div>
    </div>;
});

Clapper1.displayName = "Clapper1";