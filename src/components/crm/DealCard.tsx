/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Card } from '../ui';
import { Calendar, DollarSign, TrendingUp, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

interface DealCardProps {
  deal: any;
  onClick?: () => void;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, onClick }) => {
  const getProbabilityColor = (p: number) => {
    if (p >= 80) return 'text-emerald-500 bg-emerald-500/10';
    if (p >= 50) return 'text-amber-500 bg-amber-500/10';
    return 'text-red-500 bg-red-500/10';
  };

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      onClick={onClick}
      className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 p-4 rounded-xl shadow-xs hover:shadow-md cursor-pointer text-left space-y-3 transition-shadow duration-300 select-none"
    >
      <div className="flex justify-between items-start gap-2">
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[130px]">{deal.name}</h4>
          <span className="text-[10px] text-slate-450 truncate max-w-[130px] block font-medium">{deal.company}</span>
        </div>

        {deal.probability !== undefined && (
          <span className={`inline-flex px-1.5 py-0.5 rounded-md text-[9px] font-black font-mono tracking-wide ${getProbabilityColor(deal.probability)}`}>
            {deal.probability}%
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-1 font-mono text-[11px]">
        <span className="font-extrabold text-indigo-600 dark:text-indigo-400">₹{deal.value.toLocaleString()}</span>
        <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 text-[9px]">
          <Calendar className="w-3 h-3" /> {deal.expectedClosing}
        </span>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-850 flex justify-between items-center text-[9px] text-slate-400 font-mono">
        <span>Owner: {deal.owner}</span>
        <span className="capitalize">{deal.stage}</span>
      </div>
    </motion.div>
  );
};
