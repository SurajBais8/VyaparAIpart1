import React from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

interface ForecastChartProps {
  data: any[];
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  const formatCurrency = (val: number) => {
    return `₹${(val / 1000).toFixed(0)}k`;
  };

  return (
    <div className="w-full bg-white dark:bg-slate-950 p-4 border border-slate-200/60 dark:border-slate-850/60 rounded-2xl">
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="period" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip 
            formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, '']}
            contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }} 
          />
          <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
          <Area type="monotone" name="Actual Performance" dataKey="revenueActual" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorActual)" />
          <Line type="monotone" name="AI Projected Trend" dataKey="revenuePredicted" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
