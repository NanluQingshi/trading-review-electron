import { useState, useEffect } from "react";
import { message } from "antd";
import { tradesApi } from "../services/api";
import { Trade } from "../types";

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取交易记录列表
  const fetchTrades = async (params = {}) => {
    setLoading(true);
    try {
      const response = await tradesApi.getTrades(params);
      setTrades(response.data.data);
    } catch (error) {
      message.error("获取交易记录失败");
    } finally {
      setLoading(false);
    }
  };

  // 创建交易记录
  const createTrade = async (tradeData: Partial<Trade>) => {
    try {
      const response = await tradesApi.createTrade(tradeData);
      message.success("创建成功");
      fetchTrades();
      return response.data.data;
    } catch (error) {
      message.error("创建失败");
      throw error;
    }
  };

  // 更新交易记录
  const updateTrade = async (id: number, tradeData: Partial<Trade>) => {
    try {
      const response = await tradesApi.updateTrade(id, tradeData);
      message.success("更新成功");
      fetchTrades();
      return response.data.data;
    } catch (error) {
      message.error("更新失败");
      throw error;
    }
  };

  // 删除交易记录
  const deleteTrade = async (id: number) => {
    try {
      await tradesApi.deleteTrade(id);
      message.success("删除成功");
      fetchTrades();
    } catch (error) {
      message.error("删除失败");
      throw error;
    }
  };

  // 初始加载交易记录
  useEffect(() => {
    fetchTrades();
  }, []);

  return {
    trades,
    loading,
    fetchTrades,
    createTrade,
    updateTrade,
    deleteTrade,
  };
};
