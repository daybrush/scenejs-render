/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { EASE_OUT } from "scenejs";
import { ReactSceneResult, useScene } from "react-scenejs";

export const MotionEffect = React.forwardRef<ReactSceneResult>((_, ref) =>  {
    const scene = useScene(() => ({
        ".circle1": {
            0: {
                "border-width": "70px",
                "transform": "scale(0)",
            },
            1: {
                "border-width": "0px",
                "transform": "scale(1.5)",
            },
            2: 1,
        },
        ".triangle": {
            0: {
                transform: "rotate(0deg) translate(0px) scale(0.5)",
                opacity: 1,
            },
            1.5: {
                transform: "rotate(40deg) translate(100px) scale(1)",
                opacity: 0,
            },
        },
        ".rectangle1": {
            0: {
                opacity: 1,
                transform: "rotate(0deg) translate(0px) scale(0.3)",
            },
            1.5: {
                transform: "rotate(-40deg) translate(-100px) scale(0.9)",
                opacity: 0,
            },
        },
        ".rectangle2": {
            0: {
                transform: " translate(0px, 0px) rotate(0deg) scale(0.3)",
                opacity: 1,
            },
            1.5: {
                transform: "translate(100px, -100px) rotate(70deg) scale(0.7)",
                opacity: 0,
            },
        },
        ".circle2": {
            0: {
                transform: " translate(0px, 0px) scale(0.7)",
                opacity: 1,
            },
            1.5: {
                transform: "translate(-100px, -50px) scale(1)",
                opacity: 0,
            },
        },
        ".star1": {
            0: {
                transform: "translateY(0px) rotate(0deg) scale(0.5)",
                opacity: 1,
            },
            1.5: {
                transform: "translateY(-100px) rotate(90deg) scale(1)",
                opacity: 0,
            }
        }
    }), {
        easing: EASE_OUT,
        fillMode: "forwards",
        selector: true,
    });

    React.useImperativeHandle(ref, () => scene, []);

    return <div className="motion">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="triangle"></div>
        <div className="rectangle rectangle1"></div>
        <div className="rectangle rectangle2"></div>
        <div className="star star1">
            <div className="star">
                <div className="star">
                    <div className="star">
                        <div className="star"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
});

MotionEffect.displayName = "MotionEffect";