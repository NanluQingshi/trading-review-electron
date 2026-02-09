/*
 * @Author: NanluQingshi
 * @Date: 2026-01-21 12:17:02
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-02-09 15:50:39
 * @Description:
 */
import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@electron": path.resolve(__dirname, "./electron"),
      "@styles": path.resolve(__dirname, "./src/styles"),
    },
  },
  build: {
    rollupOptions: {
      onwarn: (warning, warn) => {
        // 忽略React Server Components指令警告
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        // 忽略其他可能的警告
        warn(warning);
      },
    },
  },
});
