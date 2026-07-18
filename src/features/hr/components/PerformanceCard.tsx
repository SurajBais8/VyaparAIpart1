/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Award, Target, Star, Calendar, MessageSquare } from 'lucide-react';
import { PerformanceReview, PerformanceGoal } from '../../../types/hr';

interface PerformanceCardProps {
  goal?: PerformanceGoal;
  review?: PerformanceReview;
  onUpdateGoalProgress?: (id: string, progress: number) => void;
  id?: string;
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({
  goal,
  review,
  onUpdateGoalProgress,
  id
}) => {
  const goalStatusColors = {
    'Not Started': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400',
    'On Track': 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400',
    Ahead: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400',
    Delayed: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400'
  };

  if (goal) {
    return (
      <motion.div
        id={id || `goal-card-${goal.id}`}
        whileHover={{ y: -2 }}
        className="bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 text-left shadow-sm hover:shadow transition-shadow select-none"
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">
              {goal.id} &bull; Target: {goal.targetDate}
            </span>
            <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${goalStatusColors[goal.status]}`}>
              {goal.status}
            </span>
          </div>

          {/* Goal Body */}
          <div>
            <span className="text-[9px] font-mono font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-1 flex items-center gap-1">
              <Target className="w-3.5 h-3.5" /> Key Objective
            </span>
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight leading-snug">
              {goal.title}
            </h4>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
              Assigned to: {goal.employeeName}
            </p>
          </div>

          {/* Progress Bar with Slider (if editable) */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs font-mono text-slate-500">
              <span>Execution Ratio:</span>
              <span className="font-black text-slate-800 dark:text-slate-200">{goal.progress}%</span>
            </div>
            
            {onUpdateGoalProgress ? (
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={goal.progress}
                onChange={(e) => onUpdateGoalProgress(goal.id, Number(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full cursor-pointer"
              />
            ) : (
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${goal.progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-indigo-600 h-full rounded-full"
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  if (review) {
    return (
      <motion.div
        id={id || `rev-card-${review.id}`}
        whileHover={{ y: -2 }}
        className="bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 text-left shadow-sm hover:shadow transition-shadow select-none flex flex-col justify-between"
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">
              {review.id} &bull; {review.reviewPeriod}
            </span>
            <span className="px-2 py-0.5 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-wider dark:bg-emerald-950/20 dark:text-emerald-400">
              {review.status}
            </span>
          </div>

          {/* Profile Name */}
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">
                {review.employeeName}
              </h4>
              <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase block">
                {review.department}
              </span>
            </div>
            
            {/* Score indexes */}
            <div className="flex items-center gap-1 bg-indigo-50 dark:bg-slate-950 px-2.5 py-1 rounded-xl border border-indigo-100/10 shrink-0">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <div className="text-right">
                <span className="text-xs font-black font-mono text-slate-850 dark:text-indigo-400 block leading-none">
                  {review.rating.toFixed(1)}
                </span>
                <span className="text-[7px] font-mono text-slate-400 uppercase font-black block">Score</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-850/50 pt-2 space-y-2">
            <div>
              <span className="text-[8px] font-mono text-slate-400 uppercase font-black block flex items-center gap-1">
                <Award className="w-3 h-3 text-indigo-500" /> Executive Strengths
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-450 leading-relaxed font-medium">
                {review.strengths}
              </p>
            </div>
            <div>
              <span className="text-[8px] font-mono text-slate-400 uppercase font-black block flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-amber-500" /> Areas for Growth
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-450 leading-relaxed font-medium">
                {review.improvements}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850/50 flex justify-between text-[10px] font-mono text-slate-400">
          <span>Reviewer: <strong>{review.reviewer}</strong></span>
          <span>Self-Assessment: <strong>{review.selfRating.toFixed(1)}</strong></span>
        </div>
      </motion.div>
    );
  }

  return null;
};
