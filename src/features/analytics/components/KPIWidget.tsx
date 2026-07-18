import React from 'react';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { motion } from 'motion/react';

interface KPIWidgetProps {
  label: string;
  value: string | number;
  change?: number;
  changeSuffix?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
}

export const KPIWidget: React.FC<KPIWidgetProps> = ({ label, value, change, changeSuffix = '%', isPositive = true, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-5 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850/60 rounded-2xl flex flex-col justify-between text-left shadow-2xs hover:shadow-xs transition-shadow"
    >
      <div className="flex justify-between items-start select-none">
        <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">
          {label}
        </span>
        <div className="p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-indigo-500 rounded-lg">
          {icon || <Activity className="w-4 h-4" />}
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="text-xl font-black font-mono tracking-tight text-slate-800 dark:text-slate-100">
          {value}
        </h3>
        {change !== undefined && (
          <span className={`inline-flex items-center gap-0.5 text-[9px] font-black uppercase font-mono tracking-wide mt-1 px-1.5 py-0.5 rounded
            ${isPositive 
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/30 dark:bg-emerald-950/20' 
              : 'bg-rose-50 text-rose-500 border border-rose-200/30 dark:bg-rose-950/20'}`}
          >
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {isPositive ? '+' : ''}{change}{changeSuffix}
          </span>
        )}
      </div>
    </motion.div>
  );
};
