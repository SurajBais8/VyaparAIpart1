import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownLeft, RefreshCcw } from 'lucide-react';

interface TimelineEvent {
  date: string;
  change: number;
  type: string; // 'Inbound' | 'Outbound' | 'Adjustment' | 'Reserved'
  balance: number;
  notes: string;
}

interface StockTimelineProps {
  events: TimelineEvent[];
}

export const StockTimeline: React.FC<StockTimelineProps> = ({ events }) => {
  return (
    <div className="space-y-4 text-left select-none">
      <h3 className="text-xs font-black uppercase text-slate-400 font-mono tracking-wider">
        Product Stock History
      </h3>

      <div className="relative border-l border-slate-100 dark:border-slate-900 pl-4 space-y-5">
        {events.map((event, idx) => {
          const isPositive = event.change > 0;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative"
            >
              {/* Bullet circle */}
              <span className={`absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-white dark:bg-slate-950 flex items-center justify-center
                ${event.type === 'Inbound' ? 'border-emerald-500' : ''}
                ${event.type === 'Outbound' ? 'border-rose-500' : ''}
                ${event.type === 'Reserved' ? 'border-amber-500' : ''}
                ${event.type === 'Adjustment' ? 'border-indigo-500' : ''}
              `}>
                <span className={`w-1 h-1 rounded-full
                  ${event.type === 'Inbound' ? 'bg-emerald-500' : ''}
                  ${event.type === 'Outbound' ? 'bg-rose-500' : ''}
                  ${event.type === 'Reserved' ? 'bg-amber-500' : ''}
                  ${event.type === 'Adjustment' ? 'bg-indigo-500' : ''}
                `} />
              </span>

              {/* Event Content */}
              <div className="space-y-1 bg-slate-50/50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-100 dark:border-slate-850/60">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider
                      ${event.type === 'Inbound' ? 'text-emerald-500' : ''}
                      ${event.type === 'Outbound' ? 'text-rose-500' : ''}
                      ${event.type === 'Reserved' ? 'text-amber-500' : ''}
                      ${event.type === 'Adjustment' ? 'text-indigo-500' : ''}
                    ">
                      {event.type} ({isPositive ? '+' : ''}{event.change} Units)
                    </span>
                    <span className="block text-[9px] text-slate-400 font-mono mt-0.5">{event.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] font-black uppercase text-slate-400 font-mono">BALANCE</span>
                    <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-350">{event.balance} units</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-450 leading-relaxed font-light">
                  {event.notes}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
