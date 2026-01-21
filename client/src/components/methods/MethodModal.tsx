import React from 'react';
import { Modal, Form, Input } from 'antd';
import { Method } from '../../types';

interface MethodFormValues {
  code: string;
  name: string;
  description: string;
}

interface MethodModalProps {
  visible: boolean;
  title: string;
  confirmLoading: boolean;
  editingMethod?: Method | null;
  onCancel: () => void;
  onOk: (values: MethodFormValues) => Promise<void>;
  form: FormInstance<MethodFormValues>;
}

const MethodModal: React.FC<MethodModalProps> = ({
  visible,
  title,
  confirmLoading,
  onCancel,
  onOk,
  form,
}) => {
  // 提交表单
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onOk(values);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  return (
    <Modal
      title={title}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="保存"
      cancelText="取消"
      destroyOnClose
      confirmLoading={confirmLoading}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
        <Form.Item 
          name="code" 
          label="方法代码" 
          rules={[{ required: true, message: '请输入方法代码' }]}
          tooltip="简短的标识符，如: BO, MTR"
        >
          <Input placeholder="例如: BO" />
        </Form.Item>
        <Form.Item 
          name="name" 
          label="方法名称" 
          rules={[{ required: true, message: '请输入方法名称' }]}
        >
          <Input placeholder="例如: 突破交易法" />
        </Form.Item>
        <Form.Item name="description" label="详细描述">
          <Input.TextArea rows={4} placeholder="描述该方法的入场条件、止损逻辑、止盈目标等..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MethodModal;
