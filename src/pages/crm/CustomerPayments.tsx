/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Card } from '../../components/ui';
import { CreditCard, AlertTriangle, ArrowRight, Wallet, CheckCircle } from 'lucide-react';

interface CustomerPaymentsProps {
  customerId: string;
  payments?: any[];
  outstandingAmount?: number;
}

export const CustomerPayments: React.FC<CustomerPaymentsProps> = ({ 
  customerId, 
  payments = [], 
  outstandingAmount = 0 
}) => {
  const defaultPayments = [
    { id: 'PAY-819', date: '2026-07-15', amount: 84000, method: 'NEFT Bank Transfer', ref: 'UTRN89217621' },
    { id: 'PAY-703', date: '2026-06-12', amount: 12500, method: 'UPI / Razorpay', ref: 'pay_9210asdfk' },
    { id: 'PAY-622', date: '2026-05-10', amount: 4800, method: 'UPI / Razorpay', ref: 'pay_8899qwerx' }
  ];

  const activePayments = payments.length > 0 ? payments : defaultPayments;

  return (
    <div className="space-y-5">
      {/* Pending payment state alert box */}
      {outstandingAmount > 0 ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/15 rounded-xl flex items-start gap-3 text-xs text-left">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-rose-600">Pending Settlement Outstanding Detected</h4>
            <p className="text-slate-550 dark:text-slate-400 font-light leading-relaxed">
              This client has an active outstanding balance of <span className="font-mono font-bold text-slate-800 dark:text-slate-100">₹{outstandingAmount.toLocaleString()}</span>. An automated dunning email reminder sequence is scheduled to go out if unpaid within 5 working days.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/15 rounded-xl flex items-start gap-3 text-xs text-left">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-emerald-600">Account Settlement In Perfect Balance</h4>
            <p className="text-slate-550 dark:text-slate-400 font-light leading-relaxed">
              No outstanding dues are currently pending on this ledger. All historical contracts are fully settled.
            </p>
          </div>
        </div>
      )}

      {/* Visual chronological payment timeline */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono text-left">
          Settlement Chronology Timeline
        </h3>

        <div className="relative border-l-2 border-slate-200 dark:border-slate-850 pl-4 space-y-5 text-left text-xs font-sans">
          {activePayments.map((pay) => (
            <div key={pay.id} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-950 bg-emerald-500 shadow-sm" />
              
              <div className="p-3 bg-white dark:bg-slate-950/30 border border-slate-150 dark:border-slate-850/60 rounded-xl space-y-1.5 shadow-3xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-850 dark:text-slate-100 flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                    Receipt Settled ({pay.id})
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">{pay.date}</span>
                </div>
                
                <div className="flex justify-between items-center font-mono text-[10px] text-slate-400 pt-1 border-t border-slate-150/40 dark:border-slate-850/30">
                  <div>Method: <span className="text-slate-700 dark:text-slate-350">{pay.method}</span></div>
                  <div>Ref: <span className="text-indigo-500">{pay.ref}</span></div>
                </div>

                <div className="text-[11px] font-mono font-extrabold text-emerald-600 pt-0.5">
                  Amount: +₹{pay.amount.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
