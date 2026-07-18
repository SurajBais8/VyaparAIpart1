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
import { EngagementCard } from '../components/EngagementCard';
import { ConversionCard } from '../components/ConversionCard';
import { CampaignCard } from '../components/CampaignCard';
import { Sparkles, Calendar, TrendingUp, RefreshCw, BarChart2, PlusCircle, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function MarketingWorkspace() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<MarketingAnalytics | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<'channel' | 'campaign' | 'lead' | 'engagement'>('channel');

  const [aiInsights] = useState<string[]>([
    "WhatsApp conversions exceed email by 14% on VIP segments. Shift budget to conversational flows.",
    "Optimal SMS dispatch is detected between 5:30 PM - 7:00 PM on weekdays. Avoid weekend SMS sends.",
    "Customer churn risk in Free Trial lists has dropped 5% following the automated Day-3 Onboarding Nudge flow."
  ]);

  const loadData = async () => {
    try {
      setLoading(true);
      const metrics = await marketingService.getAnalytics();
      const list = await campaignService.getCampaigns();
      setAnalytics(metrics);
      setCampaigns(list);
    } catch (err) {
      toast.error('Failed to sync marketing dashboard telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSyncEngine = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: 'Interrogating marketing funnel streams...',
        success: 'Lead attribution indices synchronized successfully.',
        error: 'Funnel sync failed.'
      }
    );
  };

  if (loading || !analytics) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono text-xs animate-pulse">
        Initializing Marketing intelligence systems...
      </div>
    );
  }

  const activeCampaignsList = campaigns.filter(c => c.status === 'Active');
  const upcomingCampaignsList = campaigns.filter(c => c.status === 'Scheduled');
  const recentCampaignsList = campaigns.slice(0, 3);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 text-left">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
            <Sparkles className="w-4 h-4 animate-pulse" /> Marketing Operations Suite
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">
            Marketing core & funnel dashboard
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSyncEngine}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-150 text-slate-650 rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Recalculate Funnels
          </button>
          <button
            onClick={() => navigate('/marketing/campaigns')}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Launch Campaign
          </button>
        </div>
      </div>

      {/* Conversion Cards */}
      <ConversionCard 
        totalLeads={analytics.totalLeads} 
        conversionRate={analytics.conversionRate} 
        activeCampaigns={analytics.activeCampaigns} 
      />

      {/* Engagement Cards */}
      <EngagementCard 
        emailSent={analytics.emailSent} 
        whatsAppSent={analytics.whatsAppSent} 
        smsSent={analytics.smsSent} 
      />

      {/* Middle Grid: Charts and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Charts Box */}
        <div className="lg:col-span-2 p-5 bg-white border border-slate-100 rounded-xl flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <div>
              <h3 className="font-sans font-semibold text-slate-800 text-base flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-indigo-500" />
                Funnel Performance Telemetry
              </h3>
              <p className="text-xs text-slate-400">Select active metric filter mapping below</p>
            </div>
            
            <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100 flex-wrap gap-1">
              <button 
                onClick={() => setActiveChart('channel')}
                className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md uppercase tracking-wider cursor-pointer ${
                  activeChart === 'channel' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Channels
              </button>
              <button 
                onClick={() => setActiveChart('campaign')}
                className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md uppercase tracking-wider cursor-pointer ${
                  activeChart === 'campaign' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Campaigns ROI
              </button>
              <button 
                onClick={() => setActiveChart('lead')}
                className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md uppercase tracking-wider cursor-pointer ${
                  activeChart === 'lead' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Conversions
              </button>
              <button 
                onClick={() => setActiveChart('engagement')}
                className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md uppercase tracking-wider cursor-pointer ${
                  activeChart === 'engagement' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Monthly Trends
              </button>
            </div>
          </div>

          <MarketingChart 
            type={activeChart} 
            data={
              activeChart === 'channel' ? analytics.channelPerformance : 
              activeChart === 'campaign' ? analytics.campaignPerformance : 
              activeChart === 'lead' ? analytics.leadConversion : 
              analytics.monthlyEngagement
            } 
          />
        </div>

        {/* AI Suggestions Sidebar Box */}
        <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 mb-4">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <h3 className="font-sans font-bold text-slate-800 text-sm uppercase tracking-wider font-mono">
                AI Cognitive Insights
              </h3>
            </div>
            
            <div className="space-y-4">
              {aiInsights.map((insight, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 flex items-start space-x-3 shadow-xs">
                  <span className="text-xs font-mono font-black text-indigo-600 bg-indigo-50 h-5 w-5 rounded-full flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal text-left">
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-500 to-violet-600 p-4 rounded-xl text-white mt-6 relative overflow-hidden">
            <h4 className="font-sans font-semibold text-xs mb-1 uppercase tracking-wider font-mono">Dynamic Lead Qualification</h4>
            <p className="text-[11px] text-indigo-100 font-light mb-3">Deploy conversational neural workflows to capture and qualification check incoming web demo form submissions.</p>
            <button 
              onClick={() => navigate('/marketing/automation')}
              className="px-3 py-1 bg-white text-indigo-600 text-[10px] font-black font-mono uppercase rounded-lg hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
            >
              Configure Flow <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Lower Grid: Campaigns list and widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent campaigns section */}
        <div className="lg:col-span-2 space-y-4 text-left">
          <div className="flex justify-between items-center">
            <h3 className="font-sans font-bold text-slate-800 text-base">
              Recent Campaigns Performance
            </h3>
            <button 
              onClick={() => navigate('/marketing/campaigns')}
              className="text-indigo-600 font-semibold text-xs hover:underline"
            >
              All Campaigns ({campaigns.length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentCampaignsList.map(camp => (
              <CampaignCard 
                key={camp.id} 
                campaign={camp} 
                onClick={() => navigate(`/marketing/campaigns`)} 
              />
            ))}
          </div>
        </div>

        {/* Calendar and Upcoming campaigns sidebar */}
        <div className="p-5 bg-white border border-slate-100 rounded-xl space-y-4 text-left">
          <h3 className="font-sans font-semibold text-slate-800 text-sm uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            Upcoming Campaign Releases
          </h3>
          
          <div className="space-y-3.5">
            {upcomingCampaignsList.length === 0 ? (
              <p className="text-xs text-slate-400 font-mono">No releases scheduled for this window.</p>
            ) : (
              upcomingCampaignsList.map(camp => (
                <div key={camp.id} className="flex items-start space-x-3 p-3 bg-slate-5/50 border border-slate-100 rounded-lg">
                  <div className="text-center bg-indigo-50 text-indigo-600 p-2 rounded-lg shrink-0 w-11">
                    <p className="text-[10px] font-bold uppercase font-mono">Jul</p>
                    <p className="text-sm font-black font-mono">{camp.startDate.split('-')[2]}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-slate-700 truncate">{camp.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{camp.type} Pipeline • {camp.audience}</p>
                    <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 mt-1 inline-block">
                      Budget: ₹{camp.budget.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
