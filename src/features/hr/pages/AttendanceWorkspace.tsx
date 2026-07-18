/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { attendanceService } from '../services/attendance.service';
import { employeeService } from '../services/employee.service';
import { Attendance, Employee } from '../../../types/hr';
import { AttendanceCard } from '../components/AttendanceCard';
import { AttendanceChart } from '../components/AttendanceChart';
import { 
  Clock, CheckCircle, AlertTriangle, ArrowUpRight, 
  Search, Filter, Play, LogOut, Download, Plus, X, Calendar 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function AttendanceWorkspace() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Check-In on behalf of modal state
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [activeCheckInEmp, setActiveCheckInEmp] = useState('');
  const [checkInTime, setCheckInTime] = useState('09:00');

  // Manual Adjust Modal
  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const attRes = await attendanceService.getAttendance();
      const empRes = await employeeService.getEmployees();
      setAttendance(attRes);
      setEmployees(empRes);
    } catch (err) {
      toast.error('Failed to boot attendance matrices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelfCheckIn = async () => {
    try {
      // Find Arjun Sharma (default CEO/User)
      const arjun = employees.find(e => e.id === 'EMP-001') || employees[0];
      if (!arjun) return;
      const res = await attendanceService.checkIn(arjun.id, arjun.name, arjun.department, '09:05');
      toast.success(`Welcome, ${arjun.name}! Check-in logged successfully.`);
      loadData();
    } catch (err) {
      toast.error('Self check-in failed');
    }
  };

  const handleSelfCheckOut = async () => {
    try {
      const arjun = employees.find(e => e.id === 'EMP-001') || employees[0];
      if (!arjun) return;
      const res = await attendanceService.checkOut(arjun.id, '18:15');
      if (res) {
        toast.success(`Goodbye, ${arjun.name}! Check-out logged. Total: ${res.workHours} Hours.`);
      } else {
        toast.error('You need to check in first before checking out.');
      }
      loadData();
    } catch (err) {
      toast.error('Check-out failed');
    }
  };

  const handleCheckInOnBehalf = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const emp = employees.find(e => e.id === activeCheckInEmp);
      if (!emp) {
        toast.error('Please select an employee.');
        return;
      }
      await attendanceService.checkIn(emp.id, emp.name, emp.department, checkInTime);
      toast.success(`Check-in logged for ${emp.name} at ${checkInTime}.`);
      setShowCheckInModal(false);
      loadData();
    } catch (err) {
      toast.error('Check-in on behalf failed');
    }
  };

  const handleAdjustLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAttendance) return;
    try {
      await attendanceService.updateAttendance(editingAttendance.id, editingAttendance);
      toast.success(`Logs updated successfully.`);
      setEditingAttendance(null);
      loadData();
    } catch (err) {
      toast.error('Logs adjust failed');
    }
  };

  const handleExport = (format: 'PDF' | 'CSV' | 'Excel') => {
    toast.success(`Exporting Attendance report in ${format} format...`);
  };

  const filteredAttendance = attendance.filter(att => {
    const matchesSearch = att.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          att.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || att.department === selectedDept;
    const matchesDate = !selectedDate || att.date === selectedDate;
    return matchesSearch && matchesDept && matchesDate;
  });

  // Calculate statistics
  const totalCheckedInToday = attendance.filter(a => a.date === new Date().toISOString().split('T')[0] && (a.status === 'Present' || a.status === 'Late')).length;
  const lateToday = attendance.filter(a => a.date === new Date().toISOString().split('T')[0] && a.status === 'Late').length;
  const overtimeTodayHours = attendance.filter(a => a.date === new Date().toISOString().split('T')[0]).reduce((acc, curr) => acc + curr.overtimeHours, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 text-left select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-5">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
            <Clock className="w-4 h-4 animate-spin-slow" /> Real-Time Attendance Engine
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">
            Attendance Log Workspace
          </h1>
        </div>

        {/* Quick check-in/out console for logged-in user */}
        <div className="flex gap-2">
          <button
            onClick={handleSelfCheckIn}
            className="px-3.5 py-2 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
          >
            <Play className="w-3.5 h-3.5" /> Self Check-In
          </button>
          <button
            onClick={handleSelfCheckOut}
            className="px-3.5 py-2 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/20"
          >
            <LogOut className="w-3.5 h-3.5" /> Self Check-Out
          </button>
          <button
            onClick={() => {
              setShowCheckInModal(true);
              if (employees.length > 0) setActiveCheckInEmp(employees[0].id);
            }}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-600/10"
          >
            <Plus className="w-3.5 h-3.5" /> Log Check-In
          </button>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/50 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Present Today</span>
            <h4 className="text-2xl font-black font-mono text-slate-800 dark:text-slate-150">{totalCheckedInToday} Employees</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/50 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Late Entries</span>
            <h4 className="text-2xl font-black font-mono text-slate-800 dark:text-slate-150">{lateToday} Logged</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/50 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Overtime Logs</span>
            <h4 className="text-2xl font-black font-mono text-slate-800 dark:text-slate-150">+{overtimeTodayHours} Hours</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Chart and Trends */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/50 rounded-2xl text-left space-y-4 shadow-sm">
        <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200">
          Attendance & Overtime Curves (Past Week)
        </h3>
        <AttendanceChart />
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200/50 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by personnel name or ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* Date Picker */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-150 dark:border-slate-850">
            <span className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest px-1">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-black bg-transparent border-none text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-150 dark:border-slate-850">
            <span className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest px-1">Dept:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs font-black bg-transparent border-none text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer pr-4"
            >
              {['All', 'Engineering', 'Marketing', 'Sales', 'Finance', 'Human Resources'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => handleExport('CSV')}
            className="px-3 py-1.5 border rounded-xl text-xs font-mono font-black uppercase text-indigo-600 bg-indigo-50 hover:bg-indigo-100 flex items-center gap-1 cursor-pointer border-indigo-150"
          >
            <Download className="w-3.5 h-3.5" /> CSV Report
          </button>
        </div>
      </div>

      {/* Grid of logs */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-xs animate-pulse">
          Syncing biometric sensors...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAttendance.map((att) => (
            <AttendanceCard
              key={att.id}
              attendance={att}
              onEdit={(record) => setEditingAttendance({ ...record })}
            />
          ))}
          {filteredAttendance.length === 0 && (
            <div className="p-12 text-center text-slate-400 font-mono text-xs border rounded-2xl border-dashed col-span-full">
              No attendance logs found matching filters.
            </div>
          )}
        </div>
      )}

      {/* Check In on Behalf Modal */}
      <AnimatePresence>
        {showCheckInModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-950 border dark:border-slate-850 max-w-sm w-full rounded-2xl shadow-xl overflow-hidden text-left"
            >
              <form onSubmit={handleCheckInOnBehalf} className="p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200">
                    Log Check-In
                  </h3>
                  <button type="button" onClick={() => setShowCheckInModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Select Personnel</label>
                    <select
                      value={activeCheckInEmp}
                      onChange={(e) => setActiveCheckInEmp(e.target.value)}
                      className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {employees.map(e => (
                        <option key={e.id} value={e.id}>{e.name} ({e.id})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Check-In Timestamp</label>
                    <input
                      type="time"
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                      className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCheckInModal(false)}
                    className="flex-1 py-2 border rounded-xl font-mono text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[10px] font-black uppercase rounded-xl cursor-pointer"
                  >
                    Check-In Log
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Adjust Logs Modal */}
      <AnimatePresence>
        {editingAttendance && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-950 border dark:border-slate-850 max-w-sm w-full rounded-2xl shadow-xl overflow-hidden text-left"
            >
              <form onSubmit={handleAdjustLog} className="p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200">
                    Adjust Attendance Log
                  </h3>
                  <button type="button" onClick={() => setEditingAttendance(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-mono text-slate-400 text-[10px]">Employee ID</span>
                    <p className="font-black text-slate-800 dark:text-slate-200">{editingAttendance.employeeName} ({editingAttendance.employeeId})</p>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Check-In</label>
                    <input
                      type="text"
                      value={editingAttendance.checkIn}
                      onChange={(e) => setEditingAttendance(prev => prev ? ({ ...prev, checkIn: e.target.value }) : null)}
                      className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Check-Out</label>
                    <input
                      type="text"
                      value={editingAttendance.checkOut}
                      onChange={(e) => setEditingAttendance(prev => prev ? ({ ...prev, checkOut: e.target.value }) : null)}
                      className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Status</label>
                    <select
                      value={editingAttendance.status}
                      onChange={(e) => setEditingAttendance(prev => prev ? ({ ...prev, status: e.target.value as Attendance['status'] }) : null)}
                      className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Present">Present</option>
                      <option value="Late">Late</option>
                      <option value="Absent">Absent</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingAttendance(null)}
                    className="flex-1 py-2 border rounded-xl font-mono text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[10px] font-black uppercase rounded-xl cursor-pointer"
                  >
                    Adjust
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
