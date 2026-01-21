// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// 预加载脚本，用于在渲染进程和主进程之间建立通信桥接
import { contextBridge, ipcRenderer } from 'electron';

// 向渲染进程暴露安全的API
contextBridge.exposeInMainWorld("electronAPI", {
  // 获取应用版本
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),

  // 监听主进程发送的事件
  on: (channel, callback) => {
    // 验证通道名称，防止不安全的通道访问
    const validChannels = ["show-about-dialog"];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },

  // 移除事件监听器
  off: (channel, callback) => {
    ipcRenderer.off(channel, callback);
  },
});
