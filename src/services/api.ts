/*
 * @Author: NanluQingshi
 * @Date: 2026-01-21 01:39:50
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-02-06 22:54:44
 * @Description:
 */
import { Method, Trade } from "@/types";

// 检查 window.electron 是否存在
const ensureElectronExists = () => {
  return !!window.electron;
};

// Method API
export const methodsApi = {
  getMethods: async () => {
    if (!ensureElectronExists()) {
      return {
        success: false,
        data: [],
        message: "Electron API not ready yet, please retry",
      };
    }
    const result = await window.electron.methods.list();
    return result;
  },
  getMethod: async (id: string) => {
    if (!ensureElectronExists()) {
      return {
        success: false,
        data: null,
        message: "Electron API not ready yet, please retry",
      };
    }
    const result = await window.electron.methods.detail(id);
    return result;
  },
  createMethod: async (method: Partial<Method>) => {
    if (!ensureElectronExists()) {
      throw new Error("Electron API not ready yet, please retry");
    }
    const result = await window.electron.methods.create(method);
    return result;
  },
  updateMethod: async (id: string, method: Partial<Method>) => {
    if (!ensureElectronExists()) {
      throw new Error("Electron API not ready yet, please retry");
    }
    const result = await window.electron.methods.update(id, method);
    return result;
  },
  deleteMethod: async (id: string) => {
    if (!ensureElectronExists()) {
      throw new Error("Electron API not ready yet, please retry");
    }
    const result = await window.electron.methods.delete(id);
    return result;
  },
  getDefaultMethod: async () => {
    if (!ensureElectronExists()) {
      return {
        success: false,
        data: null,
        message: "Electron API not ready yet, please retry",
      };
    }
    const result = await window.electron.methods.getDefault();
    return result;
  },
  setDefaultMethod: async (id: string) => {
    if (!ensureElectronExists()) {
      throw new Error("Electron API not ready yet, please retry");
    }
    const result = await window.electron.methods.setDefault(id);
    return result;
  },
};

// Trade API
export const tradesApi = {
  getTrades: async (filters?: Record<string, unknown>) => {
    if (!ensureElectronExists()) {
      return {
        success: false,
        data: [],
        message: "Electron API not ready yet, please retry",
      };
    }
    const result = await window.electron.trades.list(filters);
    return result;
  },
  getTrade: async (id: number) => {
    if (!ensureElectronExists()) {
      return {
        success: false,
        data: null,
        message: "Electron API not ready yet, please retry",
      };
    }
    const result = await window.electron.trades.detail(id);
    return result;
  },
  createTrade: async (trade: Partial<Trade>) => {
    if (!ensureElectronExists()) {
      throw new Error("Electron API not ready yet, please retry");
    }
    const result = await window.electron.trades.create(trade);
    return result;
  },
  updateTrade: async (id: number, trade: Partial<Trade>) => {
    if (!ensureElectronExists()) {
      throw new Error("Electron API not ready yet, please retry");
    }
    const result = await window.electron.trades.update(id, trade);
    return result;
  },
  deleteTrade: async (id: number) => {
    if (!ensureElectronExists()) {
      throw new Error("Electron API not ready yet, please retry");
    }
    const result = await window.electron.trades.delete(id);
    return result;
  },
};

// Stats API
export const statsApi = {
  getStats: async () => {
    if (!ensureElectronExists()) {
      return {
        success: false,
        data: {
          overview: {
            totalTrades: 0,
            winTrades: 0,
            lossTrades: 0,
            breakevenTrades: 0,
            winRate: 0,
            totalProfit: 0,
            avgProfit: 0,
            avgWin: 0,
            avgLoss: 0,
            profitFactor: 0,
            totalExpectedProfit: 0,
            avgExpectedProfit: 0,
          },
          symbolStats: [],
          methodStats: [],
          profitCurve: [],
        },
        message: "Electron API not ready yet, please retry",
      };
    }
    const result = await window.electron.stats.overall();
    return result;
  },
  getMethodStats: async () => {
    if (!ensureElectronExists()) {
      return {
        success: false,
        data: [],
        message: "Electron API not ready yet, please retry",
      };
    }
    const result = await window.electron.stats.methods();
    return result;
  },
  getSymbolStats: async () => {
    if (!ensureElectronExists()) {
      return {
        success: false,
        data: [],
        message: "Electron API not ready yet, please retry",
      };
    }
    const result = await window.electron.stats.symbols();
    return result;
  },
  getTimePeriodStats: async (period: "day" | "week" | "month") => {
    if (!ensureElectronExists()) {
      return {
        success: false,
        data: [],
        message: "Electron API not ready yet, please retry",
      };
    }
    const result = await window.electron.stats.timePeriod(period);
    return result;
  },
  getProfitCurve: async () => {
    if (!ensureElectronExists()) {
      return {
        success: false,
        data: [],
        message: "Electron API not ready yet, please retry",
      };
    }
    const result = await window.electron.stats.profitCurve();
    return result;
  },
};

export default {
  methods: methodsApi,
  trades: tradesApi,
  stats: statsApi,
};
