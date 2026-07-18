/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { LeaveRequest } from '../../../types/hr';

interface LeaveCalendarProps {
  leaveRequests: LeaveRequest[];
  id?: string;
}

export const LeaveCalendar: React.FC<LeaveCalendarProps> = ({
  leaveRequests,
  id
}) => {
  const [currentMonth, setCurrentMonth] = useState(6); // July (0-indexed base)
  const daysInMonth = 31;
  const monthName = 'July 2026';

  // Return leaves scheduled for a specific date (July dates)
  const getLeavesForDate = (dateNum: number) => {
    const targetDateStr = `2026-07-${String(dateNum).padStart(2, '0')}`;
    return leaveRequests.filter((req) => {
      if (req.status !== 'Approved') return false;
      const start = new Date(req.startDate).getTime();
      const end = new Date(req.endDate).getTime();
      const current = new Date(targetDateStr).getTime();
      return current >= start && current <= end;
    });
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // Let's assume July 1, 2026 starts on a Wednesday (weekday index 3)
  const startingDayOffset = 3;

  const calendarCells = [];
  for (let i = 0; i < startingDayOffset; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="h-14 bg-slate-50/40 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-850/30 rounded-lg" />);
  }

  for (let date = 1; date <= daysInMonth; date++) {
    const leaves = getLeavesForDate(date);
    const hasLeaves = leaves.length > 0;

    calendarCells.push(
      <motion.div
        key={`day-${date}`}
        whileHover={{ scale: 1.05 }}
        className={`h-14 p-1.5 border border-slate-150 dark:border-slate-800 rounded-xl text-left flex flex-col justify-between transition-colors
          ${hasLeaves 
            ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200/50' 
            : 'bg-white dark:bg-slate-900'}`}
      >
        <span className={`text-[10px] font-mono font-black ${hasLeaves ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>
          {date}
        </span>
        
        {hasLeaves && (
          <div className="flex flex-col gap-0.5 overflow-hidden">
            {leaves.slice(0, 2).map((l, i) => (
              <span
                key={i}
                className="text-[7px] font-bold font-sans truncate bg-indigo-600 text-white px-1 py-0.5 rounded block text-center"
                title={`${l.employeeName} (${l.leaveType})`}
              >
                {l.employeeName.split(' ')[0]}
              </span>
            ))}
            {leaves.length > 2 && (
              <span className="text-[6px] font-black text-slate-400 text-center block">+{leaves.length - 2} more</span>
            )}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div id={id || 'leave-calendar-wrapper'} className="bg-white dark:bg-slate-900/95 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 select-none text-left shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-indigo-500" />
          <h4 className="text-xs font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200">
            {monthName} Leaves Board
          </h4>
        </div>
        
        <div className="flex gap-1.5">
          <button className="p-1 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:text-slate-600 cursor-not-allowed">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:text-slate-600 cursor-not-allowed">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1.5 text-center mb-1">
        {weekdays.map((wd) => (
          <span key={wd} className="text-[8px] font-mono font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {wd}
          </span>
        ))}
      </div>

      {/* Grid cells */}
      <div className="grid grid-cols-7 gap-1.5">
        {calendarCells}
      </div>
    </div>
  );
};
