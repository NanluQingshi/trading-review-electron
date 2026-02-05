/*
 * @Author: NanluQingshi
 * @Date: 2026-01-21 12:17:02
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-02-05 16:14:30
 * @Description:
 */
import { app, BrowserWindow, ipcMain } from "electron";
import fs from "fs";
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
    // 对于所有平台，app.getAppPath() 返回的都是 app.asar 文件路径
    // 例如：
    // macOS: /path/to/app.app/Contents/Resources/app.asar
    // Windows: C:\path\to\app\resources\app.asar
    // 我们需要找到其所在目录，即 Resources 目录
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
  try {
    console.log(`🔍 检查后端服务文件是否存在: ${backendPath}`);
    if (fs.existsSync(backendPath)) {
      console.log(`✅ 后端服务文件存在`);

      // 检查文件权限
      const stats = fs.statSync(backendPath);
      console.log(`📝 文件权限: ${stats.mode.toString(8)}`);

      // 检查工作目录是否存在
      if (fs.existsSync(backendCwd)) {
        console.log(`✅ 后端工作目录存在`);
      } else {
        console.error(`❌ 后端工作目录不存在: ${backendCwd}`);
      }
    } else {
      console.error(`❌ 后端服务文件不存在: ${backendPath}`);

      // 列出resources目录内容，帮助诊断路径问题
      const resourcesPath = isDev
        ? path.join(__dirname, "../../server")
        : path.dirname(appPath);
      console.log(`📋 资源目录内容:`);
      try {
        const files = fs.readdirSync(resourcesPath, { withFileTypes: true });
        files.forEach((file) => {
          console.log(`  ${file.isDirectory() ? "📁" : "📄"} ${file.name}`);
        });
      } catch (err) {
        console.error(`❌ 无法读取资源目录: ${err.message}`);
      }
    }
  } catch (error) {
    console.error(`❌ 检查后端服务文件时出错: ${error.message}`);
  }

  try {
    // 对于macOS，使用与Electron捆绑的Node.js
    let nodePath = "node";
    if (process.platform === "darwin") {
      // macOS: 使用Electron应用内置的Node.js
      nodePath = path.join(
        process.execPath,
        "../../Frameworks/Electron Framework.framework/Versions/A/Resources/electron_node",
      );
      console.log(`🍎 macOS: 使用内置Node.js路径: ${nodePath}`);

      // 检查内置Node.js是否存在
      if (!fs.existsSync(nodePath)) {
        console.warn(`⚠️  内置Node.js不存在，使用系统Node.js`);
        nodePath = "node";
      }
    }

    console.log(`🚀 尝试启动后端服务，使用Node路径: ${nodePath}`);
    console.log(`📂 后端服务路径: ${backendPath}`);
    console.log(`📂 后端工作目录: ${backendCwd}`);

    backendProcess = spawn(nodePath, [backendPath], {
      cwd: backendCwd,
      env: {
        ...process.env,
        NODE_ENV: isDev ? "development" : "production",
        // 添加额外的环境变量，帮助诊断
        ELECTRON_RUN_AS_NODE: "1",
      },
      stdio: "inherit",
    });

    console.log(`✅ 后端服务进程已启动，PID: ${backendProcess.pid}`);
  } catch (error) {
    console.error(`❌ 启动后端服务失败: ${error.message}`);
    console.error(`📋 错误详情:`, error);
  }

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
