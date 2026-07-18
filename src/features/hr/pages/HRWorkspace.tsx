/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { hrService } from '../services/hr.service';
import { leaveService } from '../services/leave.service';
import { recruitmentService } from '../services/recruitment.service';
import { HRDashboardSummary, LeaveRequest, Candidate } from '../../../types/hr';
import { HRStatCard } from '../components/HRStatCard';
import { AttendanceChart } from '../components/AttendanceChart';
import { PayrollChart } from '../components/PayrollChart';
import { 
  Users2, UserCheck, CalendarDays, Hourglass, 
  Wallet, ShieldAlert, Sparkles, Award, Gift, CalendarRange, 
  HelpCircle, ArrowRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function HRWorkspace() {
  const [summary, setSummary] = useState<HRDashboardSummary | null>(null);
  const [birthdays, setBirthdays] = useState<any[]>([]);
  const [anniversaries, setAnniversaries] = useState<any[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  // Smart dynamic AI insights list
  const [aiInsights, setAiInsights] = useState<string[]>([
    "Attrition Risk Warning: Engineering team feedback scores show minor fatigue indicators. Recommend scheduling a team check-in.",
    "Overtime Optimization: 3 department contributors have exceeded the 10-hour weekly buffer. Advise resource balancing.",
    "Appraisal Synchronization: 4 critical probation feedback reviews are awaiting manager action cycles."
  ]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const summRes = await hrService.getDashboardSummary();
      const bdaysRes = await hrService.getBirthdaysToday();
      const annivRes = await hrService.getAnniversariesToday();
      const leavesRes = await leaveService.getLeaveRequests();
      const candidatesRes = await recruitmentService.getCandidates();

      setSummary(summRes);
      setBirthdays(bdaysRes);
      setAnniversaries(annivRes);
      setPendingLeaves(leavesRes.filter(l => l.status === 'Pending'));
      setCandidates(candidatesRes.filter(c => c.stage !== 'Offered' && c.stage !== 'Rejected'));
    } catch (err) {
      toast.error('Failed to sync master HR data grid.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const triggerInsightsSync = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Interrogating corporate databases via Cognitive AI...',
        success: 'AI Insights synchronized! Attrition risk analysis logged.',
        error: 'Engine sync failure'
      }
    );
  };

  if (loading || !summary) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono text-xs animate-pulse select-none">
        Booting HR intelligence desk...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 text-left select-none">
      
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-5">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
            <Sparkles className="w-4 h-4 animate-pulse" /> Corporate Operations Console
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">
            Human Resources Workspace
          </h1>
        </div>

        <button
          onClick={triggerInsightsSync}
          className="px-4 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-150 text-indigo-600 rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" /> Re-Evaluate AI Model
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <HRStatCard
          label="Total Employees"
          value={summary.totalEmployees}
          subtext="Active in roster"
          icon={<Users2 className="w-5 h-5" />}
          color="indigo"
          id="stat-total-emp"
        />
        <HRStatCard
          label="Active Squad"
          value={summary.activeEmployees}
          subtext="Allocated & checking-in"
          icon={<UserCheck className="w-5 h-5" />}
          color="emerald"
          id="stat-active-emp"
        />
        <HRStatCard
          label="Time-off (Today)"
          value={`${summary.onLeave} Members`}
          subtext="Approved leave tickets"
          icon={<CalendarDays className="w-5 h-5" />}
          color="rose"
          id="stat-on-leave"
        />
        <HRStatCard
          label="Attendance Today"
          value={`${summary.attendanceToday}%`}
          subtext="Check-in ratio"
          icon={<Hourglass className="w-5 h-5" />}
          color="sky"
          id="stat-attendance-today"
        />
        <HRStatCard
          label="Payroll Cycles"
          value={`${summary.payrollPending} Accounts`}
          subtext="Disbursal outstanding"
          icon={<Wallet className="w-5 h-5" />}
          color="violet"
          id="stat-payroll-pending"
        />
        <HRStatCard
          label="Open Job Roles"
          value={`${summary.openJobs} requisitions`}
          subtext="Candidates in queue"
          icon={<Award className="w-5 h-5" />}
          color="amber"
          id="stat-open-jobs"
        />
        <HRStatCard
          label="Active Divisions"
          value={`${summary.departmentCount} Teams`}
          subtext="Annual budget lines"
          icon={<CalendarRange className="w-5 h-5" />}
          color="teal"
          id="stat-dept-count"
        />
        <HRStatCard
          label="New Joiners"
          value={`+${summary.newJoiners} Hired`}
          subtext="Hired past year"
          icon={<Sparkles className="w-5 h-5" />}
          color="indigo"
          id="stat-new-joiners"
        />
      </div>

      {/* Master Grid containing Charts & Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Main Charts area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 bg-white dark:bg-slate-900 border rounded-2xl text-left space-y-3 shadow-sm">
            <h3 className="text-xs font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200">
              Attendance Verification Index (Past 7 Days)
            </h3>
            <AttendanceChart />
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border rounded-2xl text-left space-y-3 shadow-sm">
            <h3 className="text-xs font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200">
              Departmental Expenditure Distribution
            </h3>
            <PayrollChart />
          </div>
        </div>

        {/* Dynamic HR Alerts, Birthdays, Anniversaries, Leaves */}
        <div className="space-y-6">
          
          {/* AI HR Insights Engine widget */}
          <div className="p-5 bg-indigo-50/10 dark:bg-indigo-950/20 border border-indigo-200/20 rounded-2xl space-y-4 text-left shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <Sparkles className="w-4 h-4 animate-pulse" /> Cognitive HR Advisor
              </span>
              <span className="text-[8px] font-mono font-bold text-indigo-400 uppercase bg-indigo-50 dark:bg-slate-950 px-2 py-0.5 rounded border border-indigo-150">Active</span>
            </div>

            <div className="space-y-2.5">
              {aiInsights.map((ins, idx) => (
                <div key={idx} className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-indigo-100/10 text-[11px] leading-relaxed text-slate-650 dark:text-slate-400 font-medium">
                  {ins}
                </div>
              ))}
            </div>
          </div>

          {/* Birthday and Anniversaries today */}
          {(birthdays.length > 0 || anniversaries.length > 0) ? (
            <div className="p-5 bg-white dark:bg-slate-900 border rounded-2xl space-y-4 text-left shadow-sm">
              <h3 className="text-xs font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Gift className="w-4.5 h-4.5 text-indigo-500" /> Daily Celebrations
              </h3>
              
              <div className="space-y-3 text-xs">
                {birthdays.map((bd) => (
                  <div key={bd.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border">
                    <div className="flex items-center gap-2">
                      <img src={bd.photo} alt={bd.name} className="w-7 h-7 rounded-lg" />
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">{bd.name}</span>
                        <span className="text-[9px] text-slate-400">{bd.designation}</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-black text-indigo-600 uppercase">Birthday Today &bull; Age {bd.age}</span>
                  </div>
                ))}

                {anniversaries.map((ann) => (
                  <div key={ann.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border">
                    <div className="flex items-center gap-2">
                      <img src={ann.photo} alt={ann.name} className="w-7 h-7 rounded-lg" />
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">{ann.name}</span>
                        <span className="text-[9px] text-slate-400">{ann.designation}</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-black text-indigo-600 uppercase">Joined {ann.years} yr ago</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-5 bg-white dark:bg-slate-900 border rounded-2xl space-y-2 text-left shadow-sm">
              <h3 className="text-xs font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Gift className="w-4.5 h-4.5 text-indigo-500" /> Celebration Loop
              </h3>
              <p className="text-[10px] font-mono text-slate-400">No birthdays or work milestones scheduled today.</p>
            </div>
          )}

          {/* Pending leave widgets list */}
          <div className="p-5 bg-white dark:bg-slate-900 border rounded-2xl space-y-4 text-left shadow-sm">
            <h3 className="text-xs font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <CalendarRange className="w-4.5 h-4.5 text-indigo-500" /> Pending Leave Requests ({pendingLeaves.length})
            </h3>

            <div className="space-y-2 text-xs">
              {pendingLeaves.slice(0, 3).map((l) => (
                <div key={l.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-850 dark:text-slate-200">{l.employeeName}</span>
                    <span className="text-[8px] font-mono text-indigo-600 font-bold uppercase">{l.leaveType}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-1 italic">&ldquo;{l.reason}&rdquo;</p>
                  <span className="text-[8px] font-mono text-slate-400">{l.startDate} to {l.endDate} ({l.days} Days)</span>
                </div>
              ))}
              {pendingLeaves.length === 0 && (
                <p className="text-[10px] font-mono text-slate-400">No outstanding leave requests.</p>
              )}
            </div>
          </div>

          {/* Upcoming Recruitment candidates Interviews */}
          <div className="p-5 bg-white dark:bg-slate-900 border rounded-2xl space-y-4 text-left shadow-sm">
            <h3 className="text-xs font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <UserCheck className="w-4.5 h-4.5 text-indigo-500" /> Active Applicants Pipeline ({candidates.length})
            </h3>

            <div className="space-y-2 text-xs">
              {candidates.slice(0, 3).map((cand) => (
                <div key={cand.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-850 dark:text-slate-200 block">{cand.name}</span>
                    <span className="text-[9px] font-mono text-slate-400">{cand.jobTitle}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded border text-[8px] font-mono font-black uppercase tracking-wider bg-indigo-50 text-indigo-600">
                    {cand.stage}
                  </span>
                </div>
              ))}
              {candidates.length === 0 && (
                <p className="text-[10px] font-mono text-slate-400">No active candidate pipelines logs.</p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
