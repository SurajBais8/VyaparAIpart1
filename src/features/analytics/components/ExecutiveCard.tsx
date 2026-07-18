import React from 'react';
import { ExecutiveRoleView } from '../../../types/analytics';
import { Award, ShieldAlert, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ExecutiveCardProps {
  title: string;
  data: ExecutiveRoleView;
}

export const ExecutiveCard: React.FC<ExecutiveCardProps> = ({ title, data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850/60 rounded-2xl text-left flex flex-col justify-between"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center select-none border-b border-slate-50 dark:border-slate-900 pb-3">
          <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono">
            {title} View
          </h4>
          <Award className="w-4.5 h-4.5 text-indigo-500" />
        </div>

        {data.criticalInsights && (
          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850 rounded-xl space-y-1">
            <span className="text-[8px] font-black uppercase text-indigo-500 font-mono tracking-wider block">Strategic Focus</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light leading-relaxed select-text">
              {data.criticalInsights}
            </p>
          </div>
        )}

        {data.balanceSheetSummary && (
          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850 rounded-xl space-y-1">
            <span className="text-[8px] font-black uppercase text-indigo-500 font-mono tracking-wider block">Capital Position</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              {data.balanceSheetSummary}
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 py-1 select-none font-mono">
          {data.kpis.map((kpi, idx) => (
            <div key={idx} className="p-2 border border-slate-50 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-950 rounded-lg">
              <span className="block text-[8px] text-slate-400 font-bold uppercase truncate">{kpi.label}</span>
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">{kpi.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
