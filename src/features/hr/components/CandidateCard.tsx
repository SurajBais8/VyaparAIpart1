/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, Briefcase, Calendar, ChevronRight } from 'lucide-react';
import { Candidate } from '../../../types/hr';

interface CandidateCardProps {
  candidate: Candidate;
  onInspect: (cand: Candidate) => void;
  onNextStage?: (id: string, current: Candidate['stage']) => void;
  id?: string;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onInspect,
  onNextStage,
  id
}) => {
  const stageStyles = {
    Applied: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800',
    'HR Screening': 'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30',
    'Technical Round': 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30',
    'Management Interview': 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/20 dark:text-violet-400 dark:border-violet-900/30',
    Offered: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
    Rejected: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30',
  };

  return (
    <motion.div
      id={id || `cand-card-${candidate.id}`}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 text-left shadow-sm hover:shadow transition-shadow select-none flex flex-col justify-between"
    >
      <div className="space-y-4">
        {/* Top Header: ID & Stage */}
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">
            {candidate.id}
          </span>
          <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${stageStyles[candidate.stage]}`}>
            {candidate.stage}
          </span>
        </div>

        {/* Name & Job Title */}
        <div>
          <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">
            {candidate.name}
          </h4>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {candidate.jobTitle}
          </p>
          <span className="text-[9px] font-mono text-slate-450 dark:text-slate-500 block mt-1">
            Experience: <strong className="text-slate-700 dark:text-slate-300">{candidate.experience}</strong>
          </span>
        </div>

        {/* Contact info */}
        <div className="space-y-1 text-xs font-mono text-slate-500 dark:text-slate-400 border-y border-slate-100 dark:border-slate-850/50 py-3 my-1">
          <div className="flex items-center gap-2 truncate">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{candidate.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{candidate.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Applied {candidate.appliedDate}</span>
          </div>
        </div>

        {/* AI Insight Snippet */}
        <div className="p-2.5 bg-indigo-50/20 dark:bg-slate-950/60 rounded-xl border border-indigo-100/10 text-[10px] text-slate-550 dark:text-slate-450 leading-relaxed font-sans">
          <span className="font-bold text-[9px] font-mono text-indigo-500 block uppercase mb-0.5">Cognitive AI Eval</span>
          &ldquo;{candidate.aiEvaluation.substring(0, 95)}...&rdquo;
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-4 pt-1">
        <button
          onClick={() => onInspect(candidate)}
          className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase font-mono tracking-wider flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900"
        >
          Evaluate File
        </button>
        {candidate.stage !== 'Offered' && candidate.stage !== 'Rejected' && onNextStage && (
          <button
            onClick={() => onNextStage(candidate.id, candidate.stage)}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase font-mono tracking-wider flex items-center justify-center gap-1 cursor-pointer shadow-sm shadow-indigo-600/10"
            title="Advance Stage"
          >
            Advance <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
