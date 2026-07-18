import React from 'react';
import { Sparkles, TrendingUp, ShieldAlert, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

interface AIInsightCardProps {
  title: string;
  insights: string[];
  score?: number;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ title, insights, score }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 bg-gradient-to-br from-indigo-950 via-slate-950 to-indigo-900 border border-slate-850 rounded-2xl text-left text-white shadow-lg space-y-4"
    >
      <div className="flex justify-between items-center select-none">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4.5 h-4.5 text-purple-400 animate-pulse" />
          <span className="text-[10px] font-mono font-black uppercase tracking-wider text-purple-300">
            {title}
          </span>
        </div>
        <Cpu className="w-4 h-4 text-purple-400" />
      </div>

      {score !== undefined && (
        <div className="py-2 border-b border-white/5 flex justify-between items-center select-none">
          <span className="text-[10px] text-slate-400 font-mono">Cognitive Health Grade</span>
          <span className="text-xl font-black font-mono text-purple-300">{score}/100</span>
        </div>
      )}

      <ul className="space-y-2.5 text-xs font-light text-slate-300 select-text leading-relaxed">
        {insights.map((ins, idx) => (
          <li key={idx} className="flex gap-2 items-start">
            <span className="text-purple-400 font-bold font-mono mt-0.5">•</span>
            <span>{ins}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
