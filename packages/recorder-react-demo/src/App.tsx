/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react';
import './App.css';
import Scene, { EASE_OUT } from "scenejs";
import { HTMLRecorder } from './HTMLRecorder';

// let ffmpeg: FFmpeg;

function App() {
  const [caputringLabel, setCapturingLabel] = useState("");
  const [processingLabel, setProcessingLabel] = useState("");
  const scene = useMemo(() => {
    return new Scene({
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
    }, {
      easing: EASE_OUT,
      iterationCount: "infinite",
      fillMode: "forwards",
    });
  }, []);
  const recorder = useMemo(() => {
    const recorder = new HTMLRecorder();

    return {
      init() {
        recorder.on("capture", e => {
          setCapturingLabel(`Capturing Time: ${e.currentCapturingTime.toFixed(3)}s, Expected Time: ${e.expectedCapturingTime.toFixed(3)}s`);
        });
        recorder.on("processVideo", e => {
          setProcessingLabel(`Processing Time: ${e.currentProcessingTime.toFixed(3)}s, Expected Time: ${e.expectedProcessingTime.toFixed(3)}s`);
        });
      },
      async record() {
        try {
          recorder.setElement(document.querySelector<HTMLElement>(".motion")!);

          const data = await recorder.record();
          const video = document.querySelector('video')!;
          const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

          video.setAttribute("src", url);
        } catch (e) {
          console.error(e);
        }
      },
      destroy() {
        recorder.destroy();
      },
    }

  }, []);

  useEffect(() => {
    scene.setSelector(true);

    recorder.init();
    return () => {
      recorder.destroy();
    };
  }, []);
  return (

    <div className="App">
      <div className="grids">
        <div className="grid">
          <button className="button" onClick={() => {
            recorder.record();
          }}>Record</button>
        </div>
        <div className="grid">
          <div className="cell">
            <div className="title">{caputringLabel}</div>
            <div className="area">
              <div className="motion">
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
              </div>
            </div>
          </div>
          <div className="cell">
            <div className="title">{processingLabel}</div>
            <video controls preload="auto" >
              {/* <source type="video/mp4" /> */}
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
