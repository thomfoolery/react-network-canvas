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
  plugins: [
    /* ... */
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    open: "firefox",
  },
  buildOptions: {
    out: "dist",
  },
  alias: {
    "@app": "./src",
  },
};
