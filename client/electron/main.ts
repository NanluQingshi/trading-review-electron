/*
 * @Author: NanluQingshi
 * @Date: 2026-01-21 12:17:02
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-01-21 16:10:34
 * @Description:
 */
import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { spawn, ChildProcess } from "node:child_process";
import started from "electron-squirrel-startup";

// 后端服务子进程
let backendProcess: ChildProcess | null = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// 启动后端服务
const startBackend = () => {
  // 获取应用的资源路径
  const appPath = app.getAppPath();

  // 判断当前是否为开发环境
  const isDev =
    process.env.NODE_ENV === "development" || !!MAIN_WINDOW_VITE_DEV_SERVER_URL;

  // 确定后端服务路径
  let backendPath, backendCwd;

  if (isDev) {
    // 开发环境：使用项目根目录下的server目录
    backendPath = path.join(__dirname, "../../server/index.js");
    backendCwd = path.join(__dirname, "../../server");
  } else {
    // 生产环境：使用打包后的资源目录下的server目录
    // 当使用extraResource打包时，server目录会被放在Resources目录下
    const resourcesPath = path.dirname(appPath);
    backendPath = path.join(resourcesPath, "server/index.js");
    backendCwd = path.join(resourcesPath, "server");
  }

  console.log("🚀 启动后端服务...");
  console.log(`📁 应用路径: ${appPath}`);
  console.log(`📂 后端服务路径: ${backendPath}`);
  console.log(`📂 后端工作目录: ${backendCwd}`);
  console.log(`🔧 环境: ${isDev ? "开发环境" : "生产环境"}`);

  // 启动后端服务
  backendProcess = spawn("node", [backendPath], {
    cwd: backendCwd,
    env: {
      ...process.env,
      NODE_ENV: isDev ? "development" : "production",
    },
    stdio: "inherit",
  });

  // 监听后端服务退出事件
  backendProcess.on("exit", (code, signal) => {
    console.log(`💥 后端服务退出: 退出码 ${code}, 信号 ${signal}`);
    backendProcess = null;
  });

  // 监听后端服务错误事件
  backendProcess.on("error", (error) => {
    console.error(`❌ 后端服务启动失败: ${error.message}`);
    backendProcess = null;
  });
};

// 停止后端服务
const stopBackend = () => {
  if (backendProcess) {
    console.log("🛑 关闭后端服务...");
    backendProcess.kill();
    backendProcess = null;
  }
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
  // 启动后端服务
  startBackend();

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

// 应用退出前关闭后端服务
app.on("before-quit", () => {
  stopBackend();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// IPC通信方法实现

// 获取应用版本
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});
