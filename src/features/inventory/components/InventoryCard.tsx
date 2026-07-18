import React from 'react';
import { motion } from 'motion/react';

interface InventoryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const InventoryCard: React.FC<InventoryCardProps> = ({ title, value, icon, subtitle, trend }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 flex flex-col justify-between select-none text-left"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-wider block">
            {title}
          </span>
          <span className="text-xl font-black text-slate-800 dark:text-slate-100 font-mono">
            {value}
          </span>
        </div>
        <div className="p-2 bg-indigo-50/60 dark:bg-indigo-950/20 text-indigo-500 rounded-xl">
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-900 flex justify-between items-center text-[10px] font-medium">
          <span className="text-slate-400 font-light truncate max-w-[70%]">{subtitle}</span>
          {trend && (
            <span className={`font-mono font-bold ${trend.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};
