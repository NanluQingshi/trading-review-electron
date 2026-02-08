import React from 'react';
import { Row, Col, Typography, Button, Space, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface MethodsHeaderProps {
  onAddMethod: () => void;
  selectedCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBatchDelete: () => void;
}

const MethodsHeader: React.FC<MethodsHeaderProps> = ({ 
  onAddMethod, 
  selectedCount, 
  onSelectAll, 
  onDeselectAll, 
  onBatchDelete 
}) => {
  return (
    <Row justify="space-between" align="middle" style={{ marginBottom: 32 }}>
      <Col>
        <Title level={3} style={{ margin: 0 }}>Method 库</Title>
        <Text type="secondary">定义并管理您的交易系统，追踪每种策略的实战表现</Text>
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
                description={`确定要删除选中的 ${selectedCount} 个方法吗？此操作不可恢复。`}
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
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddMethod} size="large">
            新增方法
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default MethodsHeader;
