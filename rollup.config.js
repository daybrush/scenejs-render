
import builder from "@daybrush/builder";

const external = {
    "scenejs": "Scene",
};

export default builder([
    {
        input: "src/index.ts",
        output: "./dist/render.esm.js",
        exports: "named",
        format: "es",
    },
    {
        input: "src/index.ts",
        output: "./dist/render.cjs.js",
        exports: "named",
        format: "cjs",
    },
    {
        input: "src/subcapture.ts",
        output: "./dist/subcapture.js",
        exports: "named",
        format: "cjs",
    },
]);
