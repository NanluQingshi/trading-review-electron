/*
 * @Author: NanluQingshi
 * @Date: 2026-02-05 21:57:01
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-02-05 22:43:49
 * @Description: 
 */
import React from 'react';
import { Card, Table } from 'antd';

interface MethodStat {
  methodId: string;
  methodName: string;
  totalTrades: number;
  winCount: number;
  totalProfit: number;
  expectedProfit: number;
  winRate: string;
}

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
      render: (rate: string) => `${rate}%`,
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
      dataIndex: 'expectedProfit',
      key: 'expectedProfit',
      render: (expectedProfit: number) => (
        <span className={expectedProfit > 0 ? 'profit-positive' : expectedProfit < 0 ? 'profit-negative' : 'profit-neutral'}>
          {expectedProfit > 0 ? '+' : ''}{expectedProfit}
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
