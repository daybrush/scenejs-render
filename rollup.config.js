
import builder from "@daybrush/builder";

const external = {
    "scenejs": "Scene",
};

export default builder([
    {
        external,
        name: "Scene",
        input: "src/index.umd.ts",
        output: "./dist/effects.js",
        exports: "named",
        outputOptions: {
            extend: true,
        },
        resolve: true,
    },
    {
        external,
        name: "Scene",
        input: "src/index.umd.ts",
        output: "./dist/effects.min.js",
        exports: "named",
        outputOptions: {
            extend: true,
        },
        resolve: true,
        uglify: true,
    },
    {
        external,
        input: "src/index.ts",
        output: "./dist/effects.esm.js",
        exports: "named",
        format: "es",
    },
    {
        external,
        input: "src/index.ts",
        output: "./dist/effects.cjs.js",
        exports: "named",
        format: "cjs",
    },
]);
