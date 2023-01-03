/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Scene, { EASE_IN_OUT, selectorAll } from "scenejs";
import { ReactSceneResult, useScene } from "react-scenejs";
import { PolyShape } from "shape-svg";
import { Oval, Poly } from "react-shape-svg";



function makeShadow(options: PolyShape, left = 10, top = 15) {
    return {
        target: {
            left,
            top,
            right: left,
            bottom: top,
            opacity: 1,
            ...options,
        },
        shadow: {
            left: left * 2,
            top: top * 2,
            opacity: 0.2,
            ...options,
        },
    };
}

interface TargetShadowProps {
    component: typeof Poly | typeof Oval;
    options: PolyShape;
    left?: number;
    top?: number;
}

function TargetShadow(props: TargetShadowProps) {
    const targetInfo = makeShadow(props.options, props.left, props.top);
    const Component = props.component;

    return <>
        <Component {...targetInfo.shadow} />
        <Component {...targetInfo.target} />
    </>;
}

const r = 50;

export const Clapper2 = React.forwardRef<ReactSceneResult>((_, ref) => {
    const elements = React.useMemo(() => {
        const elements: React.ReactElement[] = [];

        for (let i = 1; i <= 6; ++i) {
            const size = (170 - (i - 1) * 20);
            const stroke = r * 12 / size;
            const ir = r - stroke;

            const info = makeShadow({
                "className": `svg_circle svg_circle${i} center`,
                "r": ir,
                "strokeWidth": stroke,
                "strokeLinejoin": "round",
                "stroke-linecap": "round",
                "stroke": "#333",
                "rotate": -360,
                "origin": "50% 50%",
            }, 5, 5);


            elements.push(
                <Oval key={`target1-1-${i}`} {...info.target} style={{
                    width: `${size}px`,
                    height: `${size}px`,
                }} />,
                <Oval key={`target1-2-${i}`} {...info.shadow} style={{
                    width: `${size}px`,
                    height: `${size}px`,
                }} />,
            );
        }
        return elements;
    }, []);
    const scene = useScene(() => {
        const nextStep = 2.6;
        const nextStep2 = nextStep + 4;

        return new Scene({
            ".page1 .logo1 .scene1.circle": selectorAll(i => ({
                0: {
                    transform: "scale(0)",
                },
                0.2: {
                    "border-width": "50px",
                },
                0.5: {
                    opacity: 1,
                },
                1: {
                    "transform": "scale(1)",
                    "border-width": "0px",
                    "opacity": 0,
                },
                options: {
                    delay: i * 0.4,
                },
            }), 6),
            ".page1 .logo1 ellipse": selectorAll(i => {
                const index = Math.floor(i / 2);

                return {
                    0: {
                        "opacity": 0,
                        "stroke-dasharray": "0 1000",
                        "transform": `scaleX(${index % 2 ? -1 : 1}) rotate(${-90 + index * 180}deg)`
                    },
                    0.1: {
                        opacity: i % 2 ? 0.2 : 1,
                    },
                    0.6: {
                        "stroke-dasharray": `${70} 1000`,
                        "stroke-dashoffset": 0,
                    },
                    [1.1 - index * 0.06]: {
                        opacity: i % 2 ? 0.2 : 1,
                    },
                    [1.2 - index * 0.06]: {
                        "stroke-dashoffset": -76,
                        "stroke-dasharray": "0 1000",
                        "transform": `rotate(${180 + index * 180}deg)`,
                        "opacity": 0
                    },
                    options: {
                        delay: nextStep + index * 0.16,
                    }
                };
            }, 12),
            ".page1 .play-btn.back": {
                0: {
                    transform: 'translate(-50%, -50%) scale(1)',
                },
                1: {
                    transform: 'scale(0.5)',
                },
                2: {
                    transform: 'scale(1)',
                },
                options: {
                    delay: nextStep + 1,
                }
            },
            ".page1 .play-btn.front": {
                0: {
                    transform: 'translate(-50%, -50%) scale(0)',
                },
                1: {
                    transform: 'scale(1)',
                },
                options: {
                    delay: nextStep + 2.4,
                }
            },
            ".page1 .play-circle": {
                0: {
                    transform: 'translate(-50%, -50%) scale(0)',
                },
                1: {
                    transform: 'scale(1)',
                },
                options: {
                    delay: nextStep + 2.1,
                }
            },
            ".page1 .background": {
                0: {
                    transform: 'translate(-50%, -50%) scale(0)',
                },
                1: {
                    transform: 'scale(1)',
                },
                options: {
                    delay: nextStep + 1.8,
                }
            },
            ".page1 .stick1 .rect": selectorAll(i => ({
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
                    delay: nextStep + 2.8 + i * 0.1,
                },
            }), 6),
            ".page1 .stick2 .rect": selectorAll(i => ({
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
                    delay: nextStep + 3 + i * 0.1,
                },
            }), 6),
            ".page1 .stick1": {
                0: {
                    transform: {
                        rotate: "0deg",
                    },
                },
                0.5: {
                    transform: {
                        rotate: "-20deg",
                    }
                },
                1: {
                    transform: {
                        rotate: "0deg",
                    }
                },
                1.5: {
                    transform: {
                        rotate: "-10deg",
                    }
                },
                options: {
                    delay: nextStep2,
                    easing: EASE_IN_OUT,
                }
            },
            ".page1 .clapper": {
                0: {
                    transform: "rotate(0deg)",
                },
                0.5: {
                    transform: "rotate(-15deg)",
                },
                1: {
                    transform: "rotate(0deg)",
                },
                1.5: {
                    transform: "rotate(-10deg)",
                },
                options: {
                    delay: nextStep2,
                    easing: EASE_IN_OUT,
                },
            },
        }, {
            easing: EASE_IN_OUT,
            selector: true,
            iterationCount: 1,
        });
    });

    React.useImperativeHandle(ref, () => scene, []);

    return <div className="page page1">
        <div className="logo logo1">
            <div className="clapper">
                <div className="background">
                    <div className="stick stick1">
                        <div className="rect rect1"></div>
                        <div className="rect rect2"></div>
                        <div className="rect rect3"></div>
                        <div className="rect rect4"></div>
                        <div className="rect rect5"></div>
                        <div className="rect rect6"></div>
                    </div>
                    <div className="stick stick1 shadow"></div>
                    <div className="stick stick2">
                        <div className="rect rect1"></div>
                        <div className="rect rect2"></div>
                        <div className="rect rect3"></div>
                        <div className="rect rect4"></div>
                        <div className="rect rect5"></div>
                        <div className="rect rect6"></div>
                    </div>
                    <div className="stick stick2 shadow"></div>
                    <div className="bottom"></div>
                    <div className="bottom shadow"></div>
                </div>
                <div className="play-circle"></div>
                <div className="circle circle1 scene1"></div>
                <div className="circle circle2 scene1"></div>
                <div className="circle circle3 scene1"></div>
                <div className="circle circle4 scene1"></div>
                <div className="circle circle5 scene1"></div>
                {elements}
                <TargetShadow
                    component={Poly}
                    options={{
                        className: "play-btn back",
                        side: 3,
                        width: 60,
                        strokeWidth: 8,
                        strokeLinejoin: "round",
                        rotate: 90,
                        stroke: "#333",
                        fill: "#333",
                        origin: "50% 50%"
                    }} />
                <TargetShadow
                    component={Poly}
                    options={{
                        className: "play-btn front",
                        side: 3,
                        width: 60,
                        strokeWidth: 8,
                        strokeLinejoin: "round",
                        rotate: 90,
                        stroke: "#333",
                        fill: "#333",
                        origin: "50% 50%"
                    }} />
            </div>
        </div>
    </div >;
});

Clapper2.displayName = "Clapper2";