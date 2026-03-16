/*
 * @Author: NanluQingshi
 * @Date: 2026-02-06 15:25:31
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-02-06 20:03:53
 * @Description:
 */
import { useState, useEffect } from "react";
import { message } from "antd";
import { tradesApi } from "@/services/api";
import { Trade } from "@/types";

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取交易记录列表
  const fetchTrades = async (params = {}) => {
    setLoading(true);
    try {
      const response = await tradesApi.getTrades(params);
      setTrades(
        response.success && Array.isArray(response.data)
          ? response.data
          : [],
      );
    } catch (error) {
      message.error("获取交易记录失败");
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  // 创建交易记录
  const createTrade = async (tradeData: Partial<Trade>) => {
    try {
      const response = await tradesApi.createTrade(tradeData);
      if (response && response.success) {
        message.success("创建成功");
        fetchTrades();
        return response.data;
      }
      const msg = response?.message || "创建失败";
      message.error(msg);
      throw new Error(msg);
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || "创建失败");
      } else {
        message.error("创建失败");
      }
      throw error;
    }
  };

  // 更新交易记录
  const updateTrade = async (id: number, tradeData: Partial<Trade>) => {
    try {
      const response = await tradesApi.updateTrade(id, tradeData);
      if (response && response.success) {
        message.success("更新成功");
        fetchTrades();
        return response.data;
      }
      const msg = response?.message || "更新失败";
      message.error(msg);
      throw new Error(msg);
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || "更新失败");
      } else {
        message.error("更新失败");
      }
      throw error;
    }
  };

  // 删除交易记录
  const deleteTrade = async (id: number) => {
    try {
      const response = await tradesApi.deleteTrade(id);
      if (response && response.success) {
        message.success(response.message || "删除成功");
        fetchTrades();
      } else {
        const msg = response?.message || "删除失败";
        message.error(msg);
        throw new Error(msg);
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || "删除失败");
      } else {
        message.error("删除失败");
      }
      throw error;
    }
  };

  // 初始加载交易记录
  useEffect(() => {
    fetchTrades();
  }, []);

  // 批量删除交易记录
  const deleteTrades = async (ids: number[]) => {
    try {
      const response = await tradesApi.deleteTrades(ids);
      if (response && response.success) {
        message.success(`成功删除 ${response.count || 0} 条交易记录`);
        fetchTrades();
      } else {
        message.error(response?.message || '批量删除失败');
        throw new Error('批量删除失败');
      }
    } catch (error) {
      message.error('批量删除失败');
      throw error;
    }
  };

  return {
    trades,
    loading,
    fetchTrades,
    createTrade,
    updateTrade,
    deleteTrade,
    deleteTrades,
  };
};
