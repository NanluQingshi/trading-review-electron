/*
 * @Author: NanluQingshi
 * @Date: 2026-01-18 01:45:53
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-02-06 20:50:00
 * @Description:
 */
import { useState, useEffect } from "react";
import { message } from "antd";
import { statsApi } from "@/services/api";
import { Stats } from "@/types";

export const useStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  // 获取统计数据
  const fetchStats = async () => {
    setLoading(true);
    try {
      // 获取总体统计数据
      const overallResponse = await statsApi.getStats();
      const overallData = overallResponse.data;

      // 获取方法统计数据
      const methodStatsResponse = await statsApi.getMethodStats();
      const methodStatsData = methodStatsResponse.data;

      // 获取货币对统计数据
      const symbolStatsResponse = await statsApi.getSymbolStats();
      const symbolStatsData = symbolStatsResponse.data;

      // 获取盈利曲线数据
      const profitCurveResponse = await statsApi.getProfitCurve();
      const profitCurveData = profitCurveResponse.data;

      // 转换数据格式以匹配前端期望的类型
      const formattedStats: Stats = {
        overview: {
          totalTrades: overallData?.totalTrades || 0,
          winTrades: overallData?.totalWin || 0,
          lossTrades: overallData?.totalLoss || 0,
          breakevenTrades: overallData?.totalBreakeven || 0,
          winRate: (overallData?.winRate || 0) * 100, // 将小数转换为百分比
          totalProfit: overallData?.totalProfit || 0,
          avgProfit: overallData?.averageProfit || 0,
          avgWin: overallData?.avgWin || 0, // 使用后端返回的avgWin字段
          avgLoss: overallData?.avgLoss || 0, // 使用后端返回的avgLoss字段
          profitFactor: overallData?.profitFactor || 0,
          totalExpectedProfit: overallData?.totalExpectedProfit || 0, // 使用后端返回的totalExpectedProfit字段
          avgExpectedProfit: overallData?.avgExpectedProfit || 0, // 使用后端返回的avgExpectedProfit字段
        },
        symbolStats: symbolStatsData || [],
        methodStats: methodStatsData || [],
        profitCurve: profitCurveData || [],
      };

      setStats(formattedStats);
    } catch (error) {
      message.error("获取统计数据失败");
      console.error("获取统计数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载统计数据
  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    fetchStats,
  };
};
