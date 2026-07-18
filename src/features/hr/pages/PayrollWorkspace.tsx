/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { payrollService } from '../services/payroll.service';
import { Payroll } from '../../../types/hr';
import { PayrollCard } from '../components/PayrollCard';
import { PayrollChart } from '../components/PayrollChart';
import { 
  CreditCard, CircleDollarSign, CheckSquare, 
  Search, Filter, Download, Plus, X, Calendar 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function PayrollWorkspace() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('July 2026');
  const [selectedDept, setSelectedDept] = useState('All');

  // Edit Factor modal
  const [editingPayroll, setEditingPayroll] = useState<Payroll | null>(null);

  const loadPayrolls = async () => {
    try {
      setLoading(true);
      const res = await payrollService.getPayrollRecords();
      setPayrolls(res);
    } catch (err) {
      toast.error('Failed to sync financial ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayrolls();
  }, []);

  const handlePay = async (id: string) => {
    try {
      await payrollService.updatePayrollRecord(id, { status: 'Paid' });
      toast.success('Funds disbursed successfully. Transaction logged to bank channels.');
      loadPayrolls();
    } catch (err) {
      toast.error('Payout failed');
    }
  };

  const handleBulkDisburse = async () => {
    try {
      const pendingIds = payrolls.filter(p => p.status !== 'Paid').map(p => p.id);
      if (pendingIds.length === 0) {
        toast.error('All salaries for the current run are already settled.');
        return;
      }
      await payrollService.bulkPaySalary(pendingIds);
      toast.success(`Success! Transferred settlement packets for ${pendingIds.length} personnel profiles.`);
      loadPayrolls();
    } catch (err) {
      toast.error('Bulk disburse process collapsed');
    }
  };

  const handleUpdateFactors = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayroll) return;
    try {
      // Recalculate net payable roughly
      const net = (editingPayroll.basicSalary + editingPayroll.allowances + editingPayroll.bonus) - 
                  (editingPayroll.deductions + editingPayroll.tax);
      const updated = {
        ...editingPayroll,
        netPayable: net
      };
      await payrollService.updatePayrollRecord(editingPayroll.id, updated);
      toast.success('Compensation factors re-balanced successfully.');
      setEditingPayroll(null);
      loadPayrolls();
    } catch (err) {
      toast.error('Re-balance operation failed');
    }
  };


  const filteredPayrolls = payrolls.filter(pay => {
    const matchesMonth = pay.month === selectedMonth;
    const matchesDept = selectedDept === 'All' || pay.department === selectedDept;
    return matchesMonth && matchesDept;
  });

  // Calculate high level metrics
  const totalGrossCycle = filteredPayrolls.reduce((acc, curr) => acc + curr.netPayable, 0);
  const settledGross = filteredPayrolls.filter(p => p.status === 'Paid').reduce((acc, curr) => acc + curr.netPayable, 0);
  const pendingGross = filteredPayrolls.filter(p => p.status !== 'Paid').reduce((acc, curr) => acc + curr.netPayable, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 text-left select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-5">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
            <CreditCard className="w-4 h-4" /> Enterprise Compensation Desk
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">
            Payroll Ledger Workspace
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleBulkDisburse}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-600/10"
          >
            <CircleDollarSign className="w-4 h-4" /> Settlement Run
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border rounded-2xl flex justify-between items-center shadow-sm">
          <div>
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Total Gross Budget</span>
            <h4 className="text-2xl font-black font-mono text-slate-800 dark:text-slate-100">₹{totalGrossCycle.toLocaleString()}</h4>
          </div>
          <span className="px-2 py-0.5 rounded-lg border border-indigo-150 text-[10px] font-mono font-black text-indigo-600">Cycle Active</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border rounded-2xl flex justify-between items-center shadow-sm">
          <div>
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Settled (Paid)</span>
            <h4 className="text-2xl font-black font-mono text-emerald-600">₹{settledGross.toLocaleString()}</h4>
          </div>
          <span className="px-2 py-0.5 rounded-lg border border-emerald-150 text-[10px] font-mono font-black text-emerald-600 bg-emerald-50/50">Settled</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border rounded-2xl flex justify-between items-center shadow-sm">
          <div>
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Unsettled Balance</span>
            <h4 className="text-2xl font-black font-mono text-amber-600">₹{pendingGross.toLocaleString()}</h4>
          </div>
          <span className="px-2 py-0.5 rounded-lg border border-amber-150 text-[10px] font-mono font-black text-amber-600 bg-amber-50/50">Pending</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/50 rounded-2xl text-left space-y-4 shadow-sm">
        <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-850 dark:text-slate-200">
          Compensation Expenditure Breakdowns (MoM)
        </h3>
        <PayrollChart />
      </div>

      {/* Filters and search */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200/50 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* Cycle filter */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-150 dark:border-slate-850">
            <span className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest px-1">Cycle Run:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-black bg-transparent border-none text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer pr-4"
            >
              {['May 2026', 'June 2026', 'July 2026'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
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
        </div>

        <button
          onClick={() => toast.success('Dispatched pay slip packets for settlement cycle...')}
          className="px-3.5 py-1.5 border rounded-xl text-xs font-mono font-black uppercase text-indigo-600 bg-indigo-50 hover:bg-indigo-100 flex items-center gap-1 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" /> Disbursal Manifest
        </button>
      </div>

      {/* Grid of pay card packets */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-xs animate-pulse">
          Re-calculating taxation structures...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPayrolls.map((pay) => (
            <PayrollCard
              key={pay.id}
              payroll={pay}
              onPay={handlePay}
              onEdit={(record) => setEditingPayroll({ ...record })}
            />
          ))}
          {filteredPayrolls.length === 0 && (
            <div className="p-12 text-center text-slate-400 font-mono text-xs col-span-full border border-dashed rounded-2xl">
              No payroll accounts found matching active filters.
            </div>
          )}
        </div>
      )}

      {/* Adjust Factors Modal */}
      <AnimatePresence>
        {editingPayroll && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-950 border dark:border-slate-850 max-w-sm w-full rounded-2xl shadow-xl overflow-hidden text-left"
            >
              <form onSubmit={handleUpdateFactors} className="p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200">
                    Adjust Compensation Factors
                  </h3>
                  <button type="button" onClick={() => setEditingPayroll(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-mono text-slate-400 text-[9px] uppercase font-black">Personnel details</span>
                    <p className="font-black text-slate-800 dark:text-slate-200">{editingPayroll.employeeName} ({editingPayroll.employeeId})</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Basic Salary (₹)</label>
                      <input
                        type="number"
                        value={editingPayroll.basicSalary}
                        onChange={(e) => setEditingPayroll(prev => prev ? ({ ...prev, basicSalary: Number(e.target.value) }) : null)}
                        className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Allowances (₹)</label>
                      <input
                        type="number"
                        value={editingPayroll.allowances}
                        onChange={(e) => setEditingPayroll(prev => prev ? ({ ...prev, allowances: Number(e.target.value) }) : null)}
                        className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Bonus Cycle (₹)</label>
                      <input
                        type="number"
                        value={editingPayroll.bonus}
                        onChange={(e) => setEditingPayroll(prev => prev ? ({ ...prev, bonus: Number(e.target.value) }) : null)}
                        className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Tax Deducted (₹)</label>
                      <input
                        type="number"
                        value={editingPayroll.tax}
                        onChange={(e) => setEditingPayroll(prev => prev ? ({ ...prev, tax: Number(e.target.value) }) : null)}
                        className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingPayroll(null)}
                    className="flex-1 py-2 border rounded-xl font-mono text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[10px] font-black uppercase rounded-xl cursor-pointer"
                  >
                    Save Factors
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
