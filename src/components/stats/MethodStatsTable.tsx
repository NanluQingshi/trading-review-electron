import React from 'react';
import { Card, Table } from 'antd';
import { MethodStat } from '@/types';

interface MethodStatsTableProps {
  methodStats: MethodStat[];
}

const MethodStatsTable: React.FC<MethodStatsTableProps> = ({ methodStats }) => {
  const columns = [
    {
      title: '方法名称',
      dataIndex: 'methodName',
      key: 'methodName',
    },
    {
      title: '使用次数',
      dataIndex: 'totalTrades',
      key: 'totalTrades',
    },
    {
      title: '盈利次数',
      dataIndex: 'winCount',
      key: 'winCount',
    },
    {
      title: '胜率',
      dataIndex: 'winRate',
      key: 'winRate',
      render: (rate: number) => `${(rate * 100).toFixed(2)}%`,
    },
    {
      title: '总盈亏',
      dataIndex: 'totalProfit',
      key: 'totalProfit',
      render: (totalProfit: number) => (
        <span className={totalProfit > 0 ? 'profit-positive' : totalProfit < 0 ? 'profit-negative' : 'profit-neutral'}>
          {totalProfit > 0 ? '+' : ''}{totalProfit}
        </span>
      ),
    },
    {
      title: '总预期盈亏',
      dataIndex: 'totalExpectedProfit',
      key: 'totalExpectedProfit',
      render: (totalExpectedProfit: number) => (
        <span className={totalExpectedProfit > 0 ? 'profit-positive' : totalExpectedProfit < 0 ? 'profit-negative' : 'profit-neutral'}>
          {totalExpectedProfit > 0 ? '+' : ''}{totalExpectedProfit}
        </span>
      ),
    },
  ];

  return (
    <Card title="方法统计" style={{ marginBottom: 24 }}>
      <Table
        columns={columns}
        dataSource={methodStats}
        rowKey="methodId"
        pagination={false}
        size="small"
      />
    </Card>
  );
};

export default MethodStatsTable;
