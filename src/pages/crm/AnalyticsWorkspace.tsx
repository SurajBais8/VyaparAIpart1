/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChartCard } from '../../components/crm/ChartCard';
import { Card } from '../../components/ui';
import { LineChart, BarChart2, Star, TrendingUp, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const AnalyticsWorkspace: React.FC = () => {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
          <LineChart className="w-5 h-5 text-indigo-500" /> Lead Conversion Analytics
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-light mt-0.5">
          Evaluate overall sales performance ratios, team pipeline distribution, and funnel drop-offs.
        </p>
      </div>

      {/* Conversion rates grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card variant="glass" className="p-5 border border-slate-200/50 dark:border-slate-850 space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-400 font-mono">Inbound Conversion Ratio</span>
          <div className="text-xl font-black text-indigo-600 font-mono">68.4%</div>
          <p className="text-[10px] text-slate-400">Average of 124 leads converted from website forms.</p>
        </Card>
        <Card variant="glass" className="p-5 border border-slate-200/50 dark:border-slate-850 space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-400 font-mono">Outbound Conversion Ratio</span>
          <div className="text-xl font-black text-violet-600 font-mono">42.1%</div>
          <p className="text-[10px] text-slate-400">Average of 34 accounts signed from outbound cold outreach.</p>
        </Card>
        <Card variant="glass" className="p-5 border border-slate-200/50 dark:border-slate-850 space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-400 font-mono">Average Deal Velocity</span>
          <div className="text-xl font-black text-emerald-600 font-mono">18 Days</div>
          <p className="text-[10px] text-slate-400">Time from capture in Kanban pipeline to closed contract.</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Acquisitions Flow Forecast"
          subtitle="Interactive line charts comparing expected contract values vs reality"
          type="line"
          data={[
            { month: 'Jan', active: 30, new: 15 },
            { month: 'Feb', active: 45, new: 24 },
            { month: 'Mar', active: 55, new: 30 },
            { month: 'Apr', active: 70, new: 45 },
            { month: 'May', active: 85, new: 55 },
            { month: 'Jun', active: 110, new: 75 }
          ]}
          dataKeys={['active', 'new']}
          colors={['#4f46e5', '#f59e0b']}
          onRefresh={() => toast.success('Forecast lines parsed successfully.')}
        />

        <ChartCard
          title="Team Pipeline Allocations"
          subtitle="Active deals managed across executive managers"
          type="bar"
          data={[
            { month: 'John Doe', active: 450000, new: 120000 },
            { month: 'Sarah Smith', active: 620000, new: 230000 },
            { month: 'Amit Roy', active: 380000, new: 90000 },
            { month: 'Sneha Iyer', active: 510000, new: 180000 }
          ]}
          dataKeys={['active', 'new']}
          colors={['#10b981', '#6366f1']}
          onRefresh={() => toast.success('Team metrics parsed.')}
        />
      </div>

    </div>
  );
};
