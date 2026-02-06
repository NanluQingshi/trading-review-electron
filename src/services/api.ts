/*
 * @Author: NanluQingshi
 * @Date: 2026-01-21 01:39:50
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-02-05 20:48:52
 * @Description:
 */
import { Method, Trade, Stats } from "../types";

// 扩展Window接口，添加electron属性
declare global {
  interface Window {
    electron: {
      getAppVersion: () => Promise<string>;
      trades: {
        list: (filters?: any) => Promise<any>;
        detail: (id: number) => Promise<any>;
        create: (trade: any) => Promise<any>;
        update: (id: number, trade: any) => Promise<any>;
        delete: (id: number) => Promise<any>;
      };
      methods: {
        list: () => Promise<any>;
        detail: (id: string) => Promise<any>;
        create: (method: any) => Promise<any>;
        update: (id: string, method: any) => Promise<any>;
        delete: (id: string) => Promise<any>;
        getDefault: () => Promise<any>;
        setDefault: (id: string) => Promise<any>;
      };
      stats: {
        overall: () => Promise<any>;
        methods: () => Promise<any>;
        symbols: () => Promise<any>;
        timePeriod: (period: "day" | "week" | "month") => Promise<any>;
        profitCurve: () => Promise<any>;
      };
      on: (channel: string, callback: (...args: any[]) => void) => void;
      off: (channel: string, callback: (...args: any[]) => void) => void;
    };
  }
}

// 检查 window.electron 是否存在
const ensureElectronExists = () => {
  if (!window.electron) {
    throw new Error("Electron API not initialized. Please check if preload script is loaded correctly.");
  }
};

// Method API
export const methodsApi = {
  getMethods: async () => {
    ensureElectronExists();
    const result = await window.electron.methods.list();
    return result;
  },
  getMethod: async (id: string) => {
    ensureElectronExists();
    const result = await window.electron.methods.detail(id);
    return result;
  },
  createMethod: async (method: Partial<Method>) => {
    ensureElectronExists();
    const result = await window.electron.methods.create(method);
    return result;
  },
  updateMethod: async (id: string, method: Partial<Method>) => {
    ensureElectronExists();
    const result = await window.electron.methods.update(id, method);
    return result;
  },
  deleteMethod: async (id: string) => {
    ensureElectronExists();
    const result = await window.electron.methods.delete(id);
    return result;
  },
  getDefaultMethod: async () => {
    ensureElectronExists();
    const result = await window.electron.methods.getDefault();
    return result;
  },
  setDefaultMethod: async (id: string) => {
    ensureElectronExists();
    const result = await window.electron.methods.setDefault(id);
    return result;
  },
};

// Trade API
export const tradesApi = {
  getTrades: async (filters?: Record<string, unknown>) => {
    ensureElectronExists();
    const result = await window.electron.trades.list(filters);
    return result;
  },
  getTrade: async (id: number) => {
    ensureElectronExists();
    const result = await window.electron.trades.detail(id);
    return result;
  },
  createTrade: async (trade: Partial<Trade>) => {
    ensureElectronExists();
    const result = await window.electron.trades.create(trade);
    return result;
  },
  updateTrade: async (id: number, trade: Partial<Trade>) => {
    ensureElectronExists();
    const result = await window.electron.trades.update(id, trade);
    return result;
  },
  deleteTrade: async (id: number) => {
    ensureElectronExists();
    const result = await window.electron.trades.delete(id);
    return result;
  },
};

// Stats API
export const statsApi = {
  getStats: async () => {
    ensureElectronExists();
    const result = await window.electron.stats.overall();
    return result;
  },
  getMethodStats: async () => {
    ensureElectronExists();
    const result = await window.electron.stats.methods();
    return result;
  },
  getSymbolStats: async () => {
    ensureElectronExists();
    const result = await window.electron.stats.symbols();
    return result;
  },
  getTimePeriodStats: async (period: "day" | "week" | "month") => {
    ensureElectronExists();
    const result = await window.electron.stats.timePeriod(period);
    return result;
  },
  getProfitCurve: async () => {
    ensureElectronExists();
    const result = await window.electron.stats.profitCurve();
    return result;
  },
};

export default {
  methods: methodsApi,
  trades: tradesApi,
  stats: statsApi,
};
