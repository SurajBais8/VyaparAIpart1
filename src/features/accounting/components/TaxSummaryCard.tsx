import React from 'react';
import { GSTSummary } from '../../../types/accounting';
import { Shield, TrendingDown, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface TaxSummaryCardProps {
  summary: GSTSummary;
}

export const TaxSummaryCard: React.FC<TaxSummaryCardProps> = ({ summary }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl text-left flex flex-col justify-between h-full shadow-lg"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center select-none">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-400">
            GST Regulatory Summary
          </span>
          <Shield className="w-5 h-5 text-indigo-400" />
        </div>

        <div className="space-y-0.5 select-text">
          <span className="text-[10px] text-slate-400 font-mono block">Net GST Liability</span>
          <h2 className="text-2xl font-black font-mono tracking-tight text-white">
            ₹{summary.pendingGst.toLocaleString()}
          </h2>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[8px] font-black uppercase font-mono bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 rounded mt-2 select-none">
            ● Status: {summary.filingStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-indigo-500/10 pt-6 mt-6 select-none font-mono">
        <div className="space-y-1">
          <span className="block text-[8px] font-bold text-slate-400 uppercase">GST Output Collected</span>
          <span className="text-sm font-black text-slate-200">₹{summary.gstCollected.toLocaleString()}</span>
        </div>
        <div className="space-y-1">
          <span className="block text-[8px] font-bold text-slate-400 uppercase">GST Input Credit Paid</span>
          <span className="text-sm font-black text-slate-200">₹{summary.gstPaid.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
};
