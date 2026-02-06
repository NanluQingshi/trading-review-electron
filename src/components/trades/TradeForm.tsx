import React from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Row, Col } from 'antd';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import { Method, Trade } from '@/types';

const { Option } = Select;

interface TradeFormProps {
  form: FormInstance;
  methods: Method[];
  initialValues?: Partial<Trade>;
}

const TradeForm: React.FC<TradeFormProps> = ({ form, methods, initialValues }) => {
  React.useEffect(() => {
    if (initialValues) {
      // 根据initialValues设置表单初始值
      const selectedMethod = methods.find(m => m.id === initialValues.methodId);
      form.setFieldsValue({
        ...initialValues,
        entryTime: initialValues.entryTime ? dayjs(initialValues.entryTime) : undefined,
        exitTime: initialValues.exitTime ? dayjs(initialValues.exitTime) : undefined,
        methodName: selectedMethod ? selectedMethod.name : initialValues.methodName,
      });
    }
  }, [form, methods, initialValues]);

  return (
    <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="symbol" label="交易品种" rules={[{ required: true }]}>
            <Input placeholder="例如: EUR/USD" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="direction" label="交易方向" rules={[{ required: true }]}>
            <Select>
              <Option value="long">做多</Option>
              <Option value="short">做空</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="entryPrice" label="入场价格">
            <InputNumber style={{ width: '100%' }} step={0.0001} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="exitPrice" label="出场价格">
            <InputNumber style={{ width: '100%' }} step={0.0001} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="entryTime" label="入场时间">
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="exitTime" label="出场时间">
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="lots" label="手数">
            <InputNumber style={{ width: '100%' }} step={0.01} min={0.01} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="profit" label="实际盈亏">
            <InputNumber style={{ width: '100%' }} step={10} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="expectedProfit" label="预期盈亏">
            <InputNumber style={{ width: '100%' }} step={10} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="result" label="交易结果">
            <Select>
              <Option value="win">盈利</Option>
              <Option value="loss">亏损</Option>
              <Option value="breakeven">保本</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="methodId" label="交易方法" rules={[{ required: true }]}>
        <Select
          showSearch
          filterOption={(input, option) => {
            const optionLabel = typeof option?.children === 'string' ? option.children : '';
            return optionLabel.toLowerCase().includes(input.toLowerCase());
          }}
          onChange={(value) => {
            // 根据选择的methodId查找对应的methodName
            const selectedMethod = methods.find(m => m.id === value);
            if (selectedMethod) {
              form.setFieldsValue({ methodName: selectedMethod.name });
            }
          }}
        >
          {methods.map(m => <Option key={m.id} value={m.id}>{m.name}</Option>)}
        </Select>
      </Form.Item>
      {/* 隐藏的methodName字段，用于存储交易方法名称 */}
      <Form.Item name="methodName" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="notes" label="交易笔记">
        <Input.TextArea rows={4} placeholder="记录您的入场逻辑、心理状态等..." />
      </Form.Item>
      <Form.Item name="tags" label="标签">
        <Select mode="tags" style={{ width: '100%' }} placeholder="输入标签并回车" />
      </Form.Item>
    </Form>
  );
};

export default TradeForm;