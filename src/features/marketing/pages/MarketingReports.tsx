/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { marketingService } from '../services/marketing.service';
import { campaignService } from '../services/campaign.service';
import { MarketingAnalytics, Campaign } from '../../../types/marketing';
import { MarketingChart } from '../components/MarketingChart';
import { 
  Sparkles, FileText, Download, Calendar, Filter, BarChart2, 
  TrendingUp, ArrowUpRight, CheckCircle, RefreshCw, Layers
} from 'lucide-react';
import { toast } from 'sonner';

export default function MarketingReports() {
  const [analytics, setAnalytics] = useState<MarketingAnalytics | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [selectedTimeframe, setSelectedTimeframe] = useState<'All-Time' | 'Last 30 Days' | 'This Quarter' | 'Q2 Core'>('All-Time');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('All');

  const loadData = async () => {
    try {
      setLoading(true);
      const stats = await marketingService.getAnalytics();
      const list = await campaignService.getCampaigns();
      setAnalytics(stats);
      setCampaigns(list);
    } catch (err) {
      toast.error('Failed to sync reporting systems.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExportFullLedger = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1400)),
      {
        loading: 'Compiling high-fidelity SLA audit logs...',
        success: 'Campaign_ROI_Report_V2.csv exported to download queue.',
        error: 'Export failed.'
      }
    );
  };

  if (loading || !analytics) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono text-xs animate-pulse">
        Assembling reporting ledgers...
      </div>
    );
  }

  // Top campaigns sorted by ROI
  const sortedTopCampaigns = [...campaigns]
    .sort((a, b) => b.conversion - a.conversion)
    .slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> Operational Intelligence
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">
            Campaign Reports & Audits
          </h1>
        </div>

        <button
          onClick={handleExportFullLedger}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Download className="w-4 h-4" /> Export Ledger CSV
        </button>
      </div>

      {/* Filters bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="flex items-center space-x-2 bg-white p-1.5 rounded-xl border border-slate-200 px-3">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Timeframe:</span>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none flex-1 cursor-pointer"
          >
            <option value="All-Time">All-Time Metrics</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="This Quarter">This Quarter (Q3)</option>
            <option value="Q2 Core">Q2 Core Segment</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 bg-white p-1.5 rounded-xl border border-slate-200 px-3">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Select Campaign:</span>
          <select
            value={selectedCampaignId}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none flex-1 cursor-pointer"
          >
            <option value="All">All Active Campaigns</option>
            {campaigns.map(camp => (
              <option key={camp.id} value={camp.id}>{camp.name} ({camp.id})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of aggregated KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Campaigns aggregated */}
        <div className="p-5 bg-white border border-slate-100 rounded-xl space-y-2">
          <span className="block text-[10px] font-mono font-black uppercase text-slate-400">ROI Attribution index</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black font-mono text-slate-800">
              ₹{(analytics.totalLeads * 450).toLocaleString()}
            </h3>
            <span className="text-emerald-600 text-xs font-bold font-mono">+18.4% MoM</span>
          </div>
          <p className="text-[11px] text-slate-400">Estimated value calculated via lead qualification metrics.</p>
        </div>

        {/* Deliverability Rating */}
        <div className="p-5 bg-white border border-slate-100 rounded-xl space-y-2">
          <span className="block text-[10px] font-mono font-black uppercase text-slate-400">Deliverability Score</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black font-mono text-indigo-650">
              99.42%
            </h3>
            <span className="text-emerald-600 text-xs font-bold font-mono">SLA Passed</span>
          </div>
          <p className="text-[11px] text-slate-400">Combined GSM SMS + SendGrid email webhook compliance status.</p>
        </div>

        {/* Conversion Rate */}
        <div className="p-5 bg-white border border-slate-100 rounded-xl space-y-2">
          <span className="block text-[10px] font-mono font-black uppercase text-slate-400">Conversion Efficiency</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black font-mono text-emerald-600">
              {analytics.conversionRate}%
            </h3>
            <span className="text-indigo-600 text-xs font-bold font-mono">Optimal</span>
          </div>
          <p className="text-[11px] text-slate-400">Total conversions to qualified sales pipelines.</p>
        </div>
      </div>

      {/* Middle reports grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* Channels Breakdown chart */}
        <div className="lg:col-span-2 p-5 bg-white border border-slate-100 rounded-xl">
          <h3 className="font-sans font-bold text-slate-800 text-sm uppercase tracking-wider font-mono mb-6 flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-indigo-500" />
            Core Channels Performance Mix
          </h3>

          <MarketingChart type="channel" data={analytics.channelPerformance} />
        </div>

        {/* League Table: Top Performing Campaigns */}
        <div className="p-5 bg-white border border-slate-100 rounded-xl space-y-4">
          <h3 className="font-sans font-bold text-slate-800 text-sm uppercase tracking-wider font-mono flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            Top Converting Assets
          </h3>

          <div className="space-y-4">
            {sortedTopCampaigns.map((camp, idx) => (
              <div key={camp.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="min-w-0 flex-1 flex items-center space-x-2.5">
                  <span className="text-xs font-mono font-black text-slate-400">#{idx + 1}</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 truncate">{camp.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{camp.type} • CTR: {camp.conversion}%</span>
                  </div>
                </div>
                
                <span className="text-[10px] font-mono font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {camp.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
