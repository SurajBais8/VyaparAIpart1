/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface AttendanceChartProps {
  id?: string;
}

export const AttendanceChart: React.FC<AttendanceChartProps> = ({ id }) => {
  // Hardcoded trend representing historical attendance ratios
  const data = [
    { date: 'Jul 12', rate: 82, overtime: 4.5 },
    { date: 'Jul 13', rate: 88, overtime: 6.2 },
    { date: 'Jul 14', rate: 95, overtime: 7.8 },
    { date: 'Jul 15', rate: 90, overtime: 5.0 },
    { date: 'Jul 16', rate: 94, overtime: 8.5 },
    { date: 'Jul 17', rate: 92, overtime: 12.0 },
    { date: 'Jul 18', rate: 96, overtime: 9.2 }
  ];

  return (
    <div id={id || 'attendance-chart-wrapper'} className="h-64 w-full select-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="attRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="attOvertime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
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
          <Area 
            name="Attendance Today (%)" 
            type="monotone" 
            dataKey="rate" 
            stroke="#4f46e5" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#attRate)" 
          />
          <Area 
            name="Accumulated Overtime (h)" 
            type="monotone" 
            dataKey="overtime" 
            stroke="#10b981" 
            strokeWidth={1.5}
            fillOpacity={1} 
            fill="url(#attOvertime)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
