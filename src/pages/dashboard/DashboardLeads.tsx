/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboard.service';
import { StatisticCard } from '../../components/crm/StatisticCard';
import { ChartCard } from '../../components/crm/ChartCard';
import { Card } from '../../components/ui';
import { GitBranch, Flame, Users, Sparkles, PhoneCall, Globe, TrendingUp, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export const DashboardLeads: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchLeadsData = async () => {
      setLoading(true);
      try {
        const dbData = await dashboardService.getDashboardData();
        setData(dbData);
      } catch (err) {
        toast.error('Failed to load lead analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeadsData();
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6 text-left p-6">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-28 bg-slate-100 dark:bg-slate-900 rounded-xl animate-pulse" />
          <div className="h-28 bg-slate-100 dark:bg-slate-900 rounded-xl animate-pulse" />
          <div className="h-28 bg-slate-100 dark:bg-slate-900 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const stats = data.statistics;
  const widgets = data.widgets;
  const charts = data.charts;

  // Mock lead source breakdown
  const leadSources = [
    { source: 'Inbound Web Portal', count: 95, percentage: '51%', color: 'bg-indigo-500' },
    { source: 'Outbound Email Sequence', count: 48, percentage: '26%', color: 'bg-teal-500' },
    { source: 'LinkedIn Sales Navigator', count: 28, percentage: '15%', color: 'bg-violet-500' },
    { source: 'Partner Referrals', count: 14, percentage: '8%', color: 'bg-amber-500' }
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <GitBranch className="text-indigo-500 w-5 h-5" /> Lead Funnels & Sourcing
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-light mt-0.5">
            Stage-by-stage pipeline drop-off metrics, acquisition channel counts, and hot follow-up priority logs.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatisticCard 
          title="Leads Captured" 
          value={stats.newLeads.value} 
          growth={stats.newLeads.growth} 
          growthDirection={stats.newLeads.status} 
          icon={<GitBranch className="w-4 h-4 text-indigo-500" />} 
        />
        <StatisticCard 
          title="Conversion Efficiency" 
          value="14.6%" 
          growth={3.2} 
          growthDirection="up" 
          icon={<TrendingUp className="w-4 h-4 text-emerald-500" />} 
        />
        <StatisticCard 
          title="Mean Lead Temperature" 
          value="82/100" 
          growth={2.5} 
          growthDirection="up" 
          icon={<Flame className="w-4 h-4 text-orange-500" />} 
        />
        <StatisticCard 
          title="Active Hot Prospects" 
          value="34" 
          growthDirection="stable" 
          icon={<Users className="w-4 h-4 text-teal-500" />} 
        />
      </div>

      {/* Lead Conversion Funnel and Source Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Stage Progression Funnel"
            subtitle="Representing absolute volumes from initial capture down to final win"
            type="bar"
            data={charts.leadConversion}
            dataKeys={['count']}
            colors={['#4f46e5']}
          />
        </div>

        {/* Lead Inbound Channel Sourcing */}
        <Card variant="glass" className="p-5 border-slate-200/50 dark:border-slate-850 bg-white/50 dark:bg-slate-950/20 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-150/50 dark:border-slate-850/30 pb-3">
            <Globe className="w-4 h-4 text-indigo-500" />
            <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
              Inbound Sourcing Channels
            </h3>
          </div>

          <div className="space-y-4">
            {leadSources.map((src, i) => (
              <div key={i} className="space-y-1 text-xs">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">{src.source}</span>
                  <span className="font-mono">{src.count} ({src.percentage})</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${src.color}`} style={{ width: src.percentage }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Follow-up schedule row and hot leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hot Leads */}
        <Card variant="glass" className="p-5 border-slate-200/50 dark:border-slate-850 bg-white/50 dark:bg-slate-950/20 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-150/50 dark:border-slate-850/30 pb-3">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
              Hot Prospects Priority
            </h3>
          </div>

          <div className="space-y-3.5">
            {widgets.recentLeads?.map((ld: any, i: number) => (
              <div key={i} className="flex justify-between items-center text-left">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{ld.name}</h4>
                  <span className="text-[9px] text-slate-400 font-mono">{ld.company}</span>
                </div>

                <div className="text-right space-y-1">
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded border border-orange-500/15 text-[9px] font-black font-mono uppercase bg-orange-500/5 text-orange-600">
                    Score: {ld.score}
                  </span>
                  <span className="block text-[8px] text-slate-400 font-sans">Owner: {ld.owner}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Calendar / Follow-ups summary */}
        <Card variant="glass" className="p-5 border-slate-200/50 dark:border-slate-850 bg-white/50 dark:bg-slate-950/20 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-150/50 dark:border-slate-850/30 pb-3">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
              Follow-up Schedule Summary
            </h3>
          </div>

          <div className="space-y-3.5 text-xs">
            {widgets.upcomingTasks?.map((tsk: any, i: number) => (
              <div key={i} className="flex justify-between items-start text-left bg-slate-50/20 dark:bg-slate-900/10 p-2.5 rounded-xl border border-slate-150/40 dark:border-slate-850/30">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">{tsk.task}</span>
                  <span className="text-[10px] font-mono text-slate-400">Due: {tsk.due}</span>
                </div>

                <div>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-wider ${
                    tsk.priority === 'high' ? 'bg-rose-500/10 text-rose-600' : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    {tsk.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
