import React, { useState } from 'react';
import { 
  Row, 
  Col,
  Form,
  Empty,
  Spin,
  FloatButton,
  Modal,
  message
} from 'antd';
import { Methods } from '@/components';
import { useMethods } from '@/hooks';
import { Method } from '@/types';

const MethodsPage: React.FC = () => {
  // 使用自定义hooks
  const { methods, loading, createMethod, updateMethod, deleteMethod, deleteMethods } = useMethods();
  
  // 模态框状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMethod, setEditingMethod] = useState<Method | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  
  // 批量选择状态
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBatchDeleteModal, setShowBatchDeleteModal] = useState(false);
  
  // 搜索状态
  const [searchValue, setSearchValue] = useState('');
  
  // 处理搜索变化
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };
  
  // 过滤方法
  const filteredMethods = methods.filter(method => {
    if (!searchValue) return true;
    const searchLower = searchValue.toLowerCase();
    return (
      method.name.toLowerCase().includes(searchLower) ||
      method.code.toLowerCase().includes(searchLower) ||
      (method.description && method.description.toLowerCase().includes(searchLower))
    );
  });

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

  // 批量删除方法
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) {
      message.warning('请选择要删除的方法');
      return;
    }
    
    try {
      await deleteMethods(selectedIds);
      setSelectedIds([]);
      // 关闭批量删除确认对话框
      setShowBatchDeleteModal(false);
    } catch (error) {
      console.error('Batch Delete Failed:', error);
    }
  };

  // 选择/取消选择
  const handleSelectMethod = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  // 全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredMethods.map(method => method.id));
    } else {
      setSelectedIds([]);
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
      <Methods.MethodsHeader 
        onAddMethod={handleAddMethod} 
        selectedCount={selectedIds.length}
        onSelectAll={() => handleSelectAll(true)}
        onDeselectAll={() => handleSelectAll(false)}
        onBatchDelete={() => setShowBatchDeleteModal(true)}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
      />

      <Spin spinning={loading} tip="加载方法库中...">
        <div className="methods-content">
          {filteredMethods.length === 0 && !loading ? (
            <Empty 
              description={searchValue ? "没有找到匹配的交易方法" : "暂无交易方法，点击右上角新增"} 
              className="empty-state"
            />
          ) : (
            <Row gutter={[24, 24]}>
              {filteredMethods.map((method) => (
                <Col xs={24} sm={12} lg={8} key={method.id}>
                  <Methods.MethodCard 
                    method={method} 
                    onEdit={handleEditMethod} 
                    onDelete={handleDeleteMethod}
                    selected={selectedIds.includes(method.id)}
                    onSelect={(checked) => handleSelectMethod(method.id, checked)}
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

      {/* 批量删除确认对话框 */}
      <Modal
        title="确认删除"
        open={showBatchDeleteModal}
        onOk={handleBatchDelete}
        onCancel={() => setShowBatchDeleteModal(false)}
        okText="删除"
        cancelText="取消"
      >
        <p>确定要删除选中的 <strong>{selectedIds.length}</strong> 个方法吗？</p>
        <p style={{ color: '#ff4d4f' }}>此操作不可恢复，请谨慎操作。</p>
      </Modal>

      <FloatButton.BackTop visibilityHeight={200} />
    </div>
  );
};

export default MethodsPage;