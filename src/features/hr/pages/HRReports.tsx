/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileSpreadsheet, Download, Printer, CheckSquare, 
  Calendar, CreditCard, UserCheck, TrendingUp 
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function HRReports() {
  const [reportType, setReportType] = useState<'attendance' | 'payroll' | 'recruitment' | 'leave'>('payroll');

  const handleExport = (format: 'PDF' | 'CSV' | 'Excel') => {
    toast.success(`Dispatched compiled HR ${reportType} report packet in ${format} format.`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 text-left select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-5">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
            <FileSpreadsheet className="w-4 h-4" /> Enterprise Reporting Engine
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">
            HR Reports & Ledgers
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleExport('CSV')}
            className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-black uppercase text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-mono font-black uppercase flex items-center gap-1 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> PDF / Print
          </button>
        </div>
      </div>

      {/* Grid selector of reporting modules */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {([
          { id: 'attendance', title: 'Attendance Logbook', icon: <Calendar className="w-5 h-5" />, desc: 'Check-in metrics, late percentages, work overtime curves' },
          { id: 'payroll', title: 'Payroll Ledger', icon: <CreditCard className="w-5 h-5" />, desc: 'Base payouts, bonus elements, taxation records' },
          { id: 'recruitment', title: 'Talent Acquisition', icon: <UserCheck className="w-5 h-5" />, desc: 'Active careers pipeline statuses, applicant evaluations' },
          { id: 'leave', title: 'Leave & Time-Off', icon: <TrendingUp className="w-5 h-5" />, desc: 'Balances, scheduled leaves, absenteeism rates' }
        ] as const).map((rep) => (
          <button
            key={rep.id}
            onClick={() => setReportType(rep.id)}
            className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-32 transition-all cursor-pointer select-none
              ${reportType === rep.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350 hover:bg-slate-50/50'}`}
          >
            <div className="flex justify-between items-start w-full">
              <div className={`p-1.5 rounded-xl border ${reportType === rep.id ? 'bg-indigo-700 border-indigo-500' : 'bg-slate-50 border-slate-100'}`}>
                {rep.icon}
              </div>
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-black uppercase font-mono tracking-wider">{rep.title}</h4>
              <p className={`text-[10px] leading-snug line-clamp-2 ${reportType === rep.id ? 'text-indigo-100' : 'text-slate-450'}`}>{rep.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Detail reporting table presentation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-xs font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200">
            Active Data Stream Grid &bull; {reportType.toUpperCase()} SUMMARY
          </h3>
          <span className="text-[9px] font-mono font-bold text-slate-400">July 2026 Run Cycle</span>
        </div>

        {reportType === 'attendance' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b font-mono font-black text-slate-400 uppercase text-[9px]">
                  <th className="py-2.5 px-4">Cycle Run Date</th>
                  <th className="py-2.5 px-4">Personnel Logged</th>
                  <th className="py-2.5 px-4">Late Percentage</th>
                  <th className="py-2.5 px-4">Total Overtime Hours</th>
                  <th className="py-2.5 px-4">Compliance Rating</th>
                </tr>
              </thead>
              <tbody className="font-medium text-slate-600 dark:text-slate-400">
                <tr className="border-b">
                  <td className="py-2.5 px-4 font-mono">2026-07-18</td>
                  <td className="py-2.5 px-4">42 Members</td>
                  <td className="py-2.5 px-4 font-mono text-amber-600 font-bold">4.7%</td>
                  <td className="py-2.5 px-4 font-mono">+12.0 Hours</td>
                  <td className="py-2.5 px-4 text-emerald-600 font-bold">96.5%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2.5 px-4 font-mono">2026-07-17</td>
                  <td className="py-2.5 px-4">39 Members</td>
                  <td className="py-2.5 px-4 font-mono text-emerald-600 font-bold">1.2%</td>
                  <td className="py-2.5 px-4 font-mono">+8.5 Hours</td>
                  <td className="py-2.5 px-4 text-emerald-600 font-bold">98.8%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2.5 px-4 font-mono">2026-07-16</td>
                  <td className="py-2.5 px-4">41 Members</td>
                  <td className="py-2.5 px-4 font-mono text-amber-600 font-bold">5.8%</td>
                  <td className="py-2.5 px-4 font-mono">+9.2 Hours</td>
                  <td className="py-2.5 px-4 text-emerald-600 font-bold">94.2%</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'payroll' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b font-mono font-black text-slate-400 uppercase text-[9px]">
                  <th className="py-2.5 px-4">Division Cluster</th>
                  <th className="py-2.5 px-4">Allocated Base Budget</th>
                  <th className="py-2.5 px-4">Bonuses Disbursed</th>
                  <th className="py-2.5 px-4">Tax Ded. Packets</th>
                  <th className="py-2.5 px-4">Net Payouts Committed</th>
                </tr>
              </thead>
              <tbody className="font-medium text-slate-600 dark:text-slate-400">
                <tr className="border-b">
                  <td className="py-2.5 px-4 font-black">Engineering Division</td>
                  <td className="py-2.5 px-4 font-mono">₹450,000</td>
                  <td className="py-2.5 px-4 font-mono text-emerald-600">+₹35,000</td>
                  <td className="py-2.5 px-4 font-mono text-rose-500">-₹68,000</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">₹417,000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2.5 px-4 font-black">Marketing Division</td>
                  <td className="py-2.5 px-4 font-mono">₹180,000</td>
                  <td className="py-2.5 px-4 font-mono text-emerald-600">+₹15,000</td>
                  <td className="py-2.5 px-4 font-mono text-rose-500">-₹21,000</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">₹174,000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2.5 px-4 font-black">Sales Division</td>
                  <td className="py-2.5 px-4 font-mono">₹220,000</td>
                  <td className="py-2.5 px-4 font-mono text-emerald-600">+₹20,000</td>
                  <td className="py-2.5 px-4 font-mono text-rose-500">-₹28,000</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">₹212,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'recruitment' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b font-mono font-black text-slate-400 uppercase text-[9px]">
                  <th className="py-2.5 px-4">Careers Class</th>
                  <th className="py-2.5 px-4">Total Requisitions</th>
                  <th className="py-2.5 px-4">Total Applied Pipelines</th>
                  <th className="py-2.5 px-4">Interviews Complete</th>
                  <th className="py-2.5 px-4">Offers Extended</th>
                </tr>
              </thead>
              <tbody className="font-medium text-slate-600 dark:text-slate-400">
                <tr className="border-b">
                  <td className="py-2.5 px-4 font-black">Engineering Roles</td>
                  <td className="py-2.5 px-4 font-mono font-bold">5 Open</td>
                  <td className="py-2.5 px-4 font-mono">42 files</td>
                  <td className="py-2.5 px-4 font-mono">18 loops</td>
                  <td className="py-2.5 px-4 font-mono text-emerald-600 font-bold">3 Extended</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2.5 px-4 font-black">Marketing Roles</td>
                  <td className="py-2.5 px-4 font-mono font-bold">2 Open</td>
                  <td className="py-2.5 px-4 font-mono">12 files</td>
                  <td className="py-2.5 px-4 font-mono">4 loops</td>
                  <td className="py-2.5 px-4 font-mono text-emerald-600 font-bold">1 Extended</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'leave' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b font-mono font-black text-slate-400 uppercase text-[9px]">
                  <th className="py-2.5 px-4">Classification</th>
                  <th className="py-2.5 px-4">Allocated Balance</th>
                  <th className="py-2.5 px-4">Leaves Scheduled Today</th>
                  <th className="py-2.5 px-4">Approved Leaves (MoM)</th>
                  <th className="py-2.5 px-4">Unplanned Absenteeism Ratio</th>
                </tr>
              </thead>
              <tbody className="font-medium text-slate-600 dark:text-slate-400">
                <tr className="border-b">
                  <td className="py-2.5 px-4 font-black">Casual Time-off</td>
                  <td className="py-2.5 px-4 font-mono">12.0 Days</td>
                  <td className="py-2.5 px-4 font-mono">3 Members</td>
                  <td className="py-2.5 px-4 font-mono">14 logs</td>
                  <td className="py-2.5 px-4 font-mono text-amber-600 font-bold">1.4%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2.5 px-4 font-black">Sick Leave</td>
                  <td className="py-2.5 px-4 font-mono">10.0 Days</td>
                  <td className="py-2.5 px-4 font-mono">1 Member</td>
                  <td className="py-2.5 px-4 font-mono">8 logs</td>
                  <td className="py-2.5 px-4 font-mono text-emerald-600 font-bold">0.8%</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
