import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      // 配置允许动态加载的模块
      external: ["better-sqlite3"],
    },
  },
});
