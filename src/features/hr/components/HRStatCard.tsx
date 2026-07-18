/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface HRStatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'teal';
  id?: string;
}

export const HRStatCard: React.FC<HRStatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  color = 'indigo',
  id
}) => {
  const bgStyles = {
    indigo: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50',
    amber: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50',
    rose: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50',
    sky: 'bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-900/50',
    violet: 'bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-900/50',
    teal: 'bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-900/50',
  };

  return (
    <motion.div
      id={id}
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="p-5 bg-white dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl flex items-center justify-between shadow-sm select-none"
    >
      <div className="space-y-1 text-left">
        <span className="text-[10px] font-mono font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
          {label}
        </span>
        <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight font-mono">
          {value}
        </h4>
        {subtext && (
          <p className="text-[10px] text-slate-450 dark:text-slate-500 font-mono font-medium">
            {subtext}
          </p>
        )}
      </div>

      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${bgStyles[color]}`}>
        {icon}
      </div>
    </motion.div>
  );
};
