import React from 'react';
import { AnalyticsReport } from '../services/report.service';
import { Star, Clock, Download, Printer, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface ReportCardProps {
  report: AnalyticsReport;
  onToggleFavorite: (id: string) => void;
  onSetSchedule: (id: string, sched: string) => void;
  onRun: (id: string) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onToggleFavorite, onSetSchedule, onRun }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850/60 rounded-2xl text-left flex flex-col justify-between shadow-2xs hover:shadow-xs"
    >
      <div className="space-y-3.5">
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase font-mono bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 px-1.5 py-0.5 rounded border border-indigo-400/10">
              {report.category}
            </span>
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mt-1">{report.title}</h4>
          </div>

          <button
            onClick={() => onToggleFavorite(report.id)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer
              ${report.isFavorite 
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
                : 'border-slate-150 text-slate-400 hover:text-amber-500'}`}
          >
            <Star className="w-4 h-4 fill-current" />
          </button>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 font-light leading-relaxed min-h-[48px]">
          {report.description}
        </p>

        <div className="text-[10px] font-mono border-t border-b border-slate-50 dark:border-slate-900 py-3 grid grid-cols-2 gap-3">
          <div>
            <span className="block text-[8px] uppercase text-slate-400 font-bold">Report ID</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{report.id}</span>
          </div>
          <div>
            <span className="block text-[8px] uppercase text-slate-400 font-bold">Automatic Schedule</span>
            <select
              value={report.schedule || 'None'}
              onChange={(e) => onSetSchedule(report.id, e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-indigo-500 text-[10px]"
            >
              <option value="None">Off</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center pt-1 select-none">
          <span className="text-[9px] font-bold text-slate-400 font-mono">Format: PDF / CSV / EXCEL</span>
          <button
            onClick={() => onRun(report.id)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase font-mono tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Run Report
          </button>
        </div>
      </div>
    </motion.div>
  );
};
