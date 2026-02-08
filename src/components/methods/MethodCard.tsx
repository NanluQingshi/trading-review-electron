/*
 * @Author: NanluQingshi
 * @Date: 2026-02-05 21:57:01
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-02-06 21:22:42
 * @Description: 方法卡片组件
 */
import React from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Tag, 
  Statistic, 
  Space, 
  Tooltip, 
  Popconfirm,
  Checkbox
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  BookOutlined, 
  ThunderboltOutlined, 
  PercentageOutlined 
} from '@ant-design/icons';
import { Method } from '../../types';

const { Title, Paragraph } = Typography;

interface MethodCardProps {
  method: Method;
  onEdit: (method: Method) => void;
  onDelete: (id: string) => void;
  selected: boolean;
  onSelect: (checked: boolean) => void;
}

const MethodCard: React.FC<MethodCardProps> = ({ method, onEdit, onDelete, selected, onSelect }) => {
  return (
    <Card 
      hoverable
      actions={[
        <Checkbox 
          key="select" 
          checked={selected}
          onChange={(e) => onSelect(e.target.checked)}
        />,
        <Tooltip title="编辑"><EditOutlined key="edit" onClick={() => onEdit(method)} /></Tooltip>,
        <Popconfirm title="确定删除吗？" onConfirm={() => onDelete(method.id)}>
          <Tooltip title="删除"><DeleteOutlined key="delete" style={{ color: '#ff4d4f' }} /></Tooltip>
        </Popconfirm>
      ]}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      styles={{ body: { flex: 1 } }}
    >
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Space orientation="vertical" size={0}>
          <Tag color="blue" style={{ marginBottom: 8 }}>{method.code}</Tag>
          <Title level={4} style={{ margin: 0 }}>{method.name}</Title>
        </Space>
        <BookOutlined style={{ fontSize: 24, color: '#bfbfbf' }} />
      </div>
      
      <Paragraph ellipsis={{ rows: 3 }} type="secondary" style={{ height: 66 }}>
        {method.description || '暂无描述'}
      </Paragraph>

      <div style={{ 
        background: '#fafafa', 
        padding: '12px', 
        borderRadius: '8px',
        marginTop: 'auto'
      }}>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic 
              title="使用次数" 
              value={method.usage_count} 
              styles={{ content: { fontSize: 18 } }}
              prefix={<ThunderboltOutlined style={{ fontSize: 14 }} />}
            />
          </Col>
          <Col span={12}>
            <Statistic 
              title="胜率" 
              value={method.win_rate * 100} 
              precision={1}
              suffix="%"
              styles={{ content: { fontSize: 18, color: method.win_rate >= 0.5 ? '#52c41a' : '#faad14' } }}
              prefix={<PercentageOutlined style={{ fontSize: 14 }} />}
            />
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default MethodCard;
