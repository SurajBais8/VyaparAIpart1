/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboard.service';
import { StatisticCard } from '../../components/crm/StatisticCard';
import { ChartCard } from '../../components/crm/ChartCard';
import { Card } from '../../components/ui';
import { Users, UserPlus, Sparkles, TrendingUp, BarChart2, Star, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export const DashboardCustomers: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchCustomersData = async () => {
      setLoading(true);
      try {
        const dbData = await dashboardService.getDashboardData();
        setData(dbData);
      } catch (err) {
        toast.error('Failed to load customer metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomersData();
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

  // Top Customers list with mockup lifetime spending
  const topCustomers = [
    { name: 'TechVantage Labs', company: 'Nova Healthcare', spending: 245000, logo: 'TL', level: 'Enterprise' },
    { name: 'Vertex Retail Group', company: 'Vertex Retail', spending: 185000, logo: 'VR', level: 'Platinum' },
    { name: 'Apex Consulting Ltd', company: 'Apex Consulting', spending: 124000, logo: 'AC', level: 'Gold' },
    { name: 'Zenith FinTech Corp', company: 'Zenith FinTech', spending: 95000, logo: 'ZF', level: 'Gold' }
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <Users className="text-indigo-500 w-5 h-5" /> Customer Cohorts & Growth
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-light mt-0.5">
            Statistical distribution of active users, customer acquisition curves, and AI churn triggers.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatisticCard 
          title="Total Customers" 
          value={stats.customers.value} 
          growth={stats.customers.growth} 
          growthDirection={stats.customers.status} 
          icon={<Users className="w-4 h-4 text-indigo-500" />} 
        />
        <StatisticCard 
          title="Monthly Cohort Growth" 
          value={`${stats.growthPercent.value}%`} 
          growth={stats.growthPercent.growth} 
          growthDirection={stats.growthPercent.status} 
          icon={<TrendingUp className="w-4 h-4 text-emerald-500" />} 
        />
        <StatisticCard 
          title="Satisfaction Rating" 
          value="98.4%" 
          growth={0.5} 
          growthDirection="up" 
          icon={<Star className="w-4 h-4 text-amber-500" />} 
        />
      </div>

      {/* Customer Growth Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Monthly Acquisition Inflow"
            subtitle="Representing newly registered and retained business clients"
            type="bar"
            data={data.charts.monthly.revenue} // reuse monthly counts
            dataKeys={['customers', 'leads']}
            colors={['#6366f1', '#10b981']}
          />
        </div>

        {/* AI Client Suggestions Widget */}
        <div className="space-y-4">
          <Card variant="glass" className="p-5 border-indigo-500/10 bg-indigo-50/10 dark:bg-indigo-950/5 rounded-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                <h3 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">
                  Client Retention Insights
                </h3>
              </div>
              
              <div className="space-y-3">
                {widgets.aiSuggestions?.map((sug: string, i: number) => (
                  <div key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                    <p>{sug}</p>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => toast.success('Churn protection parameters verified')}
              className="mt-5 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono uppercase tracking-wider text-[10px] font-bold rounded-xl cursor-pointer transition-colors"
            >
              Verify Churn Alerts
            </button>
          </Card>
        </div>
      </div>

      {/* Customer Directory Subsections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers Ledger */}
        <Card variant="glass" className="p-5 border-slate-200/50 dark:border-slate-850 bg-white/50 dark:bg-slate-950/20 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-150/50 dark:border-slate-850/30 pb-3">
            <Star className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
              Top Customer Profiles
            </h3>
          </div>

          <div className="space-y-3.5">
            {topCustomers.map((cust, i) => (
              <div key={i} className="flex justify-between items-center text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs font-mono">
                    {cust.logo}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{cust.name}</h4>
                    <span className="text-[9px] text-slate-400 font-mono">{cust.company}</span>
                  </div>
                </div>

                <div className="text-right space-y-0.5">
                  <span className="text-xs font-black font-mono block">₹{cust.spending.toLocaleString()}</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-400">
                    {cust.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* New Customer Registrations */}
        <Card variant="glass" className="p-5 border-slate-200/50 dark:border-slate-850 bg-white/50 dark:bg-slate-950/20 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-150/50 dark:border-slate-850/30 pb-3">
            <UserPlus className="w-4 h-4 text-indigo-500" />
            <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
              New Customer Signups
            </h3>
          </div>

          <div className="space-y-3.5">
            {widgets.recentCustomers?.map((cust: any, i: number) => (
              <div key={i} className="flex justify-between items-center text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs font-mono">
                    {cust.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{cust.name}</h4>
                    <span className="text-[9px] text-slate-400 font-mono">{cust.company}</span>
                  </div>
                </div>

                <div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded border border-emerald-500/10 text-[9px] font-bold font-mono uppercase bg-emerald-500/5 text-emerald-600">
                    {cust.status}
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
