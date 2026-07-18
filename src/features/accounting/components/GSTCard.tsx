import React from 'react';
import { GSTFiling } from '../../../types/accounting';
import { ClipboardList, ShieldAlert, BadgeCheck, FileCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface GSTCardProps {
  filing: GSTFiling;
}

export const GSTCard: React.FC<GSTCardProps> = ({ filing }) => {
  const getFilingBadgeColor = (status: string) => {
    return status === 'Filed' 
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/10' 
      : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/10';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850/60 rounded-2xl text-left space-y-4"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono font-black text-indigo-500 uppercase tracking-widest">TAX FILING CYCLE</span>
          <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">{filing.period}</h4>
        </div>
        <ClipboardList className="w-5 h-5 text-indigo-500" />
      </div>

      <div className="text-[10px] font-mono grid grid-cols-3 gap-2 border-b border-t border-slate-50 dark:border-slate-900 py-3 select-none">
        <div>
          <span className="block text-[8px] uppercase text-slate-400 font-bold">GSTR-1</span>
          <span className={`px-1.5 py-0.5 rounded border text-[8px] font-bold ${getFilingBadgeColor(filing.gstr1Status)}`}>
            {filing.gstr1Status}
          </span>
          <span className="block text-[8px] text-slate-400 mt-1">{filing.gstr1Date}</span>
        </div>
        <div>
          <span className="block text-[8px] uppercase text-slate-400 font-bold">GSTR-2</span>
          <span className={`px-1.5 py-0.5 rounded border text-[8px] font-bold ${getFilingBadgeColor(filing.gstr2Status)}`}>
            {filing.gstr2Status}
          </span>
          <span className="block text-[8px] text-slate-400 mt-1">{filing.gstr2Date}</span>
        </div>
        <div>
          <span className="block text-[8px] uppercase text-slate-400 font-bold">GSTR-3B</span>
          <span className={`px-1.5 py-0.5 rounded border text-[8px] font-bold ${getFilingBadgeColor(filing.gstr3bStatus)}`}>
            {filing.gstr3bStatus}
          </span>
          <span className="block text-[8px] text-slate-400 mt-1">{filing.gstr3bDate}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-[10px] font-mono select-none">
        <div>
          <span className="block text-[8px] uppercase text-slate-400 font-bold">Total ITC Paid</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">₹{filing.taxPaid.toLocaleString()}</span>
        </div>
        <div>
          <span className="block text-[8px] uppercase text-slate-400 font-bold">Tax Liability</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">₹{filing.taxCollected.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-slate-50 dark:border-slate-900 pt-3 select-none">
        <div>
          <span className="block text-[8px] font-black text-slate-400 uppercase font-mono">Net Settlement Payable</span>
          <span className="text-xs font-black font-mono text-indigo-600 dark:text-indigo-400">
            ₹{filing.netLiability.toLocaleString()}
          </span>
        </div>
        <span className="text-[9px] text-indigo-500 font-mono font-bold flex items-center gap-0.5">
          <BadgeCheck className="w-3.5 h-3.5" /> Compliant
        </span>
      </div>
    </motion.div>
  );
};
