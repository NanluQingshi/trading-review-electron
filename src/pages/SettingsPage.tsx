import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Input, message, Modal, Space, Typography, Divider } from 'antd';
import { FolderOutlined, ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const SettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [showMigrateModal, setShowMigrateModal] = useState(false);
  const [pendingPath, setPendingPath] = useState<string>('');

  useEffect(() => {
    loadDataPath();
  }, []);

  const loadDataPath = async () => {
    try {
      const path = await window.electron.settings.getDataPath();
      form.setFieldsValue({ dataPath: path || '' });
    } catch (error) {
      console.error('加载数据路径失败:', error);
      message.error('加载数据路径失败');
    }
  };

  const handleSelectPath = async () => {
    try {
      const path = await window.electron.settings.selectDataPath();
      if (path) {
        form.setFieldsValue({ dataPath: path });
      }
    } catch (error) {
      console.error('选择路径失败:', error);
      message.error('选择路径失败');
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      if (!values.dataPath) {
        await window.electron.settings.clearDataPath();
        message.success('已恢复为默认数据存储位置');
        setShowRestartModal(true);
      } else {
        const currentPath = await window.electron.settings.getDataPath();
        
        if (currentPath && currentPath !== values.dataPath) {
          setPendingPath(values.dataPath);
          setShowMigrateModal(true);
        } else {
          await window.electron.settings.setDataPath(values.dataPath);
          message.success('数据存储位置已保存，请重启应用以使更改生效');
          setShowRestartModal(true);
        }
      }
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleMigrate = async () => {
    try {
      setLoading(true);
      const result = await window.electron.settings.migrateData(pendingPath);
      
      if (result.success) {
        await window.electron.settings.setDataPath(pendingPath);
        message.success('数据迁移成功，请重启应用以使更改生效');
        setShowMigrateModal(false);
        setShowRestartModal(true);
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('数据迁移失败:', error);
      message.error('数据迁移失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>设置</Title>
      
      <Card title="数据存储" style={{ marginBottom: 24 }}>
        <Form form={form} layout="vertical">
          <Form.Item
            label="数据存储位置"
            name="dataPath"
            tooltip="选择自定义的数据存储位置，留空则使用系统默认位置"
          >
            <Input
              placeholder="使用默认位置"
              suffix={
                <Button
                  type="text"
                  icon={<FolderOutlined />}
                  onClick={handleSelectPath}
                >
                  选择文件夹
                </Button>
              }
              readOnly
            />
          </Form.Item>
          
          <Paragraph type="secondary" style={{ marginTop: 16 }}>
            <ExclamationCircleOutlined /> 注意事项：
          </Paragraph>
          <ul style={{ color: '#8c8c8c', marginLeft: 20 }}>
            <li>更改数据存储位置后，应用需要重启才能生效</li>
            <li>如果新位置已有数据，将使用新位置的数据</li>
            <li>建议选择有足够空间的磁盘位置</li>
            <li>请确保选择的路径有读写权限</li>
          </ul>
        </Form>
        
        <Divider />
        
        <Space>
          <Button
            type="primary"
            onClick={handleSave}
            loading={loading}
          >
            保存设置
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={loadDataPath}
          >
            重新加载
          </Button>
        </Space>
      </Card>

      <Card title="关于" style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="small">
          <Text>应用名称：TradingReview</Text>
          <Text>版本：1.0.0</Text>
          <Text>开发者：NanluQingshi</Text>
          <Text>邮箱：nanluqingshi@gmail.com</Text>
        </Space>
      </Card>

      <Modal
        title="重启应用"
        open={showRestartModal}
        onOk={handleRestart}
        onCancel={() => setShowRestartModal(false)}
        okText="立即重启"
        cancelText="稍后重启"
      >
        <p>数据存储位置已更改，需要重启应用才能使更改生效。</p>
        <p>是否立即重启应用？</p>
      </Modal>

      <Modal
        title="数据迁移"
        open={showMigrateModal}
        onOk={handleMigrate}
        onCancel={() => setShowMigrateModal(false)}
        okText="开始迁移"
        cancelText="取消"
        okButtonProps={{ loading: loading }}
      >
        <p>检测到您更改了数据存储位置。</p>
        <p>是否要将现有数据迁移到新位置？</p>
        <p style={{ color: '#faad14', marginTop: 16 }}>
          <ExclamationCircleOutlined /> 注意：迁移过程中请勿关闭应用
        </p>
      </Modal>
    </div>
  );
};

export default SettingsPage;