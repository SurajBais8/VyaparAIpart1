/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from 'recharts';

interface MarketingChartProps {
  type: 'channel' | 'campaign' | 'lead' | 'engagement';
  data: any[];
}

export function MarketingChart({ type, data }: MarketingChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center font-mono text-xs text-slate-400">
        No active analytics stream logs found.
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'channel' ? (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontClassName="font-mono" />
            <YAxis stroke="#94a3b8" fontSize={10} fontClassName="font-mono" />
            <Tooltip contentStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
            <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
            <Bar dataKey="sent" name="Sent Packets" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="opened" name="Opened Packets" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="clicked" name="Click Rate" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : type === 'campaign' ? (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
            <YAxis stroke="#94a3b8" fontSize={10} />
            <Tooltip contentStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
            <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
            <Bar dataKey="leads" name="Leads Generated" fill="#a855f7" radius={[4, 4, 0, 0]} />
            <Bar dataKey="conversions" name="Conversions Committed" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : type === 'lead' ? (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
            <YAxis stroke="#94a3b8" fontSize={10} />
            <Tooltip contentStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
            <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
            <Area type="monotone" dataKey="leads" name="Leads Captured" stroke="#6366f1" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={2} />
            <Area type="monotone" dataKey="conversions" name="Direct Conversions" stroke="#10b981" fillOpacity={1} fill="url(#colorConv)" strokeWidth={2} />
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
            <YAxis stroke="#94a3b8" fontSize={10} />
            <Tooltip contentStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
            <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
            <Line type="monotone" dataKey="email" name="Email Traffic" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="whatsapp" name="WhatsApp Traffic" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="sms" name="SMS Traffic" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
