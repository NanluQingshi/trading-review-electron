/*
 * @Author: NanluQingshi
 * @Date: 2026-02-05 21:57:01
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-02-06 19:19:00
 * @Description:
 */
import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@electron": path.resolve(__dirname, "./electron")
    }
  },
  build: {
    rollupOptions: {
      // 配置允许动态加载的模块
      external: ["better-sqlite3"],
    },
  },
});
