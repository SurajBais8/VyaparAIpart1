/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Building2, Users2, DollarSign, Target } from 'lucide-react';
import { Department } from '../../../types/hr';

interface DepartmentCardProps {
  department: Department;
  onEdit?: (dept: Department) => void;
  id?: string;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  onEdit,
  id
}) => {
  return (
    <motion.div
      id={id || `dept-card-${department.id}`}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 text-left shadow-sm hover:shadow transition-shadow select-none"
    >
      <div className="space-y-4">
        {/* Header: Name & ID */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-slate-950 border border-indigo-100/10 flex items-center justify-center">
              <Building2 className="w-4.5 h-4.5 text-indigo-500" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">
                {department.name}
              </h4>
              <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500">
                {department.id}
              </span>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-lg border border-indigo-100/30 bg-indigo-50/50 dark:bg-slate-950 text-[10px] font-mono font-black text-indigo-600 dark:text-indigo-400">
            {department.employeeCount} Members
          </span>
        </div>

        {/* Manager Details */}
        <div className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-850/60 flex justify-between items-center text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px]">Head Manager:</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">{department.manager}</span>
        </div>

        {/* Budget details */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-slate-400" /> Allocated Budget</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">₹{department.budget.toLocaleString()}</span>
          </div>
          {/* Progress bar representing budget execution (just a mock full bar) */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '74%' }}
              transition={{ duration: 0.8 }}
              className="bg-indigo-600 h-full rounded-full"
            />
          </div>
        </div>

        {/* Performance Index */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1"><Target className="w-3 h-3 text-indigo-500" /> Team Performance Index</span>
            <span className="font-black text-indigo-600 dark:text-indigo-400">{department.performance}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${department.performance}%` }}
              transition={{ duration: 0.8 }}
              className="bg-emerald-500 h-full rounded-full"
            />
          </div>
        </div>
      </div>

      {onEdit && (
        <button
          onClick={() => onEdit(department)}
          className="w-full text-center text-[9px] font-mono font-black uppercase text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 hover:bg-indigo-50/50 py-1.5 rounded-xl cursor-pointer mt-4 flex items-center justify-center gap-1"
        >
          Manage Department &rarr;
        </button>
      )}
    </motion.div>
  );
};
