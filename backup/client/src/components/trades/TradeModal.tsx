import React from 'react';
import { Modal, Form } from 'antd';
import { Method, Trade } from '../../types';
import TradeForm from './TradeForm';

interface TradeFormValues {
  symbol: string;
  direction: 'long' | 'short';
  entryPrice?: number | null;
  exitPrice?: number | null;
  entryTime?: string | null;
  exitTime?: string | null;
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