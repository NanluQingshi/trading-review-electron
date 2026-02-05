/*
 * @Author: NanluQingshi
 * @Date: 2026-01-21 01:39:50
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-01-21 14:36:09
 * @Description:
 */
import axios from "axios";
import { Method, Trade, Stats } from "../types";

// 从环境变量或默认值获取API地址
const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_API_BASE_URL || "http://localhost:5050/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 设置10秒超时
});

// 添加请求重试拦截器
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 如果是网络错误或超时，尝试重试
    if (
      (error.code === "ECONNABORTED" || !error.response) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // 等待1秒后重试
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return api(originalRequest);
    }

    return Promise.reject(error);
  },
);

// Method API
export const methodsApi = {
  getMethods: () =>
    api.get<{ success: boolean; data: Method[] }>("/methods/list"),
  getMethod: (id: string) =>
    api.get<{ success: boolean; data: Method }>(`/methods/detail/${id}`),
  createMethod: (method: Partial<Method>) =>
    api.post<{ success: boolean; data: Method }>("/methods/create", method),
  updateMethod: (id: string, method: Partial<Method>) =>
    api.put<{ success: boolean; data: Method }>(
      `/methods/update/${id}`,
      method,
    ),
  deleteMethod: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/methods/delete/${id}`),
};

// Trade API
export const tradesApi = {
  getTrades: (params?: Record<string, unknown>) =>
    api.get<{ success: boolean; data: Trade[] }>("/trades/list", { params }),

  getTrade: (id: number) =>
    api.get<{ success: boolean; data: Trade }>(`/trades/detail/${id}`),
  createTrade: (trade: Partial<Trade>) =>
    api.post<{ success: boolean; data: Trade }>("/trades/create", trade),
  updateTrade: (id: number, trade: Partial<Trade>) =>
    api.put<{ success: boolean; data: Trade }>(`/trades/update/${id}`, trade),
  deleteTrade: (id: number) =>
    api.delete<{ success: boolean; message: string }>(`/trades/delete/${id}`),
};

// Stats API
export const statsApi = {
  getStats: (params?: Record<string, unknown>) =>
    api.get<{ success: boolean; data: Stats }>("/stats", { params }),
  getRecent: (limit?: number) =>
    api.get<{ success: boolean; data: Trade[] }>("/stats/recent", {
      params: { limit },
    }),
};

export default api;
