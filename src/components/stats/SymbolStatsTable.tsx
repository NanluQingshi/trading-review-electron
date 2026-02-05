import React from 'react';
import { Card, Table } from 'antd';

interface SymbolStat {
  symbol: string;
  count: number;
  wins: number;
  profit: number;
  expectedProfit: number;
  winRate: string;
}

interface SymbolStatsTableProps {
  symbolStats: SymbolStat[];
}

const SymbolStatsTable: React.FC<SymbolStatsTableProps> = ({ symbolStats }) => {
  const columns = [
    {
      title: '货币对',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: '交易次数',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '盈利次数',
      dataIndex: 'wins',
      key: 'wins',
    },
    {
      title: '胜率',
      dataIndex: 'winRate',
      key: 'winRate',
      render: (rate: string) => `${rate}%`,
    },
    {
      title: '总盈亏',
      dataIndex: 'profit',
      key: 'profit',
      render: (profit: number) => (
        <span className={profit > 0 ? 'profit-positive' : profit < 0 ? 'profit-negative' : 'profit-neutral'}>
          {profit > 0 ? '+' : ''}{profit}
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
    <Card title="货币对统计" style={{ marginBottom: 24 }}>
      <Table
        columns={columns}
        dataSource={symbolStats}
        rowKey="symbol"
        pagination={false}
        size="small"
      />
    </Card>
  );
};

export default SymbolStatsTable;
