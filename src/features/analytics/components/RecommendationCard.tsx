import React from 'react';
import { Recommendation } from '../../../types/analytics';
import { Sparkles, Check, ChevronRight, AlertCircle, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onDismiss?: (id: string) => void;
  onApply?: (rec: Recommendation) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, onDismiss, onApply }) => {
  const getPriorityStyle = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'High': return 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850/60 rounded-2xl text-left space-y-4"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono font-black text-indigo-500 uppercase">{recommendation.type}</span>
          <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">{recommendation.title}</h4>
        </div>
        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase font-mono tracking-wider border ${getPriorityStyle(recommendation.priority)}`}>
          {recommendation.priority} Priority
        </span>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500 font-light leading-relaxed select-text">
        {recommendation.description}
      </p>

      <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 rounded-xl flex items-start gap-2 select-none">
        <ArrowUpRight className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <span className="block text-[8px] uppercase font-bold text-slate-400 font-mono">Projected Profit Impact</span>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">{recommendation.impact}</p>
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-1">
        {onDismiss && (
          <button
            onClick={() => onDismiss(recommendation.id)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 rounded-xl text-xs font-bold font-mono uppercase tracking-wider cursor-pointer"
          >
            Dismiss
          </button>
        )}
        {onApply && (
          <button
            onClick={() => onApply(recommendation)}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
          >
            Execute Action <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
