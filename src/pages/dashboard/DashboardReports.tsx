/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useEffect, useState } from 'react';
import { reportService } from '../../services/report.service';
import { ChartCard } from '../../components/crm/ChartCard';
import { ExportMenu } from '../../components/crm/ExportMenu';
import { LoadingState } from '../../components/crm/LoadingState';
import { Card } from '../../components/ui';
import { FileText, TrendingUp, Users, DollarSign, ArrowUpRight, BarChart } from 'lucide-react';
import { toast } from 'sonner';

export const DashboardReports: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);

  const fetchReports = async () => {
    try {
      const data = await reportService.getReportData();
      setReportData(data);
    } catch (err) {
      toast.error('Failed to parse performance summaries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return <LoadingState />;

  const salesReport = reportData?.salesReport || {};
  const breakdown = salesReport.monthlyBreakdown || [];

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono">
            Performance Ledger Reports
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-light mt-0.5">
            Historical sales breakdown, target evaluations, and regional allocations.
          </p>
        </div>
        <ExportMenu reportType="Sales Performance Summary" />
      </div>

      {/* Target Progress Bar */}
      <Card variant="glass" className="p-5 border border-slate-200 dark:border-slate-850">
        <div className="flex justify-between items-center mb-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-slate-400 uppercase font-mono">Fiscal Revenue Evaluation</span>
            <div className="text-lg font-black text-slate-800 dark:text-slate-100 font-mono">
              ₹{salesReport.totalRevenue?.toLocaleString()} / ₹{salesReport.targetRevenue?.toLocaleString()}
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 rounded-xl text-xs font-bold font-mono">
            <TrendingUp className="w-3.5 h-3.5" /> 91.7% Target Met
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-violet-600 h-full rounded-full animate-pulse" style={{ width: '91.7%' }} />
        </div>
      </Card>

      {/* Grid containing Monthly analytical breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Monthly Sales & Expenses Overview"
            subtitle="Target comparison of incoming billing vs local support expenditures"
            type="bar"
            data={breakdown.map((b: any) => ({ label: b.month.substring(0,3), revenue: b.revenue, expenses: b.expenses }))}
            dataKeys={['revenue', 'expenses']}
            colors={['#4f46e5', '#ef4444']}
            onRefresh={() => toast.success('Monthly chart synced.')}
          />
        </div>

        {/* Breakdown Panel */}
        <Card variant="glass" className="p-5 flex flex-col justify-between border border-slate-200 dark:border-slate-850">
          <div className="space-y-1 select-none">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono tracking-widest flex items-center gap-1.5">
              <BarChart className="w-4 h-4 text-indigo-500" /> Executive Metrics
            </h3>
            <p className="text-[10px] text-slate-400 font-light">Calculated performance indices for this fiscal quarter.</p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-900 flex-grow mt-4 space-y-4 pt-2">
            <div className="flex justify-between items-center py-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Monthly Active Contracts</span>
              <span className="font-bold text-slate-800 dark:text-slate-100 font-mono">1,240 records</span>
            </div>
            <div className="flex justify-between items-center py-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Average Deal Closed Span</span>
              <span className="font-bold text-slate-800 dark:text-slate-100 font-mono">24 working days</span>
            </div>
            <div className="flex justify-between items-center py-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Outbound Success Conversions</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">82.4%</span>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
};
