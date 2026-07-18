/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { recruitmentService } from '../services/recruitment.service';
import { Candidate, JobOpening } from '../../../types/hr';
import { CandidateCard } from '../components/CandidateCard';
import { 
  Briefcase, UserCheck, Send, CheckSquare, 
  Search, Filter, Plus, X, Award, FileText, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function RecruitmentWorkspace() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');

  // Detail Modal
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Create Job Modal
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    department: 'Engineering',
    location: 'Noida HQ',
    type: 'Full-time',
    status: 'Active' as JobOpening['status'],
    experienceRequired: '3-5 Years',
    salaryRange: '₹12L - ₹18L',
    candidatesCount: 0
  });

  const loadRecruitmentData = async () => {
    try {
      setLoading(true);
      const candidatesRes = await recruitmentService.getCandidates();
      const jobsRes = await recruitmentService.getJobOpenings();
      setCandidates(candidatesRes);
      setJobs(jobsRes);
    } catch (err) {
      toast.error('Failed to boot recruitment pipeline nodes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecruitmentData();
  }, []);

  const handleAdvanceStage = async (id: string, currentStage: Candidate['stage']) => {
    const stages: Candidate['stage'][] = ['Applied', 'HR Screening', 'Technical Round', 'Management Interview', 'Offered', 'Rejected'];
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex < 0 || currentIndex >= stages.length - 2) {
      toast.error('Candidate has reached final stages of evaluation');
      return;
    }
    const nextStage = stages[currentIndex + 1];
    try {
      await recruitmentService.updateCandidateStage(id, nextStage);
      toast.success(`Advanced candidate to ${nextStage}`);
      loadRecruitmentData();
    } catch (err) {
      toast.error('Failed to advance candidate');
    }
  };

  const handleRejectCandidate = async (id: string) => {
    try {
      await recruitmentService.updateCandidateStage(id, 'Rejected');
      toast.error('Candidate marked as rejected.');
      setSelectedCandidate(null);
      loadRecruitmentData();
    } catch (err) {
      toast.error('Failed to reject candidate');
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newJob.title) {
        toast.error('Please input required title descriptor.');
        return;
      }
      await recruitmentService.createJobOpening(newJob);
      toast.success('Successfully provisioned new career requisition.');
      setShowCreateJob(false);
      setNewJob({
        title: '', department: 'Engineering', location: 'Noida HQ', type: 'Full-time',
        status: 'Active', experienceRequired: '3-5 Years', salaryRange: '₹12L - ₹18L',
        candidatesCount: 0
      });
      loadRecruitmentData();
    } catch (err) {
      toast.error('Failed to create Job requisition');
    }
  };

  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch = cand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cand.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = selectedStage === 'All' || cand.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const stagesList = ['All', 'Applied', 'HR Screening', 'Technical Round', 'Management Interview', 'Offered', 'Rejected'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 text-left select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-5">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
            <Briefcase className="w-4 h-4 animate-pulse" /> Cognitive Recruitment Suite
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">
            Talent Acquisition Board
          </h1>
        </div>

        <button
          onClick={() => setShowCreateJob(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" /> Issue Requisition
        </button>
      </div>

      {/* Active Job Openings Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-850 dark:text-slate-200">
          Open Careers Requisitions ({jobs.length})
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="p-4 bg-white dark:bg-slate-900 border rounded-2xl text-left flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-mono font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {job.id} &bull; {job.department}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-black uppercase tracking-wider border
                    ${job.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-700 border-slate-100'}`}>
                    {job.status}
                  </span>
                </div>
                <h4 className="text-sm font-black tracking-tight text-slate-800 dark:text-slate-200">{job.title}</h4>
                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-slate-500">
                  <div>Location: <strong className="text-slate-750 dark:text-slate-300">{job.location}</strong></div>
                  <div>Exp Req: <strong className="text-slate-750 dark:text-slate-300">{job.experienceRequired}</strong></div>
                  <div>Salary: <strong className="text-slate-750 dark:text-slate-300">{job.salaryRange}</strong></div>
                  <div>Class: <strong className="text-slate-750 dark:text-slate-300">{job.type}</strong></div>
                </div>
              </div>
              <div className="border-t border-slate-50 my-2 pt-2 flex justify-between items-center text-[10px] font-mono text-indigo-500">
                <span>Active Pipeline Logs:</span>
                <span className="font-black">{job.candidatesCount} Applicants</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters for applicants */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200/50 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applicants by name or role title..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-150 dark:border-slate-850">
          <span className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest px-1">Pipeline Stage:</span>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="text-xs font-black bg-transparent border-none text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer pr-4"
          >
            {stagesList.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidates list cards */}
      {loading ? (
        <p className="text-center font-mono text-xs text-slate-400 animate-pulse">Scanning applicant resumes...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCandidates.map((cand) => (
            <CandidateCard
              key={cand.id}
              candidate={cand}
              onInspect={(item) => setSelectedCandidate({ ...item })}
              onNextStage={handleAdvanceStage}
            />
          ))}
          {filteredCandidates.length === 0 && (
            <p className="text-center font-mono text-xs text-slate-400 col-span-full py-12 border border-dashed rounded-2xl">
              No applicant files match the current stage filtering.
            </p>
          )}
        </div>
      )}

      {/* Candidate Inspect Overlays Drawer */}
      <AnimatePresence>
        {selectedCandidate && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex justify-end">
            <div className="absolute inset-0" onClick={() => setSelectedCandidate(null)} />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-950 h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-slate-150 dark:border-slate-850"
            >
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                    <h2 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">
                      {selectedCandidate.name}
                    </h2>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Requisition: {selectedCandidate.jobTitle} &bull; {selectedCandidate.id}
                    </p>
                  </div>
                  <button onClick={() => setSelectedCandidate(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* High level info */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-xs font-mono space-y-2">
                    <span className="text-[8px] font-black text-slate-400 block uppercase">Classification indicators</span>
                    <div className="flex justify-between border-b pb-1"><span>Experience:</span><span className="font-bold text-slate-700 dark:text-slate-300">{selectedCandidate.experience}</span></div>
                    <div className="flex justify-between border-b pb-1"><span>Current Stage:</span><span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedCandidate.stage}</span></div>
                    <div className="flex justify-between"><span>Applied Date:</span><span className="font-bold text-slate-700 dark:text-slate-300">{selectedCandidate.appliedDate}</span></div>
                  </div>

                  {/* Contact channels */}
                  <div className="p-4 bg-white dark:bg-slate-900 border rounded-2xl text-xs font-mono space-y-1.5">
                    <span className="text-[8px] font-black text-slate-400 block uppercase">Channels</span>
                    <div>Email: <strong className="text-slate-700 dark:text-slate-300">{selectedCandidate.email}</strong></div>
                    <div>Phone: <strong className="text-slate-700 dark:text-slate-300">{selectedCandidate.phone}</strong></div>
                  </div>

                  {/* Cognitive deep analysis */}
                  <div className="p-5 bg-indigo-50/10 dark:bg-slate-900/60 border border-indigo-200/20 rounded-2xl space-y-3">
                    <div className="flex items-center gap-1 font-mono font-black text-[10px] text-indigo-600 dark:text-indigo-400 uppercase">
                      <Award className="w-4.5 h-4.5" /> AI Cognitive Assessment Index
                    </div>
                    <p className="text-xs text-slate-650 dark:text-slate-450 leading-relaxed font-medium">
                      {selectedCandidate.aiEvaluation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Drawer actions */}
              <div className="border-t pt-4 flex gap-2">
                <button
                  onClick={() => handleRejectCandidate(selectedCandidate.id)}
                  className="flex-1 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-mono font-black uppercase cursor-pointer"
                >
                  Reject File
                </button>
                {selectedCandidate.stage !== 'Offered' && selectedCandidate.stage !== 'Rejected' && (
                  <button
                    onClick={() => {
                      handleAdvanceStage(selectedCandidate.id, selectedCandidate.stage);
                      setSelectedCandidate(null);
                    }}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-mono font-black uppercase flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Advance Loop <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Requisition modal */}
      <AnimatePresence>
        {showCreateJob && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-950 border dark:border-slate-850 max-w-sm w-full rounded-2xl shadow-xl overflow-hidden text-left"
            >
              <form onSubmit={handleCreateJob} className="p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200">
                    Issue Job Requisition
                  </h3>
                  <button type="button" onClick={() => setShowCreateJob(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Job Title *</label>
                    <input
                      type="text"
                      required
                      value={newJob.title}
                      onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Staff Security Engineer"
                      className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Department</label>
                      <select
                        value={newJob.department}
                        onChange={(e) => setNewJob(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        {['Engineering', 'Marketing', 'Sales', 'Finance', 'Human Resources'].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Location</label>
                      <input
                        type="text"
                        value={newJob.location}
                        onChange={(e) => setNewJob(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Experience required</label>
                      <input
                        type="text"
                        value={newJob.experienceRequired}
                        onChange={(e) => setNewJob(prev => ({ ...prev, experienceRequired: e.target.value }))}
                        className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Compensation bracket</label>
                      <input
                        type="text"
                        value={newJob.salaryRange}
                        onChange={(e) => setNewJob(prev => ({ ...prev, salaryRange: e.target.value }))}
                        className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCreateJob(false)}
                    className="flex-1 py-2 border rounded-xl font-mono text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[10px] font-black uppercase rounded-xl cursor-pointer"
                  >
                    Issue Requisition
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
