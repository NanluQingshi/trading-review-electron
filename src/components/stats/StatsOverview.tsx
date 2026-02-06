/*
 * @Author: NanluQingshi
 * @Date: 2026-02-05 21:57:01
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-02-06 16:07:15
 * @Description: 
 */
import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, TrophyOutlined, DollarOutlined } from '@ant-design/icons';

interface StatsOverviewProps {
  overview: {
    totalTrades: number;
    winRate: number;
    totalProfit: number;
    profitFactor: number;
    totalExpectedProfit: number;
    avgExpectedProfit: number;
  };
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ overview }) => {
  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="总交易次数"
            value={overview?.totalTrades}
            prefix={<TrophyOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="胜率"
            value={overview.winRate}
            precision={2}
            suffix="%"
            styles={{ content: { color: overview.winRate >= 50 ? '#3f8600' : '#cf1322' } }}
            prefix={overview.winRate >= 50 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="总盈亏"
            value={overview.totalProfit}
            precision={2}
            styles={{ content: { color: overview.totalProfit >= 0 ? '#3f8600' : '#cf1322' } }}
            prefix={<DollarOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="盈亏因子"
            value={overview.profitFactor}
            precision={2}
            styles={{ content: { color: overview.profitFactor >= 1 ? '#3f8600' : '#cf1322' } }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="总预期盈亏"
            value={overview.totalExpectedProfit}
            precision={2}
            styles={{ content: { color: overview.totalExpectedProfit >= 0 ? '#3f8600' : '#cf1322' } }}
            prefix={<DollarOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="平均预期盈亏"
            value={overview.avgExpectedProfit}
            precision={2}
            styles={{ content: { color: overview.avgExpectedProfit >= 0 ? '#3f8600' : '#cf1322' } }}
            prefix={<DollarOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StatsOverview;
