/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, Calendar, User, Star } from 'lucide-react';
import { Employee } from '../../../types/hr';

interface EmployeeCardProps {
  employee: Employee;
  onClick: (emp: Employee) => void;
  id?: string;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onClick,
  id
}) => {
  const statusColors = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
    'On Leave': 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
    Terminated: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30',
    Suspended: 'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-900/40 dark:text-slate-400 dark:border-slate-800/30',
  };

  return (
    <motion.div
      id={id || `emp-card-${employee.id}`}
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer select-none flex flex-col justify-between text-left h-full"
      onClick={() => onClick(employee)}
    >
      <div className="space-y-4">
        {/* Top bar with ID & Status */}
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-850">
            {employee.id}
          </span>
          <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${statusColors[employee.status]}`}>
            {employee.status}
          </span>
        </div>

        {/* Profile Info */}
        <div className="flex items-center gap-3">
          <img
            src={employee.photo}
            alt={employee.name}
            className="w-12 h-12 rounded-xl object-crop border border-slate-100 dark:border-slate-850 shadow-inner"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${employee.name}`;
            }}
          />
          <div className="overflow-hidden">
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight truncate">
              {employee.name}
            </h4>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
              {employee.designation}
            </p>
            <span className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mt-0.5">
              {employee.department}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 dark:border-slate-850/50 my-2" />

        {/* Quick details */}
        <div className="space-y-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 truncate">
            <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="truncate">{employee.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span>{employee.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span>Joined {employee.joiningDate}</span>
          </div>
        </div>
      </div>

      {/* AI Evaluation rating index in the footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850/50 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="text-xs font-black font-mono text-slate-800 dark:text-slate-200">
            {employee.performanceRating.toFixed(1)}
          </span>
          <span className="text-[9px] text-slate-400 font-mono">Rating</span>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold font-sans flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <User className="w-3.5 h-3.5" /> Inspect profile &rarr;
        </span>
      </div>
    </motion.div>
  );
};
