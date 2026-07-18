/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Card } from '../ui';
import { Mail, Phone, Flame, User, Globe } from 'lucide-react';
import { motion } from 'motion/react';

interface LeadCardProps {
  lead: any;
  onClick?: () => void;
  draggableProps?: any;
  dragHandleProps?: any;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onClick,
  draggableProps = {},
  dragHandleProps = {}
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-orange-500 bg-orange-500/10 border-orange-500/10';
    if (score >= 50) return 'text-amber-500 bg-amber-500/10 border-amber-500/10';
    return 'text-blue-500 bg-blue-500/10 border-blue-500/10';
  };

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      {...draggableProps}
      className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 p-4 rounded-xl shadow-xs hover:shadow-md cursor-grab active:cursor-grabbing text-left space-y-3 transition-shadow duration-300 select-none"
    >
      <div className="flex justify-between items-start gap-2" {...dragHandleProps}>
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[130px]">{lead.name}</h4>
          <span className="text-[10px] text-slate-450 truncate max-w-[130px] block font-medium">{lead.company}</span>
        </div>

        {lead.score && (
          <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border text-[9px] font-black font-mono tracking-wide ${getScoreColor(lead.score)}`}>
            <Flame className="w-2.5 h-2.5" />
            <span>{lead.score}</span>
          </span>
        )}
      </div>

      <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-1 font-mono">
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="truncate">{lead.source}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="truncate">{lead.owner || 'Unassigned'}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-850 flex justify-between items-center text-[9px]">
        <span className="text-slate-400 font-bold font-mono uppercase">ID: {lead.id}</span>
        <span className="text-slate-400 font-light font-mono">Contact: {lead.lastContact}</span>
      </div>
    </motion.div>
  );
};
