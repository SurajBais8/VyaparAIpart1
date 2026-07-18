/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { departmentService } from '../services/department.service';
import { Department } from '../../../types/hr';
import { DepartmentCard } from '../components/DepartmentCard';
import { Building2, Plus, X, FolderKanban } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function DepartmentWorkspace() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Budget modal
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  // Create department modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDept, setNewDept] = useState({
    name: '',
    manager: '',
    budget: 500000,
    employeeCount: 0,
    performance: 85
  });

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const res = await departmentService.getDepartments();
      setDepartments(res);
    } catch (err) {
      toast.error('Failed to sync department nodes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;
    try {
      await departmentService.updateDepartment(editingDept.id, { budget: editingDept.budget });
      toast.success(`Department budget re-allocated successfully to ₹${editingDept.budget.toLocaleString()}`);
      setEditingDept(null);
      loadDepartments();
    } catch (err) {
      toast.error('Failed to update department budget');
    }
  };

  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newDept.name || !newDept.manager) {
        toast.error('Please input department name and supervisor.');
        return;
      }
      await departmentService.createDepartment(newDept);
      toast.success('Successfully provisioned department division cluster.');
      setShowCreateModal(false);
      setNewDept({
        name: '',
        manager: '',
        budget: 500000,
        employeeCount: 0,
        performance: 85
      });
      loadDepartments();
    } catch (err) {
      toast.error('Failed to instantiate department');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 text-left select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-5">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
            <Building2 className="w-4 h-4" /> Divisions & Organograms
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">
            Departments Workspace
          </h1>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-600/10"
        >
          <Plus className="w-4 h-4" /> Instantiate Division
        </button>
      </div>

      {/* Grid of department cards */}
      {loading ? (
        <p className="text-center font-mono text-xs text-slate-400 animate-pulse">Syncing department clusters...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <DepartmentCard
              key={dept.id}
              department={dept}
              onEdit={(item) => setEditingDept({ ...item })}
            />
          ))}
          {departments.length === 0 && (
            <p className="text-center font-mono text-xs text-slate-400 col-span-full py-12">No corporate divisions mapped.</p>
          )}
        </div>
      )}

      {/* Edit Budget Modal */}
      <AnimatePresence>
        {editingDept && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-950 border dark:border-slate-850 max-w-sm w-full rounded-2xl shadow-xl overflow-hidden text-left"
            >
              <form onSubmit={handleUpdateBudget} className="p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200">
                    Re-allocate Budget
                  </h3>
                  <button type="button" onClick={() => setEditingDept(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-mono text-slate-400 text-[9px] uppercase font-black">Division Cluster</span>
                    <p className="font-black text-slate-800 dark:text-slate-200">{editingDept.name} ({editingDept.id})</p>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Annual Allocated Budget (₹)</label>
                    <input
                      type="number"
                      required
                      value={editingDept.budget}
                      onChange={(e) => setEditingDept(prev => prev ? ({ ...prev, budget: Number(e.target.value) }) : null)}
                      className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingDept(null)}
                    className="flex-1 py-2 border rounded-xl font-mono text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[10px] font-black uppercase rounded-xl cursor-pointer"
                  >
                    Confirm Allocation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Division Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-950 border dark:border-slate-850 max-w-sm w-full rounded-2xl shadow-xl overflow-hidden text-left"
            >
              <form onSubmit={handleCreateDept} className="p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200">
                    Instantiate division cluster
                  </h3>
                  <button type="button" onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Division name *</label>
                    <input
                      type="text"
                      required
                      value={newDept.name}
                      onChange={(e) => setNewDept(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Artificial Intelligence Core"
                      className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Head manager name *</label>
                    <input
                      type="text"
                      required
                      value={newDept.manager}
                      onChange={(e) => setNewDept(prev => ({ ...prev, manager: e.target.value }))}
                      placeholder="e.g., Siddharth Sen"
                      className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Annual Allocated Budget (₹)</label>
                    <input
                      type="number"
                      value={newDept.budget}
                      onChange={(e) => setNewDept(prev => ({ ...prev, budget: Number(e.target.value) }))}
                      className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-2 border rounded-xl font-mono text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[10px] font-black uppercase rounded-xl cursor-pointer"
                  >
                    Confirm Division
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
