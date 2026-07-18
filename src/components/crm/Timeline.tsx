/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Phone, Mail, MessageSquare, CreditCard, FileText, User, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface TimelineItem {
  id?: string;
  type: 'call' | 'email' | 'whatsapp' | 'payment' | 'document' | 'followup' | 'note' | string;
  title: string;
  desc: string;
  time: string;
  user?: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
      case 'whatsapp':
        return <MessageSquare className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />;
      case 'payment':
        return <CreditCard className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'document':
        return <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case 'followup':
        return <Calendar className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
      default:
        return <User className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'call':
        return 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/15';
      case 'email':
        return 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500/15';
      case 'whatsapp':
        return 'bg-teal-50 dark:bg-teal-950/40 border-teal-500/15';
      case 'payment':
        return 'bg-amber-50 dark:bg-amber-950/40 border-amber-500/15';
      case 'document':
        return 'bg-blue-50 dark:bg-blue-950/40 border-blue-500/15';
      case 'followup':
        return 'bg-rose-50 dark:bg-rose-950/40 border-rose-500/15';
      default:
        return 'bg-slate-50 dark:bg-slate-900 border-slate-500/15';
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-slate-450 italic">
        No interaction timeline records found.
      </div>
    );
  }

  return (
    <div className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-900 text-left space-y-6">
      {items.map((item, index) => (
        <motion.div
          key={item.id || index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="relative group"
        >
          {/* Bullet Dot Indicator */}
          <span className={`absolute -left-10 top-0.5 w-8 h-8 rounded-xl border flex items-center justify-center shadow-xs transition-colors duration-300 ${getBgColor(item.type)}`}>
            {getIcon(item.type)}
          </span>

          <div className="space-y-1 bg-white/40 dark:bg-slate-900/10 p-3.5 rounded-xl border border-slate-100 dark:border-slate-900/60 shadow-2xs hover:shadow-sm transition-all duration-300">
            <div className="flex justify-between items-center gap-3">
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100">{item.title}</h5>
              <span className="text-[10px] font-medium text-slate-400 font-mono flex-shrink-0">{item.time}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">{item.desc}</p>
            {item.user && (
              <div className="flex items-center gap-1 text-[10px] text-indigo-500 dark:text-indigo-400 font-mono pt-1 font-bold">
                <User className="w-3 h-3" />
                <span>By: {item.user}</span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
