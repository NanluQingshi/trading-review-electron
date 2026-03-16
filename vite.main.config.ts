/*
 * @Author: NanluQingshi
 * @Date: 2026-02-05 21:57:01
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-02-06 19:19:00
 * @Description:
 */
import "dotenv/config";
import { defineConfig } from "vite";
import path from "path";

// 打包时从 .env 注入激活服务器地址，确保打包后的 App 能连上你的服务器
const activationServerUrl = process.env.ACTIVATION_SERVER_URL || "";

// https://vitejs.dev/config
export default defineConfig({
  define: {
    "process.env.ACTIVATION_SERVER_URL": JSON.stringify(activationServerUrl),
  },
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
