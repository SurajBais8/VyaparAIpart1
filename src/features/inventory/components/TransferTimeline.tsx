import React from 'react';
import { motion } from 'motion/react';
import { Truck, CheckCircle2, MapPin } from 'lucide-react';

interface TransferCheckpoint {
  date: string;
  title: string;
  description: string;
}

interface TransferTimelineProps {
  checkpoints: TransferCheckpoint[];
}

export const TransferTimeline: React.FC<TransferTimelineProps> = ({ checkpoints }) => {
  return (
    <div className="space-y-4 text-left select-none">
      <h3 className="text-xs font-black uppercase text-slate-400 font-mono tracking-wider">
        Transfer Track & Trace
      </h3>

      <div className="relative border-l border-slate-100 dark:border-slate-900 pl-4 space-y-4">
        {checkpoints.map((cp, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="relative"
          >
            {/* Bullet icon representing courier progression */}
            <span className="absolute -left-[22px] top-1.5 w-3 h-3 rounded-full bg-indigo-500 flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-white" />
            </span>

            {/* Checkpoint info card */}
            <div className="bg-slate-50/50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-100 dark:border-slate-850/60 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350">{cp.title}</span>
                <span className="text-[8px] text-slate-400 font-mono">{cp.date}</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-450 font-light leading-relaxed">
                {cp.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
