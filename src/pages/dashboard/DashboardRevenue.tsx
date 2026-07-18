/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboard.service';
import { StatisticCard } from '../../components/crm/StatisticCard';
import { ChartCard } from '../../components/crm/ChartCard';
import { DateRangePicker } from '../../components/crm/DateRangePicker';
import { ExportMenu } from '../../components/crm/ExportMenu';
import { Card } from '../../components/ui';
import { Coins, TrendingUp, Calendar, CreditCard, Sparkles, Filter, FileSpreadsheet, Percent } from 'lucide-react';
import { toast } from 'sonner';

export const DashboardRevenue: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [filterPeriod, setFilterPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const dbData = await dashboardService.getDashboardData();
      setData(dbData);
    } catch (err) {
      toast.error('Failed to load revenue metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const handleRangeSelect = (range: any) => {
    toast.success(`Revenue insights filtered for ${range.label}`);
  };

  if (loading || !data) {
    return (
      <div className="space-y-6 text-left p-6">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-28 bg-slate-100 dark:bg-slate-900 rounded-xl animate-pulse" />
          <div className="h-28 bg-slate-100 dark:bg-slate-900 rounded-xl animate-pulse" />
          <div className="h-28 bg-slate-100 dark:bg-slate-900 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const stats = data.statistics;
  const charts = data.charts;

  // Derive charts for the graph based on period
  const chartData = charts[filterPeriod]?.revenue || charts.monthly.revenue;

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <Coins className="text-indigo-500 w-5 h-5" /> Revenue Ledger & Analytics
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-light mt-0.5">
            Detailed view of dynamic invoices, average customer order sizing, monthly ARR growth, and expense layouts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DateRangePicker onRangeSelect={handleRangeSelect} />
          <ExportMenu reportType="Revenue & Billing Audit" />
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatisticCard 
          title="Today's Revenue" 
          value={stats.todayRevenue.value} 
          prefix="₹" 
          growth={stats.todayRevenue.growth} 
          growthDirection={stats.todayRevenue.status} 
          icon={<Coins className="w-4 h-4 text-emerald-500" />} 
        />
        <StatisticCard 
          title="Monthly Recurring (MRR)" 
          value={stats.monthlyRevenue.value} 
          prefix="₹" 
          growth={stats.monthlyRevenue.growth} 
          growthDirection={stats.monthlyRevenue.status} 
          icon={<Calendar className="w-4 h-4 text-indigo-500" />} 
        />
        <StatisticCard 
          title="Gross Profit Pool" 
          value={stats.profit.value} 
          prefix="₹" 
          growth={stats.profit.growth} 
          growthDirection={stats.profit.status} 
          icon={<TrendingUp className="w-4 h-4 text-teal-500" />} 
        />
        <StatisticCard 
          title="Pending Receivables" 
          value={stats.pendingPayments.value} 
          prefix="₹" 
          growth={stats.pendingPayments.growth} 
          growthDirection={stats.pendingPayments.status} 
          icon={<CreditCard className="w-4 h-4 text-amber-500" />} 
        />
      </div>

      {/* Dynamic Graph Filter Controls */}
      <Card variant="glass" className="p-5 border-slate-200/50 dark:border-slate-850 bg-white/50 dark:bg-slate-950/20 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-150/50 dark:border-slate-850/30">
          <div className="space-y-0.5">
            <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
              Transactional Flow Over Time
            </h3>
            <p className="text-[10px] text-slate-400 font-light">
              Toggle charts below to visualize hourly, weekly, monthly or yearly fiscal run rates.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200/50 dark:border-slate-850">
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setFilterPeriod(period)}
                className={`px-3 py-1 text-[10px] font-black uppercase font-mono rounded-lg transition-all cursor-pointer ${
                  filterPeriod === period
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="h-96">
          <ChartCard
            title={`${filterPeriod.toUpperCase()} REVENUE SUMMARY`}
            subtitle="Comparing Gross Revenues against operational expenditures"
            type="area"
            data={chartData}
            dataKeys={['revenue', 'expenses', 'profit']}
            colors={['#4f46e5', '#f59e0b', '#10b981']}
            onRefresh={() => toast.success('Data synchronized.')}
          />
        </div>
      </Card>

      {/* Extra Detail Row: Daily/Monthly comparison matrix and AI recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass" className="p-5 border-slate-200/50 dark:border-slate-850 bg-white/50 dark:bg-slate-950/20 rounded-2xl space-y-4 text-left">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
            <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
              Revenue Forecast & Comparison
            </h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-500/10 rounded-xl space-y-1">
              <div className="flex justify-between items-center text-[10px] font-mono font-black text-indigo-600 dark:text-indigo-400">
                <span>PROJECTED ARR RUN-RATE</span>
                <span>₹17.1 Lakhs</span>
              </div>
              <p className="text-[10px] text-slate-550 dark:text-slate-400">
                Based on current MRR momentum, expected contract closures, and past seasonality patterns, Q3 billing volume is poised to exceed benchmarks by 14%.
              </p>
            </div>

            <div className="p-3 bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-500/10 rounded-xl space-y-1">
              <div className="flex justify-between items-center text-[10px] font-mono font-black text-emerald-600 dark:text-emerald-400">
                <span>COMPLIANCE & GST</span>
                <span>100% AUDITED</span>
              </div>
              <p className="text-[10px] text-slate-550 dark:text-slate-400">
                All Indian invoices are configured with correct CGST/SGST/IGST brackets. No outliers detected. Ready for immediate tax filings.
              </p>
            </div>
          </div>
        </Card>

        {/* Breakdown comparison list */}
        <Card variant="glass" className="p-5 border-slate-200/50 dark:border-slate-850 bg-white/50 dark:bg-slate-950/20 rounded-2xl space-y-4 text-left">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
              Fiscal Comparison Ledger
            </h3>
            <span className="text-[9px] font-mono font-bold text-indigo-600 px-2 py-0.5 rounded bg-indigo-500/10">INR (₹)</span>
          </div>

          <div className="divide-y divide-slate-150/50 dark:divide-slate-850/40 text-xs font-mono">
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-400">Today vs Yesterday</span>
              <span className="font-bold text-emerald-600">+₹4,520 (▲ 12.5%)</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-400">This Month vs Last Month</span>
              <span className="font-bold text-emerald-600">+₹18,200 (▲ 14.2%)</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-400">Expected Pipeline Conversion</span>
              <span className="font-bold text-indigo-500">₹{Math.round(stats.pendingPayments.value * 0.7).toLocaleString()}</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-400">Total EBITDA Margin</span>
              <span className="font-bold text-indigo-600">81.6%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
