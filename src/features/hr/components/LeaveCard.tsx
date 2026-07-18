/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Calendar, User, Check, X, ShieldAlert } from 'lucide-react';
import { LeaveRequest } from '../../../types/hr';

interface LeaveCardProps {
  request: LeaveRequest;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  id?: string;
}

export const LeaveCard: React.FC<LeaveCardProps> = ({
  request,
  onApprove,
  onReject,
  id
}) => {
  const statusColors = {
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
    Pending: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
    Rejected: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30'
  };

  return (
    <motion.div
      id={id || `leave-card-${request.id}`}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 text-left shadow-sm hover:shadow transition-shadow select-none flex flex-col justify-between"
    >
      <div className="space-y-4">
        {/* Header: ID & Status */}
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">
            {request.id} &bull; {request.leaveType}
          </span>
          <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${statusColors[request.status]}`}>
            {request.status}
          </span>
        </div>

        {/* Employee Info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-slate-950 border border-indigo-100/10 flex items-center justify-center">
            <User className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 tracking-tight">
              {request.employeeName}
            </h4>
            <span className="text-[8px] font-mono text-slate-400 dark:text-slate-500 uppercase block">
              {request.department}
            </span>
          </div>
        </div>

        {/* Calendar details */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 dark:bg-slate-950/50 p-2 rounded-xl border border-slate-100 dark:border-slate-850">
          <div>
            <span className="text-[8px] text-slate-400 uppercase font-black block">Start Date</span>
            <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">{request.startDate}</span>
          </div>
          <div>
            <span className="text-[8px] text-slate-400 uppercase font-black block">End Date</span>
            <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">{request.endDate}</span>
          </div>
        </div>

        {/* Reason */}
        <div className="space-y-1">
          <span className="text-[8px] font-mono text-slate-400 uppercase font-black block">Reason Statement</span>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed bg-slate-50/50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100/30">
            &ldquo;{request.reason}&rdquo;
          </p>
        </div>

        {/* Days count display */}
        <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Total Duration:
          </span>
          <span className="font-black text-slate-800 dark:text-slate-200">
            {request.days} {request.days === 1 ? 'Day' : 'Days'}
          </span>
        </div>
      </div>

      {/* Approve/Reject Buttons */}
      {request.status === 'Pending' && (
        <div className="flex gap-2 mt-4 pt-1">
          {onApprove && (
            <button
              onClick={() => onApprove(request.id)}
              className="flex-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase font-mono tracking-wider flex items-center justify-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" /> Approve
            </button>
          )}
          {onReject && (
            <button
              onClick={() => onReject(request.id)}
              className="flex-1 px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl text-[10px] font-black uppercase font-mono tracking-wider flex items-center justify-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Reject
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};
