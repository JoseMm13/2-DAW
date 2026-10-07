import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, "index.html"),
        newTask: resolve(import.meta.dirname, "add-product.html"),
        login: resolve(import.meta.dirname, "login.html"),
        profile: resolve(import.meta.dirname, "profile.html"),
        register: resolve(import.meta.dirname, "register.html"),
        taskDetail: resolve(import.meta.dirname, "product-detail.html"),
      },
    },
  },
});
