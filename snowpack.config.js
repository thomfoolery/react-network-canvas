// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    "dev-server/public": {
      url: "/",
      static: true,
    },
    "dev-server": {
      url: "/",
    },
    src: {
      url: "/",
    },
  },
  plugins: ["@snowpack/plugin-react-refresh"],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    open: "firefox",
  },
  buildOptions: {
    out: "dist",
  },
  optimize: {
    bundle: true,
    minify: false,
    target: "es2015",
    entrypoints: ["src/index.tsx"],
  },
  alias: {
    "@component": "./src",
  },
};
