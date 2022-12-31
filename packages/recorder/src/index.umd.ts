import Recorder, * as modules from "./index";

for (const name in modules)  {
    Recorder[name] = modules[name];
}
export default Recorder;
