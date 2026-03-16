/*
 * @Author: NanluQingshi
 * @Date: 2026-02-05 21:57:01
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-03-16 00:00:00
 * @Description: 
 */
import React from 'react';
import { Card, Form, Input, Select, Button, Space, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Method } from '@/types';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface FilterValues {
  symbol?: string;
  methodId?: string;
  result?: 'win' | 'loss' | 'breakeven';
  dateRange?: [moment.Moment, moment.Moment]; // 实际仅在表单内部使用，提交时转换为 startDate/endDate
}

interface TradesFilterProps {
  methods: Method[];
  onFilter: (values: {
    symbol?: string;
    methodId?: string;
    result?: 'win' | 'loss' | 'breakeven';
    startDate?: string;
    endDate?: string;
  }) => void;
}

const TradesFilter: React.FC<TradesFilterProps> = ({ methods, onFilter }) => {
  const [form] = Form.useForm<FilterValues>();

  const handleReset = () => {
    form.resetFields();
    onFilter({});
  };

  const handleFinish = (values: FilterValues) => {
    const { symbol, methodId, result, dateRange } = values;
    let startDate: string | undefined;
    let endDate: string | undefined;

    if (dateRange && dateRange.length === 2) {
      // 转为字符串，后端直接按字符串比较 entryTime
      startDate = dateRange[0].startOf('day').toISOString();
      endDate = dateRange[1].endOf('day').toISOString();
    }

    onFilter({
      symbol,
      methodId,
      result,
      startDate,
      endDate,
    });
  };

  return (
    <Card variant="borderless" style={{ marginBottom: 24, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
      <Form
        form={form}
        layout="inline"
        onFinish={handleFinish}
      >
        <Form.Item name="symbol">
          <Input placeholder="搜索品种" prefix={<SearchOutlined />} allowClear />
        </Form.Item>
        <Form.Item name="methodId">
          <Select placeholder="选择方法" style={{ width: 220 }} allowClear showSearch filterOption={(input, option) => {
            const optionLabel = typeof option?.children === 'string' ? option.children : '';
            return optionLabel.toLowerCase().includes(input.toLowerCase());
          }}>
            {methods.map(m => <Option key={m.id} value={m.id}>{m.name}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="result">
          <Select placeholder="交易结果" style={{ width: 120 }} allowClear>
            <Option value="win">盈利</Option>
            <Option value="loss">亏损</Option>
            <Option value="breakeven">保本</Option>
          </Select>
        </Form.Item>
        <Form.Item name="dateRange">
          <RangePicker
            allowClear
            style={{ width: 260 }}
            placeholder={['开始日期', '结束日期']}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">筛选</Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default TradesFilter;