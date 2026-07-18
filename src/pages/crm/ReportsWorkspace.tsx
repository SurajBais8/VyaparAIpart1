/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Card } from '../../components/ui';
import { Button } from '../../components/ui';
import { Files, Download, ArrowRight, Sparkles, Mail, Printer } from 'lucide-react';
import { toast } from 'sonner';

export const ReportsWorkspace: React.FC = () => {
  const templates = [
    { name: 'Monthly Financial Audit Ledger', type: 'Spreadsheet (.XLSX)', desc: 'Summary of all customer purchases, outstanding balances, and GST calculations.' },
    { name: 'Weekly Funnel Conversion Speed', type: 'PDF Document (.PDF)', desc: 'Drop-off analysis of captured leads across different Kanban board stages.' },
    { name: 'Active Account Managers Ledger', type: 'Spreadsheet (.CSV)', desc: 'Details of lead counts, win percentages, and closed contract velocities.' },
    { name: 'Corporate Organizations Directory', type: 'PDF Document (.PDF)', desc: 'Aggregate of client companies with employee size benchmarks.' }
  ];

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
          <Files className="w-5 h-5 text-indigo-500" /> Export Reports Workspace
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-light mt-0.5">
          Download compliance audits, monthly billing logs, and performance summaries in bulk formats.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {templates.map((tpl, i) => (
          <Card
            key={i}
            variant="glass"
            className="p-5 border border-slate-200/50 dark:border-slate-850 flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300 gap-4"
          >
            <div className="space-y-2">
              <span className="text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 border border-indigo-500/10 rounded w-fit block">
                {tpl.type}
              </span>
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono">
                {tpl.name}
              </h3>
              <p className="text-xs text-slate-450 leading-relaxed font-light font-sans">
                {tpl.desc}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="primary"
                className="py-1.5 px-3 text-[10px] font-bold"
                onClick={() => toast.success(`Exporting dynamic "${tpl.name}" into local memory downloads!`)}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Now</span>
              </Button>
              <Button
                variant="outline"
                className="py-1.5 px-3 text-[10px] font-bold"
                onClick={() => toast.success('Sending report via SMTP distribution...')}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email to CFO</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};
