
const builder = require("@daybrush/builder");


module.exports = builder([
    {
        input: "src/index.ts",
        output: "./dist/recorder.esm.js",
        exports: "named",
        format: "es",
    },
    {
        input: "src/index.cjs.ts",
        output: "./dist/recorder.cjs.js",
        exports: "named",
        format: "cjs",
    },
    // {
    //     input: "src/index.umd.ts",
    //     output: "./dist/recorder.js",
    //     exports: "named",
    //     format: "umd",
    //     resolve: true,
    //     commonjs: true,
    // },
]);
