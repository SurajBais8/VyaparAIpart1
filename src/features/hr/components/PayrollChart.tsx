/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface PayrollChartProps {
  id?: string;
}

export const PayrollChart: React.FC<PayrollChartProps> = ({ id }) => {
  const data = [
    { month: 'Mar 26', Basic: 420000, Allowances: 75000, Bonus: 25000, Tax: 62000, Deductions: 18000 },
    { month: 'Apr 26', Basic: 450000, Allowances: 80000, Bonus: 35000, Tax: 68000, Deductions: 19000 },
    { month: 'May 26', Basic: 480000, Allowances: 85000, Bonus: 40000, Tax: 74000, Deductions: 21000 },
    { month: 'Jun 26', Basic: 510000, Allowances: 90000, Bonus: 55000, Tax: 82000, Deductions: 24000 },
    { month: 'Jul 26', Basic: 540000, Allowances: 95000, Bonus: 60000, Tax: 88000, Deductions: 25000 }
  ];

  return (
    <div id={id || 'payroll-chart-wrapper'} className="h-64 w-full select-none">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono', fill: '#94a3b8' }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 9, fontFamily: 'JetBrains Mono', fill: '#94a3b8' }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              borderColor: '#e2e8f0', 
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              fontFamily: 'Inter',
              fontSize: '11px',
              textAlign: 'left'
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '10px', fontFamily: 'Inter', marginTop: '10px' }}
            iconType="circle"
          />
          <Bar dataKey="Basic" stackId="a" fill="#4f46e5" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Allowances" stackId="a" fill="#3b82f6" />
          <Bar dataKey="Bonus" stackId="a" fill="#10b981" />
          <Bar dataKey="Tax" stackId="a" fill="#f59e0b" />
          <Bar dataKey="Deductions" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
