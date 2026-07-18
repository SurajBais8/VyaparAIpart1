import React from 'react';
import { Ledger } from '../../../types/accounting';
import { BookOpen, ArrowUpRight, ArrowDownLeft, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface LedgerCardProps {
  ledger: Ledger;
}

export const LedgerCard: React.FC<LedgerCardProps> = ({ ledger }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850/60 rounded-2xl text-left space-y-4"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono font-black text-indigo-600 dark:text-indigo-400">{ledger.id}</span>
          <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">{ledger.name}</h4>
          <span className="inline-block px-1.5 py-0.5 text-[8px] font-black uppercase font-mono bg-slate-100 dark:bg-slate-900 text-slate-500 rounded">
            {ledger.type}
          </span>
        </div>
        <BookOpen className="w-5 h-5 text-slate-400" />
      </div>

      <p className="text-[11px] text-slate-400 font-light min-h-[32px]">
        {ledger.description}
      </p>

      <div className="grid grid-cols-2 gap-3 text-[10px] font-mono border-t border-b border-slate-50 dark:border-slate-900 py-3">
        <div className="flex items-center gap-1.5 text-emerald-600">
          <ArrowDownLeft className="w-3.5 h-3.5" />
          <div>
            <span className="block text-[8px] uppercase text-slate-400 font-bold">Credits</span>
            <span className="font-bold">₹{ledger.credit.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-rose-500">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <div>
            <span className="block text-[8px] uppercase text-slate-400 font-bold">Debits</span>
            <span className="font-bold">₹{ledger.debit.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center select-none pt-1">
        <div>
          <span className="block text-[8px] font-black text-slate-400 uppercase font-mono">Net Ledger Balance</span>
          <span className={`text-sm font-black font-mono ${ledger.balance >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
            ₹{ledger.balance.toLocaleString()}
          </span>
        </div>
        <span className="text-[9px] text-slate-400 font-mono">As of {ledger.lastUpdated}</span>
      </div>
    </motion.div>
  );
};
