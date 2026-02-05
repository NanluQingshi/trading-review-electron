import React from 'react';
import { Table, Space, Tag, Typography, Divider, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Trade } from '../../types';

const { Text } = Typography;

interface TradesTableProps {
  trades: Trade[];
  loading: boolean;
  onEdit: (trade: Trade) => void;
  onDelete: (id: number) => void;
  onCopy: (trade: Trade) => void;
}

const TradesTable: React.FC<TradesTableProps> = ({ trades, loading, onEdit, onDelete, onCopy }) => {
  const columns = [
    {
      title: '交易品种',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '方向',
      dataIndex: 'direction',
      key: 'direction',
      render: (direction: string) => (
        <Tag color={direction === 'long' ? 'blue' : 'volcano'}>
          {direction === 'long' ? '做多' : '做空'}
        </Tag>
      ),
    },
    {
      title: '入场/出场价格',
      key: 'prices',
      render: (_: React.ReactNode, record: Trade) => (
        <Space orientation="vertical" size={0}>
          <Text type="secondary" style={{ fontSize: '12px' }}>入: {record.entryPrice !== null ? record.entryPrice : '-'}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>出: {record.exitPrice !== null ? record.exitPrice : '-'}</Text>
        </Space>
      ),
    },
    {
      title: '交易时间',
      key: 'times',
      render: (_: React.ReactNode, record: Trade) => (
        <Space orientation="vertical" size={0}>
          <Text type="secondary" style={{ fontSize: '12px' }}>入: {record.entryTime ? dayjs(record.entryTime).format('YYYY-MM-DD HH:mm') : '-'}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>出: {record.exitTime ? dayjs(record.exitTime).format('YYYY-MM-DD HH:mm') : '-'}</Text>
        </Space>
      ),
    },
    {
      title: '实际盈亏',
      dataIndex: 'profit',
      key: 'profit',
      sorter: (a: Trade, b: Trade) => (a.profit || 0) - (b.profit || 0),
      render: (profit: number | null) => (
        profit !== null ? (
          <Text strong style={{ color: profit > 0 ? '#52c41a' : profit < 0 ? '#f5222d' : '#8c8c8c' }}>
            {profit > 0 ? `+${profit}` : profit}
          </Text>
        ) : (
          '-'  
        )
      ),
    },
    {
      title: '预期盈亏',
      dataIndex: 'expectedProfit',
      key: 'expectedProfit',
      sorter: (a: Trade, b: Trade) => (a.expectedProfit || 0) - (b.expectedProfit || 0),
      render: (expectedProfit: number | undefined) => (
        expectedProfit !== undefined ? (
          <Text style={{ color: expectedProfit > 0 ? '#52c41a' : expectedProfit < 0 ? '#f5222d' : '#8c8c8c' }}>
            {expectedProfit > 0 ? `+${expectedProfit}` : expectedProfit}
          </Text>
        ) : (
          '-'
        )
      ),
    },
    {
      title: '交易方法',
      dataIndex: 'methodName',
      key: 'methodName',
      render: (name: string) => <Tag color="geekblue">{name}</Tag>,
    },
    {
      title: '结果',
      dataIndex: 'result',
      key: 'result',
      filters: [
        { text: '盈利', value: 'win' },
        { text: '亏损', value: 'loss' },
        { text: '保本', value: 'breakeven' },
      ],
      onFilter: (value: string, record: Trade) => record.result === value,
      render: (result: string | null) => {
        if (!result) {
          return '-';
        }
        let color = 'default';
        let text = '保本';
        if (result === 'win') { color = 'success'; text = '盈利'; }
        if (result === 'loss') { color = 'error'; text = '亏损'; }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: React.ReactNode, record: Trade) => (
        <Space size="middle">
          <Tooltip title="编辑">
            <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          </Tooltip>
          <Tooltip title="复制">
            <Button type="text" icon={<CopyOutlined />} onClick={() => onCopy(record)} />
          </Tooltip>
          <Tooltip title="删除">
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(record.id)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={trades} 
      rowKey="id" 
      loading={loading}
      pagination={{
        pageSize: 10,
        showTotal: (total) => `共 ${total} 条记录`,
        showSizeChanger: true,
        showQuickJumper: true
      }}
      expandable={{
        expandedRowRender: record => (
          <div style={{ padding: '8px 24px' }}>
            <Divider plain style={{ textAlign: 'left' }}><Text type="secondary">交易笔记</Text></Divider>
            <p>{record.notes || '暂无笔记'}</p>
            <Divider plain style={{ textAlign: 'left' }}><Text type="secondary">标签</Text></Divider>
            <Space wrap>
              {record.tags?.map(tag => <Tag key={tag}>{tag}</Tag>)}
            </Space>
          </div>
        ),
      }}
    />
  );
};

export default TradesTable;