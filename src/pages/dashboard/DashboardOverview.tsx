/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboard.service';
import { StatisticCard } from '../../components/crm/StatisticCard';
import { ChartCard } from '../../components/crm/ChartCard';
import { ExportMenu } from '../../components/crm/ExportMenu';
import { DateRangePicker } from '../../components/crm/DateRangePicker';
import { Card } from '../../components/ui';
import {
  TrendingUp,
  Coins,
  ShoppingCart,
  Clock,
  CheckCircle,
  Users,
  GitBranch,
  Package,
  AlertTriangle,
  CreditCard,
  Percent,
  Sparkles,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { toast } from 'sonner';

export const DashboardOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const dbData = await dashboardService.getDashboardData();
      setData(dbData);
      setInsights(dbData.aiRecommendation);
    } catch (err) {
      toast.error('Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Listen for quick additions to reload stats if needed
    window.addEventListener('crm-data-refresh', fetchDashboardData);
    return () => window.removeEventListener('crm-data-refresh', fetchDashboardData);
  }, []);

  const handleRangeSelect = (range: { start: string; end: string; label: string }) => {
    toast.info(`Dashboard filtered for ${range.label}`, {
      description: `Period: ${range.start} to ${range.end}`
    });
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="space-y-6 text-left">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const charts = data?.charts || {};

  return (
    <div className="space-y-6 text-left">
      
      {/* Top action layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono">
            Executive Control Tower
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-light mt-0.5">
            Real-time ledger audit counts, product performance grids, and conversion funnels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <DateRangePicker onRangeSelect={handleRangeSelect} />
          <ExportMenu reportType="Executive Dashboard" />
        </div>
      </div>

      {/* AI recommendation bar */}
      {insights && (
        <Card variant="glass" className="p-4 border border-indigo-500/10 bg-indigo-50/10 dark:bg-indigo-950/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 font-mono tracking-widest block">
                {insights.compiledBy}
              </span>
              <p className="text-xs text-slate-750 dark:text-slate-350 font-bold mt-0.5">
                {insights.recommendation}
              </p>
            </div>
          </div>
          <button
            onClick={() => toast.success('Applying automated schema triggers...')}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-xl cursor-pointer transition-colors shadow-sm uppercase font-mono"
          >
            Apply Triage
          </button>
        </Card>
      )}

      {/* Primary stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticCard title="Today's Revenue" value={stats.todayRevenue} prefix="₹" growth={6.8} growthDirection="up" icon={<Coins className="w-4 h-4" />} />
        <StatisticCard title="Today's Orders" value={stats.todayOrders} growth={12} growthDirection="up" icon={<ShoppingCart className="w-4 h-4" />} />
        <StatisticCard title="Completed Orders" value={stats.completedOrders} icon={<CheckCircle className="w-4 h-4" />} />
        <StatisticCard title="Pending Payments" value={stats.pendingPayments} prefix="₹" growth={-2.4} growthDirection="down" icon={<Clock className="w-4 h-4" />} />
        <StatisticCard title="New Leads" value={stats.newLeads} growth={18.4} growthDirection="up" icon={<GitBranch className="w-4 h-4" />} />
        <StatisticCard title="Total Products" value={stats.totalProducts} icon={<Package className="w-4 h-4" />} />
        <StatisticCard title="Inventory Alerts" value={stats.inventoryAlerts} growthDirection="danger" growth={stats.inventoryAlerts > 0 ? 1 : 0} icon={<AlertTriangle className="w-4 h-4 text-rose-500" />} />
        <StatisticCard title="Business Health" value={`${stats.businessHealth}%`} growthDirection="stable" icon={<Percent className="w-4 h-4" />} />
      </div>

      {/* Analytical Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Revenue Stream Analytics"
          subtitle="Chronological billing models with custom regional tax tracking"
          type="area"
          data={charts.revenueStream}
          dataKeys={['revenue', 'expenses']}
          colors={['#4f46e5', '#f59e0b']}
          onRefresh={() => toast.success('Revenue streams synchronized.')}
        />
        <ChartCard
          title="Customer Acquisitions & Inflows"
          subtitle="Active contract renewals and onboarding statistics"
          type="bar"
          data={charts.customerAcquisitions}
          dataKeys={['active', 'new']}
          colors={['#10b981', '#6366f1']}
          onRefresh={() => toast.success('Customer logs refreshed.')}
        />
      </div>

    </div>
  );
};
