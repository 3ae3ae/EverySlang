import { resolve } from "path";
import { defineConfig } from "vite";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        nested1: resolve(__dirname, "Content Guidelines.html"),
        nested2: resolve(__dirname, "createWord.html"),
      },
    },
  },
});
