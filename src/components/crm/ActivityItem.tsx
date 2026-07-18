/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Phone, Mail, MessageSquare, Calendar, CheckSquare, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface ActivityItemProps {
  activity: {
    id: string;
    type: 'call' | 'meeting' | 'email' | 'whatsapp' | 'task' | string;
    title: string;
    desc: string;
    date: string;
    time: string;
    user: string;
    contact?: string;
    company?: string;
  };
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="w-4 h-4 text-emerald-500" />;
      case 'meeting':
        return <Calendar className="w-4 h-4 text-rose-500" />;
      case 'email':
        return <Mail className="w-4 h-4 text-indigo-500" />;
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-teal-500" />;
      default:
        return <CheckSquare className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.005 }}
      className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-850/60 bg-white/70 dark:bg-slate-950/75 flex gap-4 items-start text-left hover:shadow-md transition-all duration-300"
    >
      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex-shrink-0">
        {getIcon(activity.type)}
      </div>

      <div className="space-y-1 flex-grow overflow-hidden">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{activity.title}</h4>
            {activity.company && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-medium">
                {activity.contact} @ {activity.company}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-mono font-bold flex-shrink-0 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {activity.date} ({activity.time})
          </span>
        </div>

        <p className="text-xs text-slate-550 dark:text-slate-400 font-light leading-relaxed">{activity.desc}</p>
        
        <div className="text-[9px] font-mono font-bold text-indigo-500 dark:text-indigo-400 pt-1">
          Logged by: {activity.user}
        </div>
      </div>
    </motion.div>
  );
};
