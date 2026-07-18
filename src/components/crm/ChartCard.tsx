/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Card } from '../ui';
import { Calendar, Download, RefreshCw } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  data: any[];
  type: 'area' | 'bar' | 'line' | 'pie' | 'funnel';
  dataKeys: string[];
  colors?: string[];
  height?: number;
  onRefresh?: () => void;
  onRangeChange?: (range: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom') => void;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  data,
  type,
  dataKeys,
  colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'],
  height = 300,
  onRefresh,
  onRangeChange
}) => {
  const [activeRange, setActiveRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'>('monthly');
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customStart, setCustomStart] = useState('2026-07-01');
  const [customEnd, setCustomEnd] = useState('2026-07-18');

  const handleRangeSelect = (range: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom') => {
    setActiveRange(range);
    if (range === 'custom') {
      setShowCustomPicker(true);
    } else {
      setShowCustomPicker(false);
    }
    if (onRangeChange) {
      onRangeChange(range);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCustomPicker(false);
    if (onRangeChange) {
      onRangeChange('custom');
    }
  };

  const renderChart = () => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-xs text-slate-400 italic">
          No chart data available for this range.
        </div>
      );
    }

    switch (type) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {dataKeys.map((key, i) => (
                  <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors[i] || '#4f46e5'} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={colors[i] || '#4f46e5'} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-900" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '11px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              {dataKeys.map((key, i) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[i] || '#4f46e5'}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#gradient-${key})`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-900" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '11px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              {dataKeys.map((key, i) => (
                <Bar key={key} dataKey={key} fill={colors[i] || '#4f46e5'} radius={[4, 4, 0, 0]} barSize={20} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '11px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'line':
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-900" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '11px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              {dataKeys.map((key, i) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[i] || '#4f46e5'}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card variant="glass" className="p-5 flex flex-col justify-between h-full relative overflow-visible">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="text-left">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">{title}</h3>
          {subtitle && <p className="text-[10px] text-slate-400 font-light mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg flex items-center border border-slate-200/50 dark:border-slate-800/60 text-[10px] font-bold">
            {(['daily', 'weekly', 'monthly', 'yearly', 'custom'] as const).map((r) => (
              <button
                key={r}
                onClick={() => handleRangeSelect(r)}
                className={`px-2.5 py-1 rounded-md capitalize transition-all duration-300 cursor-pointer ${activeRange === r ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
              >
                {r}
              </button>
            ))}
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Custom Picker Modal Popup */}
      {showCustomPicker && (
        <div className="absolute top-14 right-5 z-20 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl p-4 text-left w-64">
          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 font-mono flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Select Range
            </span>
            <div className="space-y-2">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase">Start Date</label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full text-xs p-1.5 border border-slate-200 dark:border-slate-800 rounded bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase">End Date</label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full text-xs p-1.5 border border-slate-200 dark:border-slate-800 rounded bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg cursor-pointer transition-all duration-300"
            >
              Apply Filter
            </button>
          </form>
        </div>
      )}

      {/* Chart Canvas Area */}
      <div className="flex-grow min-h-[220px] pt-2" style={{ height: `${height}px` }}>
        {renderChart()}
      </div>
    </Card>
  );
};
