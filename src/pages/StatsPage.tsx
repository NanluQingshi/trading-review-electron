/*
 * @Author: NanluQingshi
 * @Date: 2026-01-17 23:32:05
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-02-05 23:10:15
 * @Description: 
 */
import React from 'react';
import { Spin, Empty } from 'antd';
import { Stats } from '@/components';
import { useStats } from '@/hooks';

const StatsPage: React.FC = () => {
  console.log('StatsPage rendered');
  // 使用自定义hooks
  const { stats, loading } = useStats();

  if (loading && !stats) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" tip="加载统计数据中..." />
      </div>
    );
  }

  if (!stats) {
    return <Empty description="暂无统计数据" />;
  }

  const { overview, symbolStats, methodStats, profitCurve } = stats;

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>我的统计</h1>

      {/* 核心指标卡片 */}
      <Stats.StatsOverview overview={overview} />

      {/* 详细统计 */}
      <Stats.StatsDetails overview={overview} />

      {/* 盈亏曲线 */}
      <Stats.ProfitCurveChart profitCurve={profitCurve} />

      {/* 货币对统计 */}
      <Stats.SymbolStatsTable symbolStats={symbolStats} />

      {/* 方法统计 */}
      <Stats.MethodStatsTable methodStats={methodStats} />

      {/* 方法盈亏对比 */}
      <Stats.MethodComparisonChart methodStats={methodStats} />
    </div>
  );
};

export default StatsPage;