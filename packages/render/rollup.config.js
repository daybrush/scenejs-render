
const builder = require("@daybrush/builder");

const external = {
    "scenejs": "Scene",
};

module.exports = builder([
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
]);
