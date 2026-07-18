/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Clock, CheckCircle, AlertTriangle, Moon, ArrowRight } from 'lucide-react';
import { Attendance } from '../../../types/hr';

interface AttendanceCardProps {
  attendance: Attendance;
  onEdit?: (att: Attendance) => void;
  id?: string;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  attendance,
  onEdit,
  id
}) => {
  const statusStyles = {
    Present: {
      color: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
      icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
    },
    Late: {
      color: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
    },
    Absent: {
      color: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
    },
    'On Leave': {
      color: 'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30',
      icon: <Moon className="w-3.5 h-3.5 text-sky-500" />
    }
  };

  return (
    <motion.div
      id={id || `att-card-${attendance.id}`}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between text-left shadow-sm hover:shadow transition-shadow select-none"
    >
      <div className="space-y-3">
        {/* Header: Date & Status */}
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">
            {attendance.date}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 ${statusStyles[attendance.status]?.color || ''}`}>
            {statusStyles[attendance.status]?.icon}
            {attendance.status}
          </span>
        </div>

        {/* Name & Department */}
        <div>
          <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">
            {attendance.employeeName}
          </h4>
          <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase block">
            {attendance.department}
          </span>
        </div>

        {/* Times and Hours */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-950/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
          <div className="space-y-0.5">
            <span className="text-[8px] font-mono text-slate-400 dark:text-slate-500 uppercase font-black block">Check-In</span>
            <span className="text-xs font-black font-mono text-slate-700 dark:text-slate-300">
              {attendance.checkIn || '--:--'}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[8px] font-mono text-slate-400 dark:text-slate-500 uppercase font-black block">Check-Out</span>
            <span className="text-xs font-black font-mono text-slate-700 dark:text-slate-300">
              {attendance.checkOut || '--:--'}
            </span>
          </div>
        </div>

        {/* Metrics Footer */}
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Work: <strong className="text-slate-700 dark:text-slate-300">{attendance.workHours}h</strong></span>
          </div>
          {attendance.overtimeHours > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/30 text-[9px] font-black uppercase">
              OT: +{attendance.overtimeHours}h
            </span>
          )}
        </div>
      </div>

      {onEdit && (
        <button
          onClick={() => onEdit(attendance)}
          className="w-full text-center text-[9px] font-mono font-black uppercase text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 hover:bg-indigo-50/50 py-1.5 rounded-xl cursor-pointer mt-3 flex items-center justify-center gap-1"
        >
          Adjust Log <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </motion.div>
  );
};
