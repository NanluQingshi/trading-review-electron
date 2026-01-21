/*
 * @Author: NanluQingshi
 * @Date: 2026-01-18 01:57:02
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-01-21 14:53:32
 * @Description: 
 */
import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';

interface StatsDetailsProps {
  overview: {
    winTrades: number;
    lossTrades: number;
    avgWin: number;
    avgLoss: number;
  };
}

const StatsDetails: React.FC<StatsDetailsProps> = ({ overview }) => {
  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="盈利交易"
            value={overview?.winTrades || ''}
            styles={{ content: { color: '#3f8600' } }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="亏损交易"
            value={overview?.lossTrades || ''}
            styles={{ content: { color: '#cf1322' } }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="平均盈利"
            value={overview.avgWin}
            precision={2}
            styles={{ content: { color: '#3f8600' } }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="平均亏损"
            value={overview.avgLoss}
            precision={2}
            styles={{ content: { color: '#cf1322' } }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StatsDetails;
