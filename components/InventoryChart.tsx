import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { InventoryItem } from '../types';

interface InventoryChartProps {
  data: InventoryItem[];
}

export const InventoryChart: React.FC<InventoryChartProps> = ({ data }) => {
  
  const getBarColor = (status: string) => {
    switch (status) {
      case 'Critical': return '#f43f5e'; // rose-500
      case 'Low': return '#fbbf24'; // amber-400
      case 'Good': return '#34d399'; // emerald-400
      default: return '#6366f1'; // indigo-500
    }
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            cursor={{fill: 'rgba(255,255,255,0.05)'}}
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#f8fafc'
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
