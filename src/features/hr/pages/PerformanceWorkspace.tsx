/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { performanceService } from '../services/performance.service';
import { PerformanceGoal, PerformanceReview } from '../../../types/hr';
import { PerformanceCard } from '../components/PerformanceCard';
import { 
  Award, Target, Calendar, CheckSquare, 
  Search, Filter, Plus, X, Star, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function PerformanceWorkspace() {
  const [goals, setGoals] = useState<PerformanceGoal[]>([]);
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'goals' | 'reviews'>('goals');

  // Assign goal modal
  const [showAssignGoal, setShowAssignGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    employeeId: 'EMP-001',
    employeeName: 'Arjun Sharma',
    title: '',
    targetDate: '',
    progress: 0,
    status: 'Not Started' as PerformanceGoal['status']
  });

  // Log review modal
  const [showLogReview, setShowLogReview] = useState(false);
  const [newReview, setNewReview] = useState({
    employeeId: 'EMP-002',
    employeeName: 'Neha Kapoor',
    department: 'Marketing',
    reviewer: 'Arjun Sharma',
    rating: 4.5,
    selfRating: 4.0,
    reviewPeriod: 'H1 2026',
    strengths: '',
    improvements: '',
    status: 'Draft' as PerformanceReview['status']
  });

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      const goalsRes = await performanceService.getGoals();
      const reviewsRes = await performanceService.getReviews();
      setGoals(goalsRes);
      setReviews(reviewsRes);
    } catch (err) {
      toast.error('Failed to sync performance metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPerformanceData();
  }, []);

  const handleUpdateGoalProgress = async (id: string, progress: number) => {
    try {
      await performanceService.updateGoalProgress(id, progress);
      toast.success(`Goal progress updated to ${progress}%`);
      loadPerformanceData();
    } catch (err) {
      toast.error('Failed to update progress');
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newGoal.title || !newGoal.targetDate) {
        toast.error('Please fill in goal title and target date.');
        return;
      }
      await performanceService.createGoal(newGoal);
      toast.success('OKRs logged and dispatched successfully.');
      setShowAssignGoal(false);
      setNewGoal({
        employeeId: 'EMP-001',
        employeeName: 'Arjun Sharma',
        title: '',
        targetDate: '',
        progress: 0,
        status: 'Not Started'
      });
      loadPerformanceData();
    } catch (err) {
      toast.error('Failed to create goal');
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newReview.strengths || !newReview.improvements) {
        toast.error('Please input feedback comments.');
        return;
      }
      await performanceService.createReview({
        ...newReview,
        status: 'Approved' as const
      });
      toast.success('Performance Review approved and committed to employee profile.');
      setShowLogReview(false);
      setNewReview({
        employeeId: 'EMP-002',
        employeeName: 'Neha Kapoor',
        department: 'Marketing',
        reviewer: 'Arjun Sharma',
        rating: 4.5,
        selfRating: 4.0,
        reviewPeriod: 'H1 2026',
        strengths: '',
        improvements: '',
        status: 'Draft'
      });
      loadPerformanceData();
    } catch (err) {
      toast.error('Failed to log review');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 text-left select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-5">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
            <Award className="w-4 h-4 animate-bounce-slow" /> Enterprise Appraisal Desk
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">
            OKRs & Performance Reviews
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAssignGoal(true)}
            className="px-3.5 py-2 border rounded-xl text-xs font-mono font-black uppercase text-indigo-650 bg-indigo-50 hover:bg-indigo-100 flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Target className="w-3.5 h-3.5" /> Assign OKR
          </button>
          <button
            onClick={() => setShowLogReview(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-mono font-black uppercase flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-600/10"
          >
            <Plus className="w-3.5 h-3.5" /> Log Appraisal
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('goals')}
          className={`pb-3 px-4 text-xs font-black font-mono uppercase tracking-wider cursor-pointer border-b-2 transition-colors
            ${activeTab === 'goals' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-400 hover:text-slate-650'}`}
        >
          Active Key OKRs
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 px-4 text-xs font-black font-mono uppercase tracking-wider cursor-pointer border-b-2 transition-colors
            ${activeTab === 'reviews' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-400 hover:text-slate-650'}`}
        >
          Appraisals & Feedback Records
        </button>
      </div>

      {/* Main Grid */}
      {loading ? (
        <p className="text-center font-mono text-xs text-slate-400 animate-pulse">Syncing evaluation logs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTab === 'goals' && (
            <>
              {goals.map((g) => (
                <PerformanceCard
                  key={g.id}
                  goal={g}
                  onUpdateGoalProgress={handleUpdateGoalProgress}
                />
              ))}
              {goals.length === 0 && (
                <p className="text-center font-mono text-xs text-slate-400 col-span-full py-12">No active OKRs established.</p>
              )}
            </>
          )}

          {activeTab === 'reviews' && (
            <>
              {reviews.map((r) => (
                <PerformanceCard
                  key={r.id}
                  review={r}
                />
              ))}
              {reviews.length === 0 && (
                <p className="text-center font-mono text-xs text-slate-400 col-span-full py-12">No evaluation files found.</p>
              )}
            </>
          )}
        </div>
      )}

      {/* Assign Goal Modal */}
      <AnimatePresence>
        {showAssignGoal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-950 border dark:border-slate-850 max-w-sm w-full rounded-2xl shadow-xl overflow-hidden text-left"
            >
              <form onSubmit={handleCreateGoal} className="p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200">
                    Assign Key OKR Goal
                  </h3>
                  <button type="button" onClick={() => setShowAssignGoal(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">OKR Title / Target Objective</label>
                    <input
                      type="text"
                      required
                      value={newGoal.title}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Optimize API latency levels by 25%"
                      className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Completion Target Date</label>
                    <input
                      type="date"
                      required
                      value={newGoal.targetDate}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                      className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAssignGoal(false)}
                    className="flex-1 py-2 border rounded-xl font-mono text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[10px] font-black uppercase rounded-xl cursor-pointer"
                  >
                    Assign Objective
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Log Review Modal */}
      <AnimatePresence>
        {showLogReview && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-950 border dark:border-slate-850 max-w-sm w-full rounded-2xl shadow-xl overflow-hidden text-left"
            >
              <form onSubmit={handleCreateReview} className="p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200">
                    Log Appraisal Feedback
                  </h3>
                  <button type="button" onClick={() => setShowLogReview(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Performance Rating Index (out of 5.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      required
                      value={newReview.rating}
                      onChange={(e) => setNewReview(prev => ({ ...prev, rating: Number(e.target.value) }))}
                      className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Primary Strengths Feedback</label>
                    <textarea
                      required
                      rows={2}
                      value={newReview.strengths}
                      onChange={(e) => setNewReview(prev => ({ ...prev, strengths: e.target.value }))}
                      placeholder="e.g., High cognitive coding speed, reliable under severe outages..."
                      className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Areas for Improvement / Objectives</label>
                    <textarea
                      required
                      rows={2}
                      value={newReview.improvements}
                      onChange={(e) => setNewReview(prev => ({ ...prev, improvements: e.target.value }))}
                      placeholder="e.g., Focus on structural design specifications, delegate tasks..."
                      className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowLogReview(false)}
                    className="flex-1 py-2 border rounded-xl font-mono text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[10px] font-black uppercase rounded-xl cursor-pointer"
                  >
                    Commit Review
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
