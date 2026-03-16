/*
 * @Author: NanluQingshi
 * @Date: 2026-01-21 12:17:02
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-02-25 23:07:08
 * @Description:
 */
import "dotenv/config";
import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "node:path";
import fs from "node:fs";
import started from "electron-squirrel-startup";
import { initDatabase } from "@electron/db/instance";
import * as tradeHandlers from "@electron/handlers/tradeHandlers";
import * as methodHandlers from "@electron/handlers/methodHandlers";
import * as statsHandlers from "@electron/handlers/statsHandlers";
import { getDataPath, setDataPath, clearDataPath } from "@electron/config";
import * as activationHandler from "@electron/handlers/activationHandler";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// 初始化应用
const initializeApp = () => {
  try {
    // 初始化数据库
    initDatabase();
  } catch (error) {
    console.error("❌ 数据库初始化失败:", error);
  }
};

// 注册IPC处理函数
const registerIpcHandlers = () => {
  // 交易相关的IPC处理函数
  ipcMain.handle("trades:list", (_, filters) =>
    tradeHandlers.getTrades(filters),
  );
  ipcMain.handle("trades:detail", (_, id) => tradeHandlers.getTrade(id));
  ipcMain.handle("trades:create", (_, trade) =>
    tradeHandlers.createTrade(trade),
  );
  ipcMain.handle("trades:update", (_, id, trade) =>
    tradeHandlers.updateTrade(id, trade),
  );
  ipcMain.handle("trades:delete", (_, id) => tradeHandlers.deleteTrade(id));
  ipcMain.handle("trades:delete-batch", (_, ids) =>
    tradeHandlers.deleteTrades(ids),
  );

  // 清理脏数据
  if (methodHandlers.cleanupDirtyMethods) {
    methodHandlers.cleanupDirtyMethods();
  }

  // 策略方法相关的IPC处理函数
  ipcMain.handle("methods:list", () => methodHandlers.getAllMethods());
  ipcMain.handle("methods:detail", (_, id) => methodHandlers.getMethod(id));
  ipcMain.handle("methods:create", (_, method) =>
    methodHandlers.createMethod(method),
  );
  ipcMain.handle("methods:update", (_, id, method) =>
    methodHandlers.updateMethod(id, method),
  );
  ipcMain.handle("methods:delete", (_, id) => methodHandlers.deleteMethod(id));
  ipcMain.handle("methods:delete-batch", (_, ids) =>
    methodHandlers.deleteMethods(ids),
  );
  ipcMain.handle("methods:default", () => methodHandlers.getDefaultMethod());
  ipcMain.handle("methods:set-default", (_, id) =>
    methodHandlers.setDefaultMethod(id),
  );

  // 统计相关的IPC处理函数
  ipcMain.handle("stats:overall", () => statsHandlers.getOverallStats());
  ipcMain.handle("stats:methods", () => statsHandlers.getMethodStats());
  ipcMain.handle("stats:symbols", () => statsHandlers.getSymbolStats());
  ipcMain.handle("stats:time-period", (_, period) =>
    statsHandlers.getTimePeriodStats(period),
  );
  ipcMain.handle("stats:profit-curve", () => statsHandlers.getProfitCurve());

  // 应用相关的IPC处理函数
  ipcMain.handle("app:version", () => app.getVersion());

  // 数据路径相关的IPC处理函数
  ipcMain.handle("settings:get-data-path", () => getDataPath());
  ipcMain.handle("settings:set-data-path", (_, dataPath) => {
    setDataPath(dataPath);
    return true;
  });
  ipcMain.handle("settings:clear-data-path", () => clearDataPath());
  ipcMain.handle("settings:select-data-path", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory", "createDirectory"],
      title: "选择数据存储位置",
    });
    if (result.filePaths && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null;
  });
  // 激活相关 IPC
  ipcMain.handle("activation:getStatus", () => activationHandler.isActivated());
  ipcMain.handle("activation:verify", (_, code: string) =>
    activationHandler.verifyActivationCode(code),
  );
  ipcMain.handle("activation:getTrialInfo", () =>
    activationHandler.getTrialInfo(),
  );
  ipcMain.handle("activation:startTrial", () =>
    activationHandler.startTrial(),
  );
  ipcMain.handle("activation:getTrialCountdown", () =>
    activationHandler.getTrialCountdown(),
  );

  ipcMain.handle("settings:migrate-data", async (_, newPath) => {
    try {
      // 使用实际数据路径：自定义路径优先，否则用 userData
      const oldPath = getDataPath() || app.getPath("userData");
      const oldDbPath = path.join(oldPath, "trading.db");
      const newDbPath = path.join(newPath, "trading.db");

      if (!fs.existsSync(oldDbPath)) {
        return { success: false, message: "未找到旧数据文件" };
      }

      if (fs.existsSync(newDbPath)) {
        return { success: false, message: "目标位置已存在数据文件" };
      }

      const newDir = path.dirname(newDbPath);
      if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir, { recursive: true });
      }

      fs.copyFileSync(oldDbPath, newDbPath);
      return { success: true, message: "数据迁移成功" };
    } catch (error) {
      console.error("数据迁移失败:", error);
      return { success: false, message: "数据迁移失败: " + error };
    }
  });
};

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      // 允许在渲染进程中使用nodeIntegration
      nodeIntegration: false,
      // 启用上下文隔离
      contextIsolation: true,
      // 预加载脚本路径
      preload: path.join(__dirname, "preload.js"),
      // 注意：在开发环境中，Vite 会处理 TypeScript 文件
      // 但在生产环境中，文件会被编译成 JavaScript
    },
    // 处理图标路径，确保在开发和生产环境中都能正确加载
    icon: path.join(
      __dirname,
      process.env.NODE_ENV === "development"
        ? "../assets/icon"
        : "./assets/icon",
    ),
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  if (process.env.NODE_ENV === "development") {
    // 开发环境下，打开 DevTools
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  // 初始化应用
  initializeApp();

  // 注册IPC处理函数
  registerIpcHandlers();

  // 创建应用窗口（激活检查在渲染进程中进行）
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
