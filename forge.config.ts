/*
 * @Author: NanluQingshi
 * @Date: 2026-01-21 12:17:02
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-02-06 19:19:00
 * @Description:
 */
import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { VitePlugin } from "@electron-forge/plugin-vite";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import path from "path";
import fs from "fs";

const config: ForgeConfig = {
  outDir: "dist",
  packagerConfig: {
    asar: true,
  },
  hooks: {
    packageAfterPrune: async (_config, buildPath) => {
      // 我们需要手动复制的模块列表
      const modulesToCopy = [
        'better-sqlite3',
        'bindings',
        'file-uri-to-path' 
      ];

      const sourceBase = path.join(process.cwd(), 'node_modules');
      const destBase = path.join(buildPath, 'node_modules');

      // 确保目标 node_modules 目录存在
      if (!fs.existsSync(destBase)) {
        fs.mkdirSync(destBase, { recursive: true });
      }

      console.log('🚧 正在手动修复 Native Dependencies...');

      for (const moduleName of modulesToCopy) {
        const sourcePath = path.join(sourceBase, moduleName);
        const destPath = path.join(destBase, moduleName);

        if (fs.existsSync(sourcePath)) {
          console.log(`   -> Copying ${moduleName}...`);
          // 递归复制
          fs.cpSync(sourcePath, destPath, { recursive: true, force: true });
        } else {
          console.warn(`   ⚠️ 警告: 在源 node_modules 中找不到 ${moduleName}，可能导致运行报错。`);
        }
      }
      
      console.log('✅ 手动修复完成！');
    },
  },
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ["darwin", "win32"]),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: "electron/main.ts",
          config: "vite.main.config.ts",
          target: "main",
        },
        {
          entry: "electron/preload.ts",
          config: "vite.preload.config.ts",
          target: "preload",
        },
      ],
      renderer: [
        {
          name: "main_window",
          config: "vite.renderer.config.ts",
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
