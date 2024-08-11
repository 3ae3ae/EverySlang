import { resolve } from "path";
import { defineConfig } from "vite";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  base: "./",
  envDir: __dirname,
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        nested1: resolve(__dirname, "Content Guidelines.html"),
        nested2: resolve(__dirname, "createWord.html"),
        nested3: resolve(__dirname, "login.html"),
        nested4: resolve(__dirname, "nickname.html"),
        nested5: resolve(__dirname, "needlogin.html"),
        nested6: resolve(__dirname, "profile.html"),
        nested7: resolve(__dirname, "disableAccount.html"),
        nested8: resolve(__dirname, "forbidden.html"),
        nested9: resolve(__dirname, "logout.html"),
        css: resolve(__dirname, "style.css"),
      },
    },
  },
});
