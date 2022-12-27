
const builder = require("@daybrush/builder");


module.exports = builder([
    {
        input: "src/index.ts",
        output: "./dist/core.esm.js",
        exports: "named",
        format: "es",
    },
    {
        input: "src/index.ts",
        output: "./dist/core.cjs.js",
        exports: "named",
        format: "cjs",
    },
]);
