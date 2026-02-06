import React, { useState } from 'react';
import { 
  Row, 
  Col,
  Form,
  Empty,
  Spin,
  FloatButton
} from 'antd';
import { Methods } from '@/components';
import { useMethods } from '@/hooks';
import { Method } from '@/types';

const MethodsPage: React.FC = () => {
  // 使用自定义hooks
  const { methods, loading, createMethod, updateMethod, deleteMethod } = useMethods();
  
  // 模态框状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMethod, setEditingMethod] = useState<Method | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  // 打开新增方法模态框
  const handleAddMethod = () => {
    setEditingMethod(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 打开编辑方法模态框
  const handleEditMethod = (method: Method) => {
    setEditingMethod(method);
    form.setFieldsValue(method);
    setIsModalVisible(true);
  };

  // 删除方法
  const handleDeleteMethod = async (id: string) => {
    try {
      await deleteMethod(id);
    } catch (error) {
      console.error('Delete Failed:', error);
    }
  };

  // 提交方法表单
  const handleSubmitMethod = async (values: { code: string; name: string; description: string }) => {
    setConfirmLoading(true);
    try {
      if (editingMethod) {
        await updateMethod(editingMethod.id, values);
      } else {
        await createMethod(values);
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="methods-page">
      {/* 页面头部 */}
      <Methods.MethodsHeader onAddMethod={handleAddMethod} />

      <Spin spinning={loading} tip="加载方法库中...">
        <div style={{ minHeight: '400px' }}>
          {methods.length === 0 && !loading ? (
            <Empty description="暂无交易方法，点击右上角新增" style={{ marginTop: 100 }} />
          ) : (
            <Row gutter={[24, 24]}>
              {methods.map((method) => (
                <Col xs={24} sm={12} lg={8} key={method.id}>
                  <Methods.MethodCard 
                    method={method} 
                    onEdit={handleEditMethod} 
                    onDelete={handleDeleteMethod} 
                  />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Spin>

      {/* 方法模态框 */}
      <Methods.MethodModal
        visible={isModalVisible}
        title={editingMethod ? '编辑交易方法' : '新增交易方法'}
        confirmLoading={confirmLoading}
        editingMethod={editingMethod}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmitMethod}
        form={form}
      />

      <FloatButton.BackTop visibilityHeight={200} />
    </div>
  );
};

export default MethodsPage;