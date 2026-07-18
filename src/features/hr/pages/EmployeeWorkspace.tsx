/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { employeeService } from '../services/employee.service';
import { Employee } from '../../../types/hr';
import { EmployeeCard } from '../components/EmployeeCard';
import { EmployeeTimeline } from '../components/EmployeeTimeline';
import { 
  Search, Filter, Plus, Trash2, FolderPlus, ToggleLeft, 
  Download, Printer, X, Eye, FileText, Star, Shield, 
  Calendar, Phone, Mail, User, ShieldCheck, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function EmployeeWorkspace() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedEmployeeProfile, setSelectedEmployeeProfile] = useState<Employee | null>(null);
  
  // Create / Edit modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState<Partial<Employee>>({
    name: '',
    department: 'Engineering',
    designation: '',
    email: '',
    phone: '',
    employmentType: 'Full-time',
    status: 'Active',
    personalInfo: { dob: '1995-01-01', gender: 'Male', maritalStatus: 'Single', pan: '', aadhaar: '', address: '' },
    jobDetails: { manager: 'Siddharth Sen', workLocation: 'Noida HQ', probationPeriod: 'Completed', noticePeriod: '90 Days' },
    salary: 60000,
    performanceRating: 4.0,
    notes: [],
    documents: [],
    aiSummary: 'Under corporate intelligence evaluation.'
  });

  // Active tab inside Profile View
  const [profileActiveTab, setProfileActiveTab] = useState<'overview' | 'personal' | 'job' | 'docs' | 'timeline' | 'notes' | 'ai'>('overview');

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const res = await employeeService.getEmployees();
      setEmployees(res);
    } catch (err) {
      toast.error('Failed to boot personnel data stream');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedEmployees.length === 0) return;
    try {
      await employeeService.bulkDelete(selectedEmployees);
      toast.success(`Success! Pruned ${selectedEmployees.length} personnel records.`);
      setSelectedEmployees([]);
      loadEmployees();
    } catch (err) {
      toast.error('Bulk prune operations failed');
    }
  };

  const handleBulkAssignDept = async (dept: string) => {
    if (selectedEmployees.length === 0) return;
    try {
      await employeeService.bulkAssignDepartment(selectedEmployees, dept);
      toast.success(`Department updated to ${dept} for selected employees.`);
      setSelectedEmployees([]);
      loadEmployees();
    } catch (err) {
      toast.error('Bulk department updates failed');
    }
  };

  const handleBulkChangeStatus = async (status: Employee['status']) => {
    if (selectedEmployees.length === 0) return;
    try {
      await employeeService.bulkChangeStatus(selectedEmployees, status);
      toast.success(`Status updated to ${status} for selected employees.`);
      setSelectedEmployees([]);
      loadEmployees();
    } catch (err) {
      toast.error('Bulk status changes failed');
    }
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newEmployeeData.name || !newEmployeeData.email) {
        toast.error('Please input required name and email descriptors.');
        return;
      }
      await employeeService.createEmployee(newEmployeeData);
      toast.success('Successfully provisioned new employee profile.');
      setShowCreateModal(false);
      // Reset
      setNewEmployeeData({
        name: '', department: 'Engineering', designation: '', email: '', phone: '',
        employmentType: 'Full-time', status: 'Active',
        personalInfo: { dob: '1995-01-01', gender: 'Male', maritalStatus: 'Single', pan: '', aadhaar: '', address: '' },
        jobDetails: { manager: 'Siddharth Sen', workLocation: 'Noida HQ', probationPeriod: 'Completed', noticePeriod: '90 Days' },
        salary: 60000, performanceRating: 4.0, notes: [], documents: [],
        aiSummary: 'Evaluations logged successfully.'
      });
      loadEmployees();
    } catch (err) {
      toast.error('Failed to create employee profile.');
    }
  };

  const handleExport = () => {
    toast.success('Dispatched personnel records to CSV stream...');
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const departments = ['All', 'Engineering', 'Marketing', 'Sales', 'Finance', 'Human Resources'];
  const statuses = ['All', 'Active', 'On Leave', 'Suspended', 'Terminated'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 text-left select-none">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-5">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
            <User className="w-4 h-4" /> Enterprise Personnel Register
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">
            Employee Directory
          </h1>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-600/10"
        >
          <Plus className="w-4 h-4" /> Recruit Employee
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, rank..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* Department Filter */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-150 dark:border-slate-850">
            <span className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest px-1">Dept:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs font-black bg-transparent border-none text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer pr-4"
            >
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-150 dark:border-slate-850">
            <span className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest px-1">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs font-black bg-transparent border-none text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer pr-4"
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions Console */}
      {selectedEmployees.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-50/50 dark:bg-slate-950/60 border border-indigo-200/40 p-3.5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3"
        >
          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            Selected: <strong className="text-indigo-600">{selectedEmployees.length}</strong> employees
          </span>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={handleExport}
              className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-mono font-black uppercase flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-mono font-black uppercase flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={() => handleBulkAssignDept('Engineering')}
              className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-mono font-black uppercase flex items-center gap-1 cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5" /> Assign Eng
            </button>
            <button
              onClick={() => handleBulkChangeStatus('Active')}
              className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-mono font-black uppercase flex items-center gap-1 cursor-pointer"
            >
              <ToggleLeft className="w-3.5 h-3.5" /> Set Active
            </button>
            <button
              onClick={handleDeleteSelected}
              className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-mono font-black uppercase flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </motion.div>
      )}

      {/* Main List Table vs Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-xs animate-pulse">
          Syncing personnel nodes...
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850 text-[10px] font-mono font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  <th className="py-3 px-4 w-12 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={filteredEmployees.length > 0 && selectedEmployees.length === filteredEmployees.length}
                    />
                  </th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Joining Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredEmployees.map((emp, idx) => {
                    const isChecked = selectedEmployees.includes(emp.id);
                    return (
                      <motion.tr
                        key={emp.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`border-b border-slate-100 dark:border-slate-850/50 text-xs font-medium hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors
                          ${isChecked ? 'bg-indigo-50/20 dark:bg-slate-950/40' : ''}`}
                      >
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleSelectOne(emp.id)}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={emp.photo}
                              alt={emp.name}
                              className="w-8 h-8 rounded-lg object-cover border"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <span className="font-black text-slate-800 dark:text-slate-100 block">{emp.name}</span>
                              <span className="text-[9px] font-mono text-slate-400">{emp.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                          <span className="block truncate max-w-[150px]">{emp.email}</span>
                          <span>{emp.phone}</span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{emp.designation}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded border text-[9px] font-mono font-black uppercase tracking-wider bg-slate-50 dark:bg-slate-950 text-indigo-600 dark:text-indigo-400">
                            {emp.department}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">{emp.joiningDate}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[10px]">{emp.employmentType}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider
                            ${emp.status === 'Active' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400' 
                              : 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400'}`}
                          >
                            {emp.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedEmployeeProfile(emp);
                              setProfileActiveTab('overview');
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 border text-slate-700 dark:text-slate-300 rounded-lg font-mono text-[9px] font-black uppercase flex items-center gap-1.5 ml-auto cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> Inspect
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filteredEmployees.length === 0 && (
            <div className="p-12 text-center text-slate-400 font-mono text-xs">
              No personnel found under current filter representations.
            </div>
          )}
        </div>
      )}

      {/* Profile Detail Slide Drawer */}
      <AnimatePresence>
        {selectedEmployeeProfile && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex justify-end">
            {/* Backdrop click */}
            <div className="absolute inset-0" onClick={() => setSelectedEmployeeProfile(null)} />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-950 h-full overflow-y-auto shadow-2xl p-6 flex flex-col justify-between border-l dark:border-slate-850"
            >
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-850 pb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedEmployeeProfile.photo}
                      alt={selectedEmployeeProfile.name}
                      className="w-16 h-16 rounded-2xl object-cover border"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">
                        {selectedEmployeeProfile.name}
                      </h2>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {selectedEmployeeProfile.designation} &bull; {selectedEmployeeProfile.id}
                      </p>
                      <span className="px-2.5 py-0.5 rounded border text-[9px] font-mono font-black uppercase tracking-wider bg-slate-50 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 block mt-1.5 w-max">
                        {selectedEmployeeProfile.department}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedEmployeeProfile(null)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Sub Profile tabs */}
                <div className="flex gap-1 overflow-x-auto pb-1.5 border-b border-slate-100 dark:border-slate-850">
                  {([
                    { id: 'overview', title: 'Overview' },
                    { id: 'personal', title: 'Personal Info' },
                    { id: 'job', title: 'Job Details' },
                    { id: 'docs', title: 'Documents' },
                    { id: 'timeline', title: 'Timeline' },
                    { id: 'ai', title: 'AI Summary' }
                  ] as const).map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setProfileActiveTab(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider font-mono shrink-0 cursor-pointer
                        ${profileActiveTab === tab.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-slate-700 border border-transparent'}`}
                    >
                      {tab.title}
                    </button>
                  ))}
                </div>

                {/* Tab content panel */}
                <div className="py-4 space-y-4">
                  {profileActiveTab === 'overview' && (
                    <div className="space-y-4">
                      {/* Metric highlights */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border">
                          <span className="text-[8px] font-mono font-black text-slate-400 uppercase block">Compensation</span>
                          <span className="text-xs font-black font-mono text-slate-750 dark:text-slate-200">₹{selectedEmployeeProfile.salary.toLocaleString()}</span>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border">
                          <span className="text-[8px] font-mono font-black text-slate-400 uppercase block">Rating Index</span>
                          <span className="text-xs font-black font-mono text-slate-750 dark:text-slate-200 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            {selectedEmployeeProfile.performanceRating.toFixed(1)}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border">
                          <span className="text-[8px] font-mono font-black text-slate-400 uppercase block">Employment Type</span>
                          <span className="text-xs font-black font-mono text-slate-750 dark:text-slate-200">{selectedEmployeeProfile.employmentType}</span>
                        </div>
                      </div>

                      <div className="p-4 bg-indigo-50/10 dark:bg-slate-900/40 rounded-xl border border-indigo-100/10 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        <span className="font-mono font-black text-[9px] text-indigo-500 block uppercase mb-1">Executive Recommendation Card</span>
                        &ldquo;{selectedEmployeeProfile.aiSummary}&rdquo;
                      </div>

                      {/* Contact card */}
                      <div className="p-4 bg-white dark:bg-slate-900 border rounded-2xl text-xs font-mono space-y-2">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Channels</span>
                        <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> {selectedEmployeeProfile.email}</div>
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> {selectedEmployeeProfile.phone}</div>
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /> Commenced {selectedEmployeeProfile.joiningDate}</div>
                      </div>
                    </div>
                  )}

                  {profileActiveTab === 'personal' && (
                    <div className="bg-slate-50 dark:bg-slate-900/40 border p-5 rounded-2xl text-xs font-mono space-y-3">
                      <div className="flex justify-between border-b pb-2"><span className="text-slate-400">Date of Birth:</span><span className="font-bold text-slate-700 dark:text-slate-300">{selectedEmployeeProfile.personalInfo.dob}</span></div>
                      <div className="flex justify-between border-b pb-2"><span className="text-slate-400">Gender Identity:</span><span className="font-bold text-slate-700 dark:text-slate-300">{selectedEmployeeProfile.personalInfo.gender}</span></div>
                      <div className="flex justify-between border-b pb-2"><span className="text-slate-400">Marital Status:</span><span className="font-bold text-slate-700 dark:text-slate-300">{selectedEmployeeProfile.personalInfo.maritalStatus}</span></div>
                      <div className="flex justify-between border-b pb-2"><span className="text-slate-400">PAN Card Index:</span><span className="font-bold text-slate-700 dark:text-slate-300">{selectedEmployeeProfile.personalInfo.pan}</span></div>
                      <div className="flex justify-between border-b pb-2"><span className="text-slate-400">Aadhaar Vault No:</span><span className="font-bold text-slate-700 dark:text-slate-300">{selectedEmployeeProfile.personalInfo.aadhaar}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Residential Address:</span><span className="font-bold text-slate-700 dark:text-slate-300 text-right max-w-[250px] leading-relaxed">{selectedEmployeeProfile.personalInfo.address}</span></div>
                    </div>
                  )}

                  {profileActiveTab === 'job' && (
                    <div className="bg-slate-50 dark:bg-slate-900/40 border p-5 rounded-2xl text-xs font-mono space-y-3">
                      <div className="flex justify-between border-b pb-2"><span className="text-slate-400">Assigned Manager:</span><span className="font-bold text-slate-700 dark:text-slate-300">{selectedEmployeeProfile.jobDetails.manager}</span></div>
                      <div className="flex justify-between border-b pb-2"><span className="text-slate-400">Core Corporate Location:</span><span className="font-bold text-slate-700 dark:text-slate-300">{selectedEmployeeProfile.jobDetails.workLocation}</span></div>
                      <div className="flex justify-between border-b pb-2"><span className="text-slate-400">Probation Progress:</span><span className="font-bold text-slate-700 dark:text-slate-300">{selectedEmployeeProfile.jobDetails.probationPeriod}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Notice Buffer Period:</span><span className="font-bold text-slate-700 dark:text-slate-300">{selectedEmployeeProfile.jobDetails.noticePeriod}</span></div>
                    </div>
                  )}

                  {profileActiveTab === 'docs' && (
                    <div className="space-y-2">
                      {selectedEmployeeProfile.documents.map((doc, idx) => (
                        <div key={idx} className="p-3 bg-white dark:bg-slate-900 border rounded-xl flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4.5 h-4.5 text-slate-400" />
                            <div>
                              <span className="font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[250px]">{doc.name}</span>
                              <span className="text-[9px] font-mono text-slate-400">Uploaded {doc.uploadedAt} &bull; {doc.size}</span>
                            </div>
                          </div>
                          <button className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-mono text-[9px] font-black rounded border uppercase cursor-pointer">
                            Download
                          </button>
                        </div>
                      ))}
                      {selectedEmployeeProfile.documents.length === 0 && (
                        <p className="text-xs text-slate-400 text-center font-mono py-4">No documentation attached to this profile.</p>
                      )}
                    </div>
                  )}

                  {profileActiveTab === 'timeline' && (
                    <div className="p-4 border rounded-2xl bg-white dark:bg-slate-900">
                      <EmployeeTimeline employee={selectedEmployeeProfile} />
                    </div>
                  )}

                  {profileActiveTab === 'ai' && (
                    <div className="p-5 bg-indigo-50/10 dark:bg-indigo-950/25 border border-indigo-200/20 rounded-2xl text-xs space-y-3">
                      <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-mono font-black text-[10px] uppercase">
                        <ShieldCheck className="w-4 h-4 animate-pulse" /> Cognitive Deep Analytics Profile
                      </div>
                      <p className="text-slate-650 dark:text-slate-400 leading-relaxed font-sans text-xs">
                        {selectedEmployeeProfile.aiSummary}
                      </p>
                      <div className="border-t border-indigo-100/20 pt-3">
                        <span className="text-[9px] font-mono text-slate-400 block uppercase font-black">AI Evaluation Indicators</span>
                        <div className="grid grid-cols-2 gap-3 mt-1 text-xs font-mono">
                          <div>Reliability Index: <strong className="text-indigo-600">High</strong></div>
                          <div>Growth Trajectory: <strong className="text-indigo-600">Exponential</strong></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-850 pt-4 flex gap-2">
                <button
                  onClick={() => setSelectedEmployeeProfile(null)}
                  className="flex-1 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black font-mono uppercase cursor-pointer"
                >
                  Close File View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-950 border dark:border-slate-850 max-w-lg w-full rounded-2xl shadow-xl overflow-hidden text-left"
            >
              <form onSubmit={handleCreateEmployee} className="p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200">
                    Onboard New Personnel
                  </h3>
                  <button type="button" onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newEmployeeData.name}
                      onChange={(e) => setNewEmployeeData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Vikram Adityan"
                      className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Department *</label>
                    <select
                      value={newEmployeeData.department}
                      onChange={(e) => setNewEmployeeData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {departments.filter(d => d !== 'All').map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Designation / Role *</label>
                    <input
                      type="text"
                      required
                      value={newEmployeeData.designation}
                      onChange={(e) => setNewEmployeeData(prev => ({ ...prev, designation: e.target.value }))}
                      placeholder="e.g., Senior React Architect"
                      className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      value={newEmployeeData.email}
                      onChange={(e) => setNewEmployeeData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="e.g., developer@enterprise.com"
                      className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Phone Vault Number</label>
                    <input
                      type="text"
                      value={newEmployeeData.phone}
                      onChange={(e) => setNewEmployeeData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="e.g., +91 99011 22334"
                      className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-black uppercase text-[9px] text-slate-400 block">Basic Base Salary (₹)</label>
                    <input
                      type="number"
                      value={newEmployeeData.salary}
                      onChange={(e) => setNewEmployeeData(prev => ({ ...prev, salary: Number(e.target.value) }))}
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
                    Save Profile
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
