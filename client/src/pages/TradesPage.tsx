import React, { useState } from 'react';
import { Modal, message } from 'antd';
import { Trades } from '../components';
import { useTrades, useMethods } from '../hooks';
import { Trade } from '../types';

import dayjs from 'dayjs';

interface TradeFormValues {
  symbol: string;
  direction: 'long' | 'short';
  entryPrice?: number | null;
  exitPrice?: number | null;
  entryTime?: dayjs.Dayjs | null;
  exitTime?: dayjs.Dayjs | null;
  lots?: number;
  profit?: number | null;
  expectedProfit?: number;
  methodId: string;
  methodName: string;
  notes?: string;
  tags?: string[];
  result?: 'win' | 'loss' | 'breakeven';
}

interface FilterValues {
  symbol?: string;
  methodId?: string;
  result?: 'win' | 'loss' | 'breakeven';
}

const TradesPage: React.FC = () => {
  // 使用自定义hooks
  const { trades, loading, fetchTrades, createTrade, updateTrade, deleteTrade } = useTrades();
  const { methods } = useMethods();

  // 模态框状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 打开新增交易模态框
  const handleAddTrade = () => {
    setEditingTrade(null);
    setIsModalVisible(true);
  };

  // 打开编辑交易模态框
  const handleEditTrade = (trade: Trade) => {
    setEditingTrade(trade);
    setIsModalVisible(true);
  };

  // 删除交易
  const handleDeleteTrade = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条交易记录吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteTrade(id);
        } catch (error) {
          console.error('Delete Failed:', error);
        }
      },
    });
  };

  // 复制交易
  const handleCopyTrade = (record: Trade) => {
    // 只设置必填字段，其他字段不设置值
    setEditingTrade({
      id: 0, // 新记录
      symbol: record.symbol,
      direction: record.direction,
      methodId: record.methodId,
      methodName: record.methodName,
      tags: [], // 保留空标签数组
    });
    setIsModalVisible(true);
    message.success('已复制交易记录');
  };

  // 提交交易记录
  const handleSubmitTrade = async (values: TradeFormValues) => {
    setConfirmLoading(true);
    try {
      // 格式化日期字段
      const formattedValues = {
        ...values,
        entryTime: values.entryTime && values.entryTime.isValid ? values.entryTime.format('YYYY-MM-DD HH:mm:ss') : null,
        exitTime: values.exitTime && values.exitTime.isValid ? values.exitTime.format('YYYY-MM-DD HH:mm:ss') : null,
      };

      if (editingTrade && editingTrade.id > 0) {
        // 更新交易记录
        await updateTrade(editingTrade.id, formattedValues);
      } else {
        // 创建新交易记录
        await createTrade(formattedValues);
      }
      
      setIsModalVisible(false);
    } catch (error) {
      console.error('Submit Failed:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  // 筛选交易记录
  const handleFilterTrades = (filters: FilterValues) => {
    fetchTrades(filters);
  };

  return (
    <div className="trades-page">
      {/* 页面头部 */}
      <Trades.TradesHeader onAddTrade={handleAddTrade} />

      {/* 筛选表单 */}
      <Trades.TradesFilter methods={methods} onFilter={handleFilterTrades} />

      {/* 交易记录表 */}
      <Trades.TradesTable 
        trades={trades} 
        loading={loading}
        onEdit={handleEditTrade}
        onDelete={handleDeleteTrade}
        onCopy={handleCopyTrade}
      />

      {/* 交易模态框 */}
      <Trades.TradeModal
        visible={isModalVisible}
        title={editingTrade && editingTrade.id > 0 ? '编辑交易记录' : '新增交易记录'}
        methods={methods}
        confirmLoading={confirmLoading}
        editingTrade={editingTrade}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmitTrade}
      />
    </div>
  );
};

export default TradesPage;