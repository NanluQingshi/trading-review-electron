import React from 'react';
import { Card } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MethodStat {
  methodName: string;
  profit: number;
}

interface MethodComparisonChartProps {
  methodStats: MethodStat[];
}

const MethodComparisonChart: React.FC<MethodComparisonChartProps> = ({ methodStats }) => {
  return (
    <Card title="各方法盈亏对比">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={methodStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="methodName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="profit" fill="#8884d8" name="总盈亏" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default MethodComparisonChart;
