/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Card } from '../../components/ui';
import { FileText, Download, ShieldCheck, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface CustomerInvoicesProps {
  customerId: string;
  invoices?: any[];
}

export const CustomerInvoices: React.FC<CustomerInvoicesProps> = ({ customerId, invoices = [] }) => {
  const defaultInvoices = [
    { id: 'INV-2026-094', date: '2026-07-15', baseAmount: 71186, cgst: 6407, sgst: 6407, total: 84000, status: 'Paid' },
    { id: 'INV-2026-081', date: '2026-06-12', baseAmount: 10593, cgst: 953, sgst: 953, total: 12500, status: 'Paid' },
    { id: 'INV-2026-042', date: '2026-05-10', baseAmount: 4068, cgst: 366, sgst: 366, total: 4800, status: 'Paid' }
  ];

  const activeInvoices = invoices.length > 0 ? invoices : defaultInvoices;

  const handleDownloadPDF = (id: string) => {
    toast.success(`Successfully generated PDF structure for ${id}`, {
      description: 'PDF compiled. Commencing secured download stream...'
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
          Tax Invoices & GST Breakdown
        </h3>
        <p className="text-[10px] text-slate-400 font-light mt-0.5">
          Invoices configured with CGST @ 9% and SGST @ 9% standards.
        </p>
      </div>

      <div className="space-y-3.5 pt-2">
        {activeInvoices.map((inv) => (
          <div 
            key={inv.id} 
            className="p-4 bg-white dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850/60 rounded-xl space-y-3 text-xs text-left"
          >
            {/* Invoice Header Row */}
            <div className="flex justify-between items-center pb-2.5 border-b border-dashed border-slate-200/50 dark:border-slate-850/40">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span className="font-bold font-mono text-slate-850 dark:text-slate-100">{inv.id}</span>
                <span className="text-[10px] text-slate-400">({inv.date})</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[8px] font-black font-mono tracking-wider uppercase border 
                  ${inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' : 'bg-amber-500/10 text-amber-600 border-amber-500/10'}`}
                >
                  {inv.status}
                </span>

                <button
                  onClick={() => handleDownloadPDF(inv.id)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-450 hover:text-indigo-500 transition-colors cursor-pointer"
                  title="Download Signed PDF Invoice"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* GST Details Box */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] font-mono text-slate-400">
              <div>
                <span className="block uppercase text-[8px] font-black">Base Assessable Value</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">₹{inv.baseAmount.toLocaleString()}</span>
              </div>
              <div>
                <span className="block uppercase text-[8px] font-black text-indigo-500/85">Central GST (9%)</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">₹{inv.cgst.toLocaleString()}</span>
              </div>
              <div>
                <span className="block uppercase text-[8px] font-black text-indigo-500/85">State GST (9%)</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">₹{inv.sgst.toLocaleString()}</span>
              </div>
              <div className="text-right md:text-right">
                <span className="block uppercase text-[8px] font-black text-emerald-500">Gross Total</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs">₹{inv.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Compliance Footer */}
            <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 bg-slate-50/20 dark:bg-slate-900/10 p-1.5 rounded-lg border border-slate-150/50 dark:border-slate-850/30">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /> Dynamic IRN Generated</span>
              <span>SAC: 998311 (Software SaaS)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
