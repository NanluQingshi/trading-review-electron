import React from 'react';
import { Row, Col, Typography, Button, Space, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface TradesHeaderProps {
  onAddTrade: () => void;
  selectedCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBatchDelete: () => void;
}

const TradesHeader: React.FC<TradesHeaderProps> = ({ 
  onAddTrade, 
  selectedCount, 
  onSelectAll, 
  onDeselectAll, 
  onBatchDelete 
}) => {
  return (
    <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
      <Col>
        <Title level={3} style={{ margin: 0 }}>交易复盘</Title>
        <Text type="secondary">记录并分析您的每一笔交易，不断优化交易系统</Text>
        {selectedCount > 0 && (
          <Text type="secondary" style={{ marginLeft: 8 }}>
            已选择 {selectedCount} 项
          </Text>
        )}
      </Col>
      <Col>
        <Space>
          {selectedCount > 0 && (
            <>
              <Button 
                icon={<CheckOutlined />} 
                onClick={onSelectAll}
              >
                全选
              </Button>
              <Button 
                icon={<DeleteOutlined />} 
                onClick={onDeselectAll}
              >
                取消选择
              </Button>
              <Popconfirm
                title="确认删除"
                description={`确定要删除选中的 ${selectedCount} 条交易记录吗？此操作不可恢复。`}
                onConfirm={onBatchDelete}
                okText="删除"
                cancelText="取消"
              >
                <Button danger icon={<DeleteOutlined />}>
                  批量删除
                </Button>
              </Popconfirm>
            </>
          )}
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddTrade} size="large">
            新增交易
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default TradesHeader;