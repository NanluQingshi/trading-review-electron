// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// 预加载脚本，用于在渲染进程和主进程之间建立通信桥接
import { contextBridge, ipcRenderer } from "electron";

// 定义electronAPI的类型
interface ElectronAPI {
  // 应用相关
  getAppVersion: () => Promise<string>;

  // 交易相关
  trades: {
    list: (filters?: any) => Promise<any>;
    detail: (id: number) => Promise<any>;
    create: (trade: any) => Promise<any>;
    update: (id: number, trade: any) => Promise<any>;
    delete: (id: number) => Promise<any>;
    deleteBatch: (ids: number[]) => Promise<any>;
  };

  // 策略方法相关
  methods: {
    list: () => Promise<any>;
    detail: (id: string) => Promise<any>;
    create: (method: any) => Promise<any>;
    update: (id: string, method: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
    deleteBatch: (ids: string[]) => Promise<any>;
    getDefault: () => Promise<any>;
    setDefault: (id: string) => Promise<any>;
  };

  // 统计相关
  stats: {
    overall: () => Promise<any>;
    methods: () => Promise<any>;
    symbols: () => Promise<any>;
    timePeriod: (period: "day" | "week" | "month") => Promise<any>;
    profitCurve: () => Promise<any>;
  };

  // 设置相关
  settings: {
    getDataPath: () => Promise<string | null>;
    setDataPath: (dataPath: string) => Promise<boolean>;
    clearDataPath: () => Promise<boolean>;
    selectDataPath: () => Promise<string | null>;
    migrateData: (
      newPath: string,
    ) => Promise<{ success: boolean; message: string }>;
  };

  // 事件监听
  on: (channel: string, callback: (...args: any[]) => void) => void;
  off: (channel: string, callback: (...args: any[]) => void) => void;
}

// 向渲染进程暴露安全的API
contextBridge.exposeInMainWorld("electron", {
  // 应用相关
  getAppVersion: () => ipcRenderer.invoke("app:version"),

  // 交易相关
  trades: {
    list: (filters?: any) => ipcRenderer.invoke("trades:list", filters),
    detail: (id: number) => ipcRenderer.invoke("trades:detail", id),
    create: (trade: any) => ipcRenderer.invoke("trades:create", trade),
    update: (id: number, trade: any) =>
      ipcRenderer.invoke("trades:update", id, trade),
    delete: (id: number) => ipcRenderer.invoke("trades:delete", id),
    deleteBatch: (ids: number[]) =>
      ipcRenderer.invoke("trades:delete-batch", ids),
  },

  // 策略方法相关
  methods: {
    list: () => ipcRenderer.invoke("methods:list"),
    detail: (id: string) => ipcRenderer.invoke("methods:detail", id),
    create: (method: any) => ipcRenderer.invoke("methods:create", method),
    update: (id: string, method: any) =>
      ipcRenderer.invoke("methods:update", id, method),
    delete: (id: string) => ipcRenderer.invoke("methods:delete", id),
    deleteBatch: (ids: string[]) =>
      ipcRenderer.invoke("methods:delete-batch", ids),
    getDefault: () => ipcRenderer.invoke("methods:default"),
    setDefault: (id: string) => ipcRenderer.invoke("methods:set-default", id),
  },

  // 统计相关
  stats: {
    overall: () => ipcRenderer.invoke("stats:overall"),
    methods: () => ipcRenderer.invoke("stats:methods"),
    symbols: () => ipcRenderer.invoke("stats:symbols"),
    timePeriod: (period: "day" | "week" | "month") =>
      ipcRenderer.invoke("stats:time-period", period),
    profitCurve: () => ipcRenderer.invoke("stats:profit-curve"),
  },

  // 设置相关
  settings: {
    getDataPath: () => ipcRenderer.invoke("settings:get-data-path"),
    setDataPath: (dataPath: string) =>
      ipcRenderer.invoke("settings:set-data-path", dataPath),
    clearDataPath: () => ipcRenderer.invoke("settings:clear-data-path"),
    selectDataPath: () => ipcRenderer.invoke("settings:select-data-path"),
    migrateData: (newPath: string) =>
      ipcRenderer.invoke("settings:migrate-data", newPath),
  },

  // 事件监听
  on: (channel: string, callback: (...args: any[]) => void) => {
    // 验证通道名称，防止不安全的通道访问
    const validChannels = ["show-about-dialog"];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },

  off: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.off(channel, callback);
  },
} as ElectronAPI);
