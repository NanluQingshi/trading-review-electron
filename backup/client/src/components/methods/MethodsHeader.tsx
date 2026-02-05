import React from 'react';
import { Row, Col, Typography, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface MethodsHeaderProps {
  onAddMethod: () => void;
}

const MethodsHeader: React.FC<MethodsHeaderProps> = ({ onAddMethod }) => {
  return (
    <Row justify="space-between" align="middle" style={{ marginBottom: 32 }}>
      <Col>
        <Title level={3} style={{ margin: 0 }}>Method 库</Title>
        <Text type="secondary">定义并管理您的交易系统，追踪每种策略的实战表现</Text>
      </Col>
      <Col>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddMethod} size="large">
          新增方法
        </Button>
      </Col>
    </Row>
  );
};

export default MethodsHeader;
