import React from 'react';
import { Expense } from '../../../types/accounting';
import { Receipt, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface ExpenseCardProps {
  expense: Expense;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onApprove, onReject }) => {
  const getStatusColor = (status: Expense['status']) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'Pending Approval': return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400';
      case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400';
      default: return 'bg-slate-50 text-slate-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850/60 rounded-2xl text-left flex flex-col justify-between"
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-black text-indigo-500">{expense.id}</span>
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">{expense.category}</h4>
          </div>
          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase font-mono tracking-wider border ${getStatusColor(expense.status)}`}>
            {expense.status}
          </span>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 font-light line-clamp-2 min-h-[32px]">
          {expense.description}
        </p>

        <div className="text-[9px] font-mono border-t border-b border-slate-50 dark:border-slate-900 py-3 grid grid-cols-2 gap-2">
          <div>
            <span className="block text-[8px] uppercase text-slate-400 font-bold">Filing Date</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{expense.date}</span>
          </div>
          <div>
            <span className="block text-[8px] uppercase text-slate-400 font-bold">GST Included</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">₹{expense.gstAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-1">
          <div>
            <span className="block text-[8px] font-black text-slate-400 uppercase font-mono">Book Expense Amount</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono">
              ₹{expense.amount.toLocaleString()}
            </span>
          </div>

          <div className="flex gap-1.5">
            {expense.status === 'Pending Approval' && onApprove && (
              <button
                onClick={() => onApprove(expense.id)}
                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[9px] font-black uppercase font-mono cursor-pointer"
              >
                Approve
              </button>
            )}
            {expense.status === 'Pending Approval' && onReject && (
              <button
                onClick={() => onReject(expense.id)}
                className="px-2 py-1 border border-rose-200 text-rose-500 hover:bg-rose-50 rounded-lg text-[9px] font-black uppercase font-mono cursor-pointer"
              >
                Reject
              </button>
            )}
            {expense.receipt && (
              <span className="p-1.5 rounded-lg border border-slate-150 text-slate-450 flex items-center gap-1 text-[9px] font-bold uppercase font-mono">
                <Receipt className="w-3.5 h-3.5" /> Receipt Attached
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
