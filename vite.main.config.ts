/*
 * @Author: NanluQingshi
 * @Date: 2026-02-05 21:57:01
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-02-06 00:09:13
 * @Description:
 */
import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      // 配置允许动态加载的模块
      external: ["sqlite3"],
    },
  },
});
