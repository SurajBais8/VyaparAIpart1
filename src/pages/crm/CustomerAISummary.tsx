/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Card } from '../../components/ui';
import { Sparkles, TrendingUp, AlertTriangle, BadgeCheck, Lightbulb, Activity, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';

interface CustomerAISummaryProps {
  customer: any;
}

export const CustomerAISummary: React.FC<CustomerAISummaryProps> = ({ customer }) => {
  if (!customer) return null;

  // Compute dynamic scores
  const scoreVal = customer.totalPurchase > 150000 ? 'A+' : customer.totalPurchase > 50000 ? 'B+' : 'C';
  const predictionRate = customer.outstandingAmount === 0 ? '94%' : '68%';

  const recommendations = [
    `Recommend upselling the active ${customer.company} branch into the full Enterprise Suite.`,
    "Schedule Q3 business operations review call with their technical stakeholders.",
    "Verify secondary GSTIN compliance mapping before billing next recurring invoice cycles."
  ];

  return (
    <div className="space-y-5 text-left">
      <div>
        <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5 animate-pulse">
          <Sparkles className="w-4 h-4 text-indigo-500" /> AI Customer Triage & Forecasts
        </h3>
        <p className="text-[10px] text-slate-400 font-light mt-0.5">
          Real-time customer risk factor evaluation, purchase propensity percentages, and automated follow-ups.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Customer Score Card */}
        <Card variant="glass" className="p-4 border-indigo-500/10 bg-indigo-500/5 rounded-xl space-y-2 text-center">
          <span className="text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400 font-mono tracking-widest block">
            Customer Health Score
          </span>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono py-1">
            {scoreVal}
          </div>
          <span className="text-[9px] text-slate-400 font-sans block">
            Top tier retention rate potential
          </span>
        </Card>

        {/* Purchase Propensity */}
        <Card variant="glass" className="p-4 border-emerald-500/10 bg-emerald-500/5 rounded-xl space-y-2 text-center">
          <span className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 font-mono tracking-widest block">
            Next-Month Purchase Propensity
          </span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono py-1 flex items-center justify-center gap-1">
            {predictionRate} <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-[9px] text-slate-400 font-sans block">
            Strong subscription expansion probability
          </span>
        </Card>

        {/* Predictive Churn Risk */}
        <Card variant="glass" className="p-4 border-amber-500/10 bg-amber-500/5 rounded-xl space-y-2 text-center">
          <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400 font-mono tracking-widest block">
            Predictive Churn Risk
          </span>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono py-1">
            {customer.outstandingAmount > 0 ? 'Moderate' : 'Low'}
          </div>
          <span className="text-[9px] text-slate-400 font-sans block">
            Account behavior logs look healthy
          </span>
        </Card>
      </div>

      {/* Overview section */}
      <Card variant="glass" className="p-4 border-slate-200/50 dark:border-slate-850 bg-white/50 dark:bg-slate-950/20 rounded-xl space-y-2">
        <h4 className="text-[10px] font-black uppercase text-slate-400 font-mono flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-indigo-500" /> AI Customer Overview & Mood
        </h4>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-light">
          {customer.profile?.aiSummary || `${customer.name} is a valued representative at ${customer.company}. They reside in ${customer.city}, and have maintained positive payment habits. No complaints or support tickets outstanding.`}
        </p>
      </Card>

      {/* AI Recommendations */}
      <Card variant="glass" className="p-4 border-slate-200/50 dark:border-slate-850 bg-white/50 dark:bg-slate-950/20 rounded-xl space-y-3">
        <h4 className="text-[10px] font-black uppercase text-slate-400 font-mono flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Strategic Follow-up Prompts
        </h4>

        <div className="space-y-2.5">
          {recommendations.map((rec, i) => (
            <div key={i} className="text-xs text-slate-750 dark:text-slate-350 flex items-start gap-2">
              <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p>{rec}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            toast.success('Generated upsell pipeline lead option inside deal board!');
          }}
          className="mt-2 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono uppercase tracking-wider text-[10px] font-bold rounded-xl cursor-pointer transition-colors"
        >
          Draft Expansion Deal
        </button>
      </Card>
    </div>
  );
};
