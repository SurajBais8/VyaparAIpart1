import React from 'react';
import { BusinessScore } from '../../../types/analytics';
import { Shield, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface BusinessScoreCardProps {
  score: BusinessScore;
}

export const BusinessScoreCard: React.FC<BusinessScoreCardProps> = ({ score }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl text-left flex flex-col justify-between h-full shadow-lg"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center select-none">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-400">
            AI Business Score
          </span>
          <Shield className="w-5 h-5 text-indigo-400" />
        </div>

        <div className="space-y-0.5 select-text">
          <span className="text-[10px] text-slate-400 font-mono block">Overall Health Grade</span>
          <h2 className="text-3xl font-black font-mono tracking-tight text-white">
            {score.overallScore} <span className="text-lg font-light text-slate-450">/ 100</span>
          </h2>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[8px] font-black uppercase font-mono bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 rounded mt-2 select-none">
            ● Status: Robust Operations
          </span>
        </div>
      </div>

      <div className="space-y-2 border-t border-indigo-500/10 pt-6 mt-6 select-none font-mono text-[10px]">
        {score.factors.slice(0, 3).map((f, idx) => (
          <div key={idx} className="flex justify-between items-center py-1">
            <span className="text-slate-400">{f.name}:</span>
            <span className="font-bold text-slate-200">{f.score}% ({f.status})</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
