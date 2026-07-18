/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  analyticsService 
} from '../services/analytics.service';
import { 
  forecastService 
} from '../services/forecast.service';
import { 
  recommendationService 
} from '../services/recommendation.service';
import { 
  reportService, 
  AnalyticsReport 
} from '../services/report.service';
import { 
  businessIntelligenceService 
} from '../services/businessIntelligence.service';

import { 
  AnalyticsData, 
  ForecastItem, 
  Recommendation, 
  BusinessScore, 
  ExecutiveDashboardData 
} from '../../../types/analytics';

import { 
  KPIWidget 
} from '../components/KPIWidget';
import { 
  ForecastChart 
} from '../components/ForecastChart';
import { 
  AIInsightCard 
} from '../components/AIInsightCard';
import { 
  RecommendationCard 
} from '../components/RecommendationCard';
import { 
  BusinessScoreCard 
} from '../components/BusinessScoreCard';
import { 
  ExecutiveCard 
} from '../components/ExecutiveCard';
import { 
  AnalyticsFilter 
} from '../components/AnalyticsFilter';
import { 
  ReportCard 
} from '../components/ReportCard';

import { 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Lightbulb, 
  FileText, 
  Award, 
  Search, 
  Filter, 
  Zap,
  Activity,
  User,
  Package,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

type ActiveTab = 'bi_dashboard' | 'reports' | 'kpis' | 'forecasts' | 'recommendations' | 'executive';

export default function AnalyticsWorkspace() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('bi_dashboard');
  const [loading, setLoading] = useState(true);

  // States
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [forecasts, setForecasts] = useState<ForecastItem[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [reports, setReports] = useState<AnalyticsReport[]>([]);
  const [biScore, setBiScore] = useState<BusinessScore | null>(null);
  const [execDashboard, setExecDashboard] = useState<ExecutiveDashboardData | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const loadAllData = async () => {
    try {
      setLoading(true);
      const analyticRes = await analyticsService.getAnalyticsData();
      const forecastRes = await forecastService.getForecasts();
      const recommendationsRes = await recommendationService.getRecommendations();
      const reportsRes = await reportService.getReports();
      const scoreRes = await businessIntelligenceService.getBusinessScore();
      const execRes = await businessIntelligenceService.getExecutiveDashboard();

      setAnalyticsData(analyticRes);
      setForecasts(forecastRes);
      setRecommendations(recommendationsRes);
      setReports(reportsRes);
      setBiScore(scoreRes);
      setExecDashboard(execRes);
    } catch (err) {
      console.error('Error fetching analytics systems', err);
      toast.error('Failed to boot AI analytics core engines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleToggleFavorite = async (id: string) => {
    try {
      await reportService.toggleFavorite(id);
      toast.success('Report subscription priority updated');
      const updated = await reportService.getReports();
      setReports(updated);
    } catch (err) {
      toast.error('Failed to bookmark report');
    }
  };

  const handleSetSchedule = async (id: string, sched: string) => {
    try {
      await reportService.setSchedule(id, sched);
      toast.success(`Delivery schedule updated to: ${sched}`);
      const updated = await reportService.getReports();
      setReports(updated);
    } catch (err) {
      toast.error('Failed to update schedule');
    }
  };

  const handleRunReport = (id: string) => {
    toast.info(`Triggered compiling logs for ${id}...`);
    setTimeout(() => {
      toast.success(`Success! Document ${id}_v3.pdf dispatched to executive dashboard.`);
    }, 1500);
  };

  const handleDismissRecommendation = async (id: string) => {
    try {
      await recommendationService.dismissRecommendation(id);
      toast.success('Optimization alert archived');
      const updated = await recommendationService.getRecommendations();
      setRecommendations(updated);
    } catch (err) {
      toast.error('Failed to dismiss recommendation');
    }
  };

  const handleApplyRecommendationAction = (rec: Recommendation) => {
    toast.success(`Applied Executive Directive: ${rec.action}`);
    handleDismissRecommendation(rec.id);
  };

  const reportCategories = ['All', 'Sales', 'Customers', 'Inventory', 'Accounting', 'Purchase', 'Employees', 'Marketing'];

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 select-none pb-12">
      
      {/* Header section with brand pairings */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-5">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" /> Advanced Business Intelligence Portal
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">
            Analytics & Reports
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => loadAllData()}
            className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-500 animate-pulse" /> Re-Compute Models
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1.5 border-b border-slate-100 dark:border-slate-850">
        {(['bi_dashboard', 'reports', 'kpis', 'forecasts', 'recommendations', 'executive'] as ActiveTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSearchQuery('');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider font-mono cursor-pointer transition-all border shrink-0
              ${activeTab === tab
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:hover:text-slate-300'}`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-xs animate-pulse">
          Re-indexing vector representations...
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-6"
          >
            
            {/* TAB CONTENT: BI DASHBOARD */}
            {activeTab === 'bi_dashboard' && (
              <div className="space-y-6">
                
                {/* Upper widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    {biScore && <BusinessScoreCard score={biScore} />}
                  </div>

                  <div className="lg:col-span-2 space-y-4 text-left">
                    <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-100">
                      Predictive Revenue and Inventory Curves
                    </h3>
                    <ForecastChart data={forecasts} />
                  </div>
                </div>

                {/* Factors checklist and automated risks panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Executive factor health checks */}
                  <div className="p-5 bg-white border border-slate-200 rounded-2xl text-left space-y-4">
                    <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-800">
                      Organizational Ratios Health Audit
                    </h3>
                    <div className="space-y-3">
                      {biScore?.factors.map((factor, idx) => (
                        <div key={idx} className="flex justify-between items-start border-b pb-2 text-xs font-mono">
                          <div>
                            <span className="font-bold text-slate-800 block">{factor.name}</span>
                            <span className="text-[10px] text-slate-450 leading-relaxed font-sans">{factor.comment}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded border font-black uppercase text-[9px] tracking-wider
                            ${factor.score >= 85 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : 'bg-amber-50 text-amber-700 border-amber-100'}`}
                          >
                            {factor.score}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI risks summary */}
                  <AIInsightCard 
                    title="Cognitive Intelligence Log"
                    insights={[
                      "Strong structural liquidity indexes allow secure execution of marketing scale-ups.",
                      "Operating margins are stabilized at 47.6%, but procurement costs require quarterly tracking.",
                      "High-margin cloud software subscription products are displaying elevated buying velocities."
                    ]}
                    score={biScore?.overallScore}
                  />

                </div>

              </div>
            )}

            {/* TAB CONTENT: REPORTS CENTER */}
            {activeTab === 'reports' && (
              <div className="space-y-4">
                
                {/* Search/filter controls */}
                <AnalyticsFilter
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  categories={reportCategories}
                />

                {/* Reports grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredReports.map((rep) => (
                    <ReportCard
                      key={rep.id}
                      report={rep}
                      onToggleFavorite={handleToggleFavorite}
                      onSetSchedule={handleSetSchedule}
                      onRun={handleRunReport}
                    />
                  ))}
                </div>

                {filteredReports.length === 0 && (
                  <div className="p-12 text-center text-slate-400 font-mono text-xs border rounded-2xl border-dashed">
                    No matching reports found
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: KPI DASHBOARD */}
            {activeTab === 'kpis' && (
              <div className="space-y-6">
                
                {/* Bento metric blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <KPIWidget 
                    label="Revenue Velocity Growth" 
                    value={`${analyticsData?.kpis.revenueGrowth}%`} 
                    change={2.4} 
                    icon={<TrendingUp className="w-4 h-4 text-indigo-500" />}
                  />
                  <KPIWidget 
                    label="Core Profit Margin" 
                    value={`${analyticsData?.kpis.profitMargin}%`} 
                    change={1.2} 
                    icon={<Award className="w-4 h-4 text-indigo-500" />}
                  />
                  <KPIWidget 
                    label="Accounts Lifecycle expansion" 
                    value={`${analyticsData?.kpis.customerGrowth}%`} 
                    change={4.8} 
                    icon={<User className="w-4 h-4 text-indigo-500" />}
                  />
                  <KPIWidget 
                    label="Gross Asset Inventory Valuation" 
                    value={`₹${(analyticsData?.kpis.inventoryValue || 0).toLocaleString()}`} 
                    change={3.4} 
                    icon={<Package className="w-4 h-4 text-indigo-500" />}
                  />
                </div>

                {/* Sub performance chart */}
                <div className="p-5 bg-white border rounded-2xl text-left space-y-4">
                  <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-800">
                    SaaS Core Month-on-Month Expansion Logs
                  </h3>
                  <div className="h-64">
                    <ForecastChart data={forecasts} />
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: FORECASTS */}
            {activeTab === 'forecasts' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 space-y-4 text-left">
                  <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-800">
                    SaaS Forecast Curve (Aug - Dec 2026)
                  </h3>
                  <ForecastChart data={forecasts} />
                </div>

                {/* Predictive insight summary cards */}
                <AIInsightCard 
                  title="Predictive Intelligence Insights"
                  insights={[
                    "Q3 revenue is forecasted to hit ₹75,00,000, driven by enterprise server deployments.",
                    "Cloud Security subscription models show a monthly sales acceleration of 14.5%.",
                    "Expected storage overhead is low, but reorder points should be closely maintained."
                  ]}
                  score={biScore?.overallScore}
                />

              </div>
            )}

            {/* TAB CONTENT: RECOMMENDATION CENTER */}
            {activeTab === 'recommendations' && (
              <div className="space-y-4">
                <div className="bg-white border rounded-2xl p-4 flex justify-between items-center text-left select-none">
                  <div>
                    <h4 className="text-xs font-black uppercase font-mono tracking-wider text-slate-800">
                      Active Business Optimization Recommendations
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Calculated from real-time sales curves and supplier lead times
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-black text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded border border-indigo-400/10">
                    Available: {recommendations.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recommendations.map((rec) => (
                    <RecommendationCard
                      key={rec.id}
                      recommendation={rec}
                      onDismiss={handleDismissRecommendation}
                      onApply={handleApplyRecommendationAction}
                    />
                  ))}
                </div>

                {recommendations.length === 0 && (
                  <div className="p-12 text-center text-slate-400 font-mono text-xs border rounded-2xl border-dashed">
                    All optimization audits compiled and resolved
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: EXECUTIVE DASHBOARD */}
            {activeTab === 'executive' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {execDashboard && (
                  <>
                    <ExecutiveCard title="CEO" data={execDashboard.ceoView} />
                    <ExecutiveCard title="CFO" data={execDashboard.cfoView} />
                    <ExecutiveCard title="Director of Sales" data={execDashboard.salesView} />
                    <ExecutiveCard title="Inventory Lead" data={execDashboard.inventoryView} />
                  </>
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      )}

    </div>
  );
}
