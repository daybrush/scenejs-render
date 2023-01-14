/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';
import { StoreRoot } from "@scena/react-store";
import { Gallery } from './Gallery';


function App() {
  return (
    <div className="App">
      <p style={{ textAlign: "center" }}>
        <img src="./clapperboard.png" style={{
          width: "250px",
        }} alt="Clapperboard" />
      </p>
      <h2 style={{ textAlign: "center" }}>Scene.js Recorder</h2>


      <p style={{ textAlign: "center" }}>🎬 Make a movie of CSS animation through <a href="https://github.com/daybrush/scenejs">Scene.js</a></p>
      <p style={{ textAlign: "center" }}>
        <a href="https://github.com/daybrush/scenejs-render"><strong>Github</strong></a>
        &nbsp;/&nbsp;
        <a href="https://daybrush.com/scenejs-render/release/latest/doc"><strong>API</strong></a>
        &nbsp;/&nbsp;
        <a href="https://github.com/daybrush/scenejs"><strong>Scene.js</strong></a>
        &nbsp;/&nbsp;
        <a href="https://github.com/daybrush/scena"><strong>Main Project</strong></a>
      </p>

      <br />

      <StoreRoot>
        <Gallery />
      </StoreRoot>
    </div>
  );
}

export default App;
