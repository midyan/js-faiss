/* eslint-disable */
const typescript = require("rollup-plugin-typescript2");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const { terser } = require("rollup-plugin-terser");

module.exports = {
  input: "src/index.ts",
  output: [
    {
      file: "build/index.cjs.js",
      format: "cjs",
    },
    {
      file: "build/index.esm.js",
      format: "esm",
    },
    {
      file: "build/index.umd.js",
      format: "umd",
      name: "JS-FAISS",
    },
  ],
  plugins: [
    typescript({
      tsconfig: "tsconfig.json",
      useTsconfigDeclarationDir: true,
    }),
    resolve(),
    commonjs(),
    terser(),
  ],
};
