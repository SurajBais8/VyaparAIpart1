/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboard.service';
import { leadService } from '../../services/lead.service';
import { StatisticCard } from '../../components/crm/StatisticCard';
import { ChartCard } from '../../components/crm/ChartCard';
import { Card } from '../../components/ui';
import { GitBranch, TrendingUp, Users, Clock, ArrowLeft, BarChart3, Star, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const LeadAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const dbData = await dashboardService.getDashboardData();
        setAnalytics(dbData);
      } catch (err) {
        toast.error('Failed to load lead analytics metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="space-y-6 text-left p-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="grid grid-cols-4 gap-4">
          <div className="h-28 bg-slate-100 dark:bg-slate-900 rounded-xl" />
          <div className="h-28 bg-slate-100 dark:bg-slate-900 rounded-xl" />
          <div className="h-28 bg-slate-100 dark:bg-slate-900 rounded-xl" />
          <div className="h-28 bg-slate-100 dark:bg-slate-900 rounded-xl" />
        </div>
      </div>
    );
  }

  // Leaderboard lists
  const leaders = [
    { name: 'John Doe', conversion: '18.4%', leadsCount: 42, color: 'bg-indigo-500' },
    { name: 'Jane Smith', conversion: '16.2%', leadsCount: 38, color: 'bg-emerald-500' },
    { name: 'Amit Patel', conversion: '14.1%', leadsCount: 29, color: 'bg-amber-500' }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header action row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/crm/leads')}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
              <BarChart3 className="text-indigo-500 w-5 h-5" /> Lead Funnel Analytics
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-light mt-0.5">
              Stage-by-stage conversions, team leaderboards, speed-to-contact rates, and absolute volumes.
            </p>
          </div>
        </div>
      </div>

      {/* Core Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatisticCard 
          title="Conversion Velocity" 
          value="4.2 Days" 
          growth={1.8} 
          growthDirection="up" 
          icon={<Clock className="w-4 h-4 text-indigo-500" />} 
        />
        <StatisticCard 
          title="Qualified Stage Ratio" 
          value="34.8%" 
          growth={2.5} 
          growthDirection="up" 
          icon={<TrendingUp className="w-4 h-4 text-emerald-500" />} 
        />
        <StatisticCard 
          title="Avg Lead Score" 
          value="74/100" 
          growth={3.0} 
          growthDirection="up" 
          icon={<Star className="w-4 h-4 text-amber-500" />} 
        />
        <StatisticCard 
          title="Dormant Leads Count" 
          value="8" 
          growthDirection="stable" 
          icon={<AlertCircle className="w-4 h-4 text-rose-500" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stage Progression Graph */}
        <div className="lg:col-span-2">
          <ChartCard
            title="SLA Lead Stage Funnel Status"
            subtitle="Stage volumes tracked on active pipelines"
            type="bar"
            data={analytics.charts.leadConversion}
            dataKeys={['count']}
            colors={['#6366f1']}
          />
        </div>

        {/* Sales Owner Leaderboard */}
        <Card variant="glass" className="p-5 border-slate-200/50 dark:border-slate-850 bg-white/50 dark:bg-slate-950/20 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-150/50 dark:border-slate-850/30 pb-3">
            <Users className="w-4 h-4 text-indigo-500" />
            <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
              Representative Leaderboard
            </h3>
          </div>

          <div className="space-y-4">
            {leaders.map((ldr, i) => (
              <div key={i} className="space-y-1 text-xs">
                <div className="flex justify-between items-center font-semibold text-slate-700 dark:text-slate-300">
                  <span>{ldr.name} ({ldr.leadsCount} leads)</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{ldr.conversion} win rate</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${ldr.color}`} style={{ width: ldr.conversion }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
