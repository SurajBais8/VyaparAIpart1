import React from 'react';
import { Payment } from '../../../types/accounting';
import { Coins, CheckCircle, Clock, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import { motion } from 'motion/react';

interface PaymentCardProps {
  payment: Payment;
  onView: (id: string) => void;
  onRefund?: (id: string) => void;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({ payment, onView, onRefund }) => {
  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20';
      case 'Failed': return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850/60 rounded-2xl flex flex-col justify-between text-left"
    >
      <div className="space-y-3.5">
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-black text-slate-400">{payment.id}</span>
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 truncate max-w-[150px]">
              {payment.customerName}
            </h4>
          </div>
          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase font-mono tracking-wider border ${getStatusColor(payment.status)}`}>
            {payment.status}
          </span>
        </div>

        <div className="text-[10px] font-mono border-t border-b border-slate-50 dark:border-slate-900 py-3 grid grid-cols-2 gap-3">
          <div>
            <span className="block text-[8px] uppercase text-slate-400 font-bold">Linked Invoice</span>
            <span className="font-bold text-indigo-500">{payment.invoiceId}</span>
          </div>
          <div>
            <span className="block text-[8px] uppercase text-slate-400 font-bold">Settlement Method</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{payment.method}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-1">
          <div>
            <span className="block text-[8px] font-black text-slate-400 uppercase font-mono">Gross Remittance</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono">
              ₹{payment.amount.toLocaleString()}
            </span>
          </div>

          <div className="flex gap-1.5">
            {payment.status === 'Completed' && onRefund && (
              <button
                onClick={() => onRefund(payment.id)}
                className="px-2 py-1.5 rounded-xl border border-rose-500/10 hover:border-rose-500 text-[10px] font-black font-mono uppercase tracking-wider text-rose-500 hover:bg-rose-50/20 cursor-pointer"
              >
                Refund
              </button>
            )}
            <button
              onClick={() => onView(payment.id)}
              className="p-1.5 rounded-lg border border-slate-150 dark:border-slate-850 text-indigo-500 hover:bg-indigo-50/20 cursor-pointer"
              title="Audit payment timeline"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
