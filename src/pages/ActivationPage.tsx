/*
 * @Author: 南路情诗
 * @Description: 激活页面 - 首次使用需联网验证激活码，激活后可离线使用
 */
import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Typography, Space, Spin } from 'antd';
import { SafetyCertificateOutlined, KeyOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface ActivationPageProps {
  onActivated: () => void;
}

const ActivationPage: React.FC<ActivationPageProps> = ({ onActivated }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const result = await window.electron.activation.verify(values.code);
      if (result.success) {
        message.success(result.message);
        onActivated();
      } else {
        message.error(result.message);
      }
    } catch (error) {
      // 表单校验失败
      if (error && typeof error === 'object' && 'errorFields' in error) {
        return;
      }
      message.error('激活失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 24,
      }}
    >
      <Card
        style={{
          maxWidth: 420,
          width: '100%',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          borderRadius: 12,
        }}
      >
        <Spin spinning={loading} tip="验证中，请稍候...">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <SafetyCertificateOutlined
              style={{ fontSize: 48, color: '#1677ff', marginBottom: 16 }}
            />
            <Title level={2} style={{ marginBottom: 8 }}>
              激活 TradingReview
            </Title>
            <Paragraph type="secondary" style={{ marginBottom: 0 }}>
              请输入您的激活码完成激活。激活成功后即可离线使用本应用。
            </Paragraph>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="code"
              rules={[
                { required: true, message: '请输入激活码' },
                { whitespace: true, message: '激活码不能为空' },
              ]}
            >
              <Input
                prefix={<KeyOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="请输入激活码"
                size="large"
                autoComplete="off"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                block
              >
                激活
              </Button>
            </Form.Item>
          </Form>

          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
            激活需要联网验证，激活码仅可使用一次。如有问题请联系：
            nanluqingshi@gmail.com
          </Text>
        </Space>
        </Spin>
      </Card>
    </div>
  );
};

export default ActivationPage;
