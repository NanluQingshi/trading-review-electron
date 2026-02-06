/*
 * @Author: NanluQingshi
 * @Date: 2026-01-21 12:17:02
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-02-06 19:19:00
 * @Description:
 */
import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { initDatabase } from "@electron/db/instance";
import * as tradeHandlers from "@electron/handlers/tradeHandlers";
import * as methodHandlers from "@electron/handlers/methodHandlers";
import * as statsHandlers from "@electron/handlers/statsHandlers";

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
        ? "../assets/logo.png"
        : "./assets/logo.png",
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

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  // 初始化应用
  initializeApp();

  // 注册IPC处理函数
  registerIpcHandlers();

  // 创建应用窗口
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
