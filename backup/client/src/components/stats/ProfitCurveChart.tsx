import React from 'react';
import { Card } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProfitCurveChartProps {
  profitCurve: {
    date: string;
    profit: number;
    cumulative: number;
  }[];
}

const ProfitCurveChart: React.FC<ProfitCurveChartProps> = ({ profitCurve }) => {
  return (
    <Card title="累计盈亏曲线" style={{ marginBottom: 24 }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={profitCurve}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="cumulative" stroke="#8884d8" name="累计盈亏" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ProfitCurveChart;
