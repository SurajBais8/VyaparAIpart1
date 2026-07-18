import React from 'react';
import { Invoice } from '../../../types/accounting';
import { FileText, Eye, CheckCircle2, AlertCircle, Clock, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface InvoiceCardProps {
  invoice: Invoice;
  onView: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, onView, onDelete }) => {
  const getStatusStyle = (status: Invoice['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30';
      case 'Overdue':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30';
      case 'Unpaid':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30';
      case 'Draft':
        return 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'Paid': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'Overdue': return <AlertCircle className="w-3.5 h-3.5 animate-pulse" />;
      case 'Unpaid': return <Clock className="w-3.5 h-3.5" />;
      default: return <FileText className="w-3.5 h-3.5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -2 }}
      className="p-5 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850/60 rounded-2xl shadow-2xs hover:shadow-xs transition-all text-left flex flex-col justify-between"
    >
      <div className="space-y-3.5">
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-black text-indigo-600 dark:text-indigo-400">{invoice.id}</span>
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 truncate max-w-[160px]">
              {invoice.customerName}
            </h4>
          </div>
          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase font-mono tracking-wider border flex items-center gap-1 ${getStatusStyle(invoice.status)}`}>
            {getStatusIcon(invoice.status)}
            {invoice.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[10px] font-mono border-t border-b border-slate-50 dark:border-slate-900 py-3 select-none">
          <div>
            <span className="block text-slate-400 text-[8px] font-black uppercase">Issued</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{invoice.invoiceDate}</span>
          </div>
          <div>
            <span className="block text-slate-400 text-[8px] font-black uppercase">Due Date</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{invoice.dueDate}</span>
          </div>
        </div>

        <div className="flex justify-between items-center select-none pt-1">
          <div>
            <span className="block text-[8px] font-black text-slate-400 uppercase font-mono">Gross Total</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono">
              ₹{invoice.totalAmount.toLocaleString()}
            </span>
          </div>

          <div className="flex gap-1.5">
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(invoice.id);
                }}
                className="p-1.5 rounded-lg border border-slate-150 dark:border-slate-850 hover:border-rose-500/30 text-rose-500 cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/10 transition-colors"
                title="Wipe record"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => onView(invoice.id)}
              className="p-1.5 rounded-lg border border-slate-150 dark:border-slate-850 hover:border-indigo-500/30 text-indigo-500 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950/10 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase font-mono"
            >
              <Eye className="w-3.5 h-3.5" /> Details
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
