import { getRenderingInfo } from "../../src/utils";

describe("test utils", () => {
    it("test getRenderingInfo", () => {
        const info = getRenderingInfo({
            iteration: 0,
            iterationCount: 1,
            delay: 0,
            playSpeed: 1,
            duration: 1,
            parentDuration: 2,
            parentFPS: 25,
            parentStartTime: 0,
            multi: 1,
        });

        console.log(info);
    });
});
