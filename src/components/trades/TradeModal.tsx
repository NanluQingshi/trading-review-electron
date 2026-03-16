/*
 * @Author: NanluQingshi
 * @Date: 2026-02-05 21:57:01
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-02-06 21:31:11
 * @Description: 
 */
import React, { useEffect } from 'react';
import { Modal, Form } from 'antd';
import dayjs from 'dayjs';
import { Method, Trade } from '@/types';
import TradeForm from './TradeForm';

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

interface TradeModalProps {
  visible: boolean;
  title: string;
  methods: Method[];
  confirmLoading: boolean;
  editingTrade?: Trade | null;
  onCancel: () => void;
  onOk: (values: TradeFormValues) => Promise<void>;
}

const TradeModal: React.FC<TradeModalProps> = ({
  visible,
  title,
  methods,
  confirmLoading,
  editingTrade,
  onCancel,
  onOk,
}) => {
  const [form] = Form.useForm();

  // 重置表单
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // 提交表单
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onOk(values);
      form.resetFields();
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  // 键盘快捷键：Enter 提交，Esc 取消
  useEffect(() => {
    if (!visible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleOk();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible]);

  return (
    <Modal
      title={title}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      okText="保存"
      cancelText="取消"
      styles={{ body: { maxHeight: '70vh', overflowY: 'auto', overflowX: 'hidden' } }}
      confirmLoading={confirmLoading}
    >
      <TradeForm
        form={form}
        methods={methods}
        initialValues={editingTrade || undefined}
      />
    </Modal>
  );
};

export default TradeModal;