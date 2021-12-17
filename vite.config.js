const { defineConfig } = require("vite");
const path = require("path");

export default defineConfig({
  publicDir: "./dev-server",
  root: "./dev-server",
  resolve: {
    alias: {
      "@component": path.resolve(__dirname, "src"),
    },
  },
});
