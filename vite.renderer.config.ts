/*
 * @Author: NanluQingshi
 * @Date: 2026-01-21 12:17:02
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-01-21 15:27:51
 * @Description:
 */
import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
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
