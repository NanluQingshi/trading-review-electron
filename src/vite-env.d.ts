/// <reference types="vite/client" />

interface Window {
  electron: {
    invoke: (channel: string, data?: any) => Promise<any>;
    on: (channel: string, func: (...args: any[]) => void) => void;
    getAppVersion: () => Promise<string>;
    trades: {
      list: (filters?: any) => Promise<any>;
      detail: (id: number) => Promise<any>;
      create: (trade: any) => Promise<any>;
      update: (id: number, trade: any) => Promise<any>;
      delete: (id: number) => Promise<any>;
      deleteBatch: (ids: number[]) => Promise<any>;
    };
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
    stats: {
      overall: () => Promise<any>;
      methods: () => Promise<any>;
      symbols: () => Promise<any>;
      timePeriod: (period: "day" | "week" | "month") => Promise<any>;
      profitCurve: () => Promise<any>;
    };
    settings: {
      getDataPath: () => Promise<string | null>;
      setDataPath: (dataPath: string) => Promise<boolean>;
      clearDataPath: () => Promise<boolean>;
      selectDataPath: () => Promise<string | null>;
      migrateData: (
        newPath: string,
      ) => Promise<{ success: boolean; message: string }>;
    };
  };
}
