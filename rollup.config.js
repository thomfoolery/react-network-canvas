import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import {terser} from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss-modules";
import autoprefixer from "autoprefixer";
import alias from "rollup-plugin-alias";

const packageJson = require("./package.json");

export default {
  input: "src/index.tsx",
  preserveModules: false,
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript(),
    terser(),
    postcss({
      plugins: [autoprefixer()],
      sourceMap: true,
      minimize: true,
      extract: true,
      modules: true,
    }),
    alias({
      "@component": __dirname + "/src",
    }),
  ],
};
