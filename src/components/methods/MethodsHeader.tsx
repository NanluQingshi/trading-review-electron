import React from 'react';
import { Row, Col, Typography, Button, Space, Popconfirm, Input } from 'antd';
import { PlusOutlined, DeleteOutlined, CheckOutlined, SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface MethodsHeaderProps {
  onAddMethod: () => void;
  selectedCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBatchDelete: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const MethodsHeader: React.FC<MethodsHeaderProps> = ({ 
  onAddMethod, 
  selectedCount, 
  onSelectAll, 
  onDeselectAll, 
  onBatchDelete,
  searchValue,
  onSearchChange
}) => {
  return (
    <div className="methods-header">
      <div className="header-content">
        <div className="header-left">
          <Title level={3} className="header-title">Method 库</Title>
          <Text type="secondary" className="header-description">定义并管理您的交易系统，追踪每种策略的实战表现</Text>
          {selectedCount > 0 && (
            <Text type="secondary" className="header-selection-info">
              已选择 {selectedCount} 项
            </Text>
          )}
          <div className="search-container">
            <Input
              placeholder="搜索交易方法..."
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              allowClear
            />
          </div>
        </div>
        <div className="header-actions">
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
        </div>
      </div>
    </div>
  );
};

export default MethodsHeader;
