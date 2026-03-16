import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import type { FormInstance } from 'antd/es/form';
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

  // 键盘快捷键：Enter 提交，Esc 取消
  useEffect(() => {
    if (!visible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
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
      onCancel={onCancel}
      okText="保存"
      cancelText="取消"
      destroyOnHidden
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
