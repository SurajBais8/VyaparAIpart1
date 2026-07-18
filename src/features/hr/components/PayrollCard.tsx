/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, CheckCircle, AlertTriangle, RefreshCw, FileText } from 'lucide-react';
import { Payroll } from '../../../types/hr';

interface PayrollCardProps {
  payroll: Payroll;
  onPay?: (id: string) => void;
  onEdit?: (payroll: Payroll) => void;
  id?: string;
}

export const PayrollCard: React.FC<PayrollCardProps> = ({
  payroll,
  onPay,
  onEdit,
  id
}) => {
  const statusStyles = {
    Paid: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
    Pending: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
    Processing: 'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30'
  };

  return (
    <motion.div
      id={id || `pay-card-${payroll.id}`}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 text-left shadow-sm hover:shadow transition-shadow select-none flex flex-col justify-between"
    >
      <div className="space-y-4">
        {/* Top bar with Status */}
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">
            {payroll.id} &bull; {payroll.month}
          </span>
          <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${statusStyles[payroll.status]}`}>
            {payroll.status}
          </span>
        </div>

        {/* Employee Info */}
        <div>
          <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">
            {payroll.employeeName}
          </h4>
          <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase block">
            {payroll.department}
          </span>
        </div>

        {/* Breakdowns */}
        <div className="space-y-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 border-y border-slate-100 dark:border-slate-850/50 py-3 my-2">
          <div className="flex justify-between">
            <span>Basic Base Salary:</span>
            <span className="text-slate-700 dark:text-slate-300">₹{payroll.basicSalary.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Allowances (+):</span>
            <span className="text-emerald-600 dark:text-emerald-400">+₹{payroll.allowances.toLocaleString()}</span>
          </div>
          {payroll.bonus > 0 && (
            <div className="flex justify-between">
              <span>Bonus (+):</span>
              <span className="text-indigo-600 dark:text-indigo-400">+₹{payroll.bonus.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Deductions (-):</span>
            <span className="text-rose-600 dark:text-rose-400">-₹{payroll.deductions.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Income Tax (-):</span>
            <span className="text-rose-600 dark:text-rose-400">-₹{payroll.tax.toLocaleString()}</span>
          </div>
        </div>

        {/* Total Net Payable */}
        <div className="flex justify-between items-center bg-indigo-50/40 dark:bg-slate-950 p-3 rounded-xl border border-indigo-100/10">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 font-sans">Net Payout:</span>
          <span className="text-base font-black text-slate-850 dark:text-indigo-400 font-mono">
            ₹{payroll.netPayable.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-1">
        {payroll.status !== 'Paid' && onPay && (
          <button
            onClick={() => onPay(payroll.id)}
            className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase font-mono tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-600/10"
          >
            <CreditCard className="w-3.5 h-3.5" /> Disburse Salary
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(payroll)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase font-mono tracking-wider flex items-center justify-center gap-1 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900"
            title="Adjust salary factors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
