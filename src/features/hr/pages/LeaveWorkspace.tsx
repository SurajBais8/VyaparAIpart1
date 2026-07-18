/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { leaveService } from '../services/leave.service';
import { LeaveRequest } from '../../../types/hr';
import { LeaveCard } from '../components/LeaveCard';
import { LeaveCalendar } from '../components/LeaveCalendar';
import { 
  Calendar, CheckSquare, ListTodo, Plus, X, 
  Smile, ShieldAlert, Heart, RefreshCw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function LeaveWorkspace() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // New leave request form state
  const [newLeave, setNewLeave] = useState({
    employeeId: 'EMP-001', // Arjun Sharma (Mock User)
    employeeName: 'Arjun Sharma',
    department: 'Executive Office',
    leaveType: 'Privilege Leave' as LeaveRequest['leaveType'],
    startDate: '',
    endDate: '',
    days: 1,
    reason: ''
  });

  // Simple static user leave balances (represented as state)
  const [balances, setBalances] = useState({
    casual: 8,
    sick: 12,
    earned: 18,
    maternity: 0
  });

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await leaveService.getLeaveRequests();
      setRequests(res);
    } catch (err) {
      toast.error('Failed to load leave logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await leaveService.updateLeaveRequestStatus(id, 'Approved');
      toast.success('Leave request approved and logged to rosters.');
      loadRequests();
    } catch (err) {
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await leaveService.updateLeaveRequestStatus(id, 'Rejected');
      toast.error('Leave request rejected.');
      loadRequests();
    } catch (err) {
      toast.error('Failed to reject request');
    }
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newLeave.startDate || !newLeave.endDate || !newLeave.reason) {
        toast.error('Please fill in all requested fields.');
        return;
      }

      // Calculate total days roughly
      const start = new Date(newLeave.startDate);
      const end = new Date(newLeave.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      const payload = {
        ...newLeave,
        days: diffDays,
        status: 'Pending' as const
      };

      await leaveService.createLeaveRequest(payload);
      toast.success('Leave request submitted for corporate routing.');

      setShowApplyModal(false);
      // Reset
      setNewLeave({
        employeeId: 'EMP-001',
        employeeName: 'Arjun Sharma',
        department: 'Executive Office',
        leaveType: 'Privilege Leave',
        startDate: '',
        endDate: '',
        days: 1,
        reason: ''
      });
      loadRequests();
    } catch (err) {
      toast.error('Leave submission failed.');
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const pastRequests = requests.filter(r => r.status !== 'Pending');

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 text-left select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-5">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
            <Calendar className="w-4 h-4" /> Leave Management Console
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">
            Time-Off & Leave Rosters
          </h1>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-600/10"
        >
          <Plus className="w-4 h-4" /> Apply for Leave
        </button>
      </div>

      {/* Leave Balances Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border rounded-2xl flex flex-col justify-between h-24 shadow-sm">
          <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest">Casual Leave Balance</span>
          <div className="flex justify-between items-end">
            <h4 className="text-2xl font-black font-mono text-slate-800 dark:text-slate-100">{balances.casual} Days</h4>
            <span className="text-[9px] font-mono text-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded border border-indigo-100/10">Active</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border rounded-2xl flex flex-col justify-between h-24 shadow-sm">
          <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest">Sick Leave Balance</span>
          <div className="flex justify-between items-end">
            <h4 className="text-2xl font-black font-mono text-slate-800 dark:text-slate-100">{balances.sick} Days</h4>
            <span className="text-[9px] font-mono text-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded border border-indigo-100/10">Active</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border rounded-2xl flex flex-col justify-between h-24 shadow-sm">
          <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest">Privilege Leave Balance</span>
          <div className="flex justify-between items-end">
            <h4 className="text-2xl font-black font-mono text-slate-800 dark:text-slate-100">{balances.earned} Days</h4>
            <span className="text-[9px] font-mono text-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded border border-indigo-100/10">Active</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border rounded-2xl flex flex-col justify-between h-24 shadow-sm">
          <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest">Compensatory Leaves</span>
          <div className="flex justify-between items-end">
            <h4 className="text-2xl font-black font-mono text-slate-800 dark:text-slate-100">3 Days</h4>
            <span className="text-[9px] font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-100/10">Credited</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending approval & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Active pending queue */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-850 dark:text-slate-200">
            Pending Leave Requests Routing ({pendingRequests.length})
          </h3>
          
          {loading ? (
            <p className="text-xs text-slate-400 font-mono text-center">Syncing leave ledgers...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pendingRequests.map((req) => (
                <LeaveCard
                  key={req.id}
                  request={req}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
              {pendingRequests.length === 0 && (
                <div className="p-10 text-center border rounded-2xl border-dashed bg-slate-50/20 col-span-2">
                  <Smile className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
                  <p className="text-xs font-mono text-slate-400">All incoming leave request loops are cleared!</p>
                </div>
              )}
            </div>
          )}

          {/* Past/Processed Leaves */}
          <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-850 dark:text-slate-200 pt-4">
            Audit Ledger (Historical Log)
          </h3>
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200/50 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest">
                    <th className="py-2.5 px-4">Employee</th>
                    <th className="py-2.5 px-4">Leave Type</th>
                    <th className="py-2.5 px-4">Period</th>
                    <th className="py-2.5 px-4">Days</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pastRequests.map((req) => (
                    <tr key={req.id} className="border-b text-xs hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="py-2.5 px-4 font-black text-slate-700 dark:text-slate-300">{req.employeeName}</td>
                      <td className="py-2.5 px-4 font-mono text-[10px] text-indigo-600 dark:text-indigo-400">{req.leaveType}</td>
                      <td className="py-2.5 px-4 font-mono text-slate-450">{req.startDate} to {req.endDate}</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">{req.days} Days</td>
                      <td className="py-2.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-black uppercase tracking-wider border
                          ${req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Calendar Column */}
        <div className="space-y-4">
          <LeaveCalendar leaveRequests={requests} />
        </div>
      </div>

      {/* Apply Leave Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-950 border max-w-sm w-full rounded-2xl shadow-xl overflow-hidden text-left"
            >
              <form onSubmit={handleApplyLeave} className="p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200">
                    Apply for Leave
                  </h3>
                  <button type="button" onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Leave Classification</label>
                    <select
                      value={newLeave.leaveType}
                      onChange={(e) => setNewLeave(prev => ({ ...prev, leaveType: e.target.value as LeaveRequest['leaveType'] }))}
                      className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Privilege Leave">Privilege Leave</option>
                      <option value="Maternity Leave">Maternity Leave</option>
                      <option value="Paternity Leave">Paternity Leave</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Start Date</label>
                      <input
                        type="date"
                        required
                        value={newLeave.startDate}
                        onChange={(e) => setNewLeave(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">End Date</label>
                      <input
                        type="date"
                        required
                        value={newLeave.endDate}
                        onChange={(e) => setNewLeave(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Statement Reason</label>
                    <textarea
                      required
                      rows={3}
                      value={newLeave.reason}
                      onChange={(e) => setNewLeave(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="Specify clear medical or personal reason..."
                      className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1 py-2 border rounded-xl font-mono text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[10px] font-black uppercase rounded-xl cursor-pointer"
                  >
                    Submit Request
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
