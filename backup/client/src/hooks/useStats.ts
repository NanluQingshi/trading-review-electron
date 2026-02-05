/*
 * @Author: NanluQingshi
 * @Date: 2026-01-18 01:45:53
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-01-18 01:55:30
 * @Description: 
 */
import { useState, useEffect } from 'react';
import { message } from 'antd';
import { statsApi } from '../services/api';
import { Stats } from '../types';

export const useStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  // 获取统计数据
  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await statsApi.getStats();
      setStats(response.data.data);
    } catch (error) {
      message.error('获取统计数据失败');
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
    fetchStats
  };
};
