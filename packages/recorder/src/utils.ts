import { Animator } from "scenejs";
import { AnimatorLike } from "./types";

export function hasProtocol(url) {
    try {
        const protocol = new URL(url).protocol;

        if (protocol) {
            return true;
        }
    } catch (e) {
    }
    return false;
}
export function resolvePath(path1: string, path2: string) {
    let paths = path1.split("/").slice(0, -1).concat(path2.split("/"));

    paths = paths.filter((directory, i) => {
        return i === 0 || directory !== ".";
    });

    let index = -1;

    // tslint:disable-next-line: no-conditional-assignment
    while ((index = paths.indexOf("..")) > 0) {
        paths.splice(index - 1, 2);
    }
    return paths.join("/");
}


export function createTimer() {
    const startTime = Date.now();

    return {
        startTime,
        getCurrentInfo(ratio: number) {
            const currentTime = (Date.now() - startTime) / 1000;

            return {
                currentTime,
                expectedTime: (currentTime / ratio),
            };
        }
    }
}

export function isAnimatorLike(value: any): value is AnimatorLike {
    return value && "getDuration" in value;
}
