import React from 'react';
import { motion } from 'motion/react';
import { FileText, Calendar, DollarSign, Package } from 'lucide-react';
import { PurchaseOrder } from '../services/purchase.service';

interface PurchaseCardProps {
  po: PurchaseOrder;
  onClick?: () => void;
}

export const PurchaseCard: React.FC<PurchaseCardProps> = ({ po, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 hover:border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer transition-all select-none text-left flex flex-col justify-between h-full space-y-4"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <span className="font-mono text-[9px] font-black uppercase tracking-widest text-indigo-500 px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-500/10 rounded">
              {po.id}
            </span>
            <h3 className="text-xs font-black uppercase text-slate-800 dark:text-slate-100 font-mono tracking-wide mt-2 block truncate">
              {po.supplierName}
            </h3>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border font-mono tracking-wider uppercase
            ${po.status === 'Received' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' : ''}
            ${po.status === 'Approved' ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/10' : ''}
            ${po.status === 'Pending Approval' ? 'bg-amber-500/10 text-amber-600 border-amber-500/10' : ''}
            ${po.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-600 border-rose-500/10' : ''}
          `}>
            {po.status}
          </span>
        </div>

        {/* Amount & Quantity details */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-850">
            <span className="block text-[8px] font-black uppercase text-slate-400 font-mono flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-slate-400" /> TOTAL VALUE
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
              ₹{po.amount.toLocaleString()}
            </span>
          </div>

          <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-850">
            <span className="block text-[8px] font-black uppercase text-slate-400 font-mono flex items-center gap-1">
              <Package className="w-3 h-3 text-slate-400" /> QUANTITY
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
              {po.quantity} items
            </span>
          </div>
        </div>

        {/* Footer info: Warehouse & Dates */}
        <div className="space-y-1.5 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Expected: <strong className="font-bold text-slate-700 dark:text-slate-350">{po.expectedDate}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Warehouse: {po.warehouseName}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-900 flex justify-between items-center text-[9px] font-mono font-black text-slate-400">
        <span>ISSUED: {po.createdDate}</span>
        <span>{po.documents?.length || 0} DOCS ATTACHED</span>
      </div>
    </motion.div>
  );
};
