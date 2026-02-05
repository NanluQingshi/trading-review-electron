import React from 'react';
import { Row, Col, Typography, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface TradesHeaderProps {
  onAddTrade: () => void;
}

const TradesHeader: React.FC<TradesHeaderProps> = ({ onAddTrade }) => {
  return (
    <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
      <Col>
        <Title level={3} style={{ margin: 0 }}>交易复盘</Title>
        <Text type="secondary">记录并分析您的每一笔交易，不断优化交易系统</Text>
      </Col>
      <Col>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddTrade} size="large">
            新增交易
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default TradesHeader;