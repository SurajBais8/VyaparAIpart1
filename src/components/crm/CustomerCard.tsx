/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Card } from '../ui';
import { Mail, Phone, MapPin, Building2, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface CustomerCardProps {
  customer: any;
  onClick?: () => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      onClick={onClick}
      className="bg-white/75 dark:bg-slate-950/75 border border-slate-200/50 dark:border-slate-800/60 p-5 rounded-2xl shadow-xs hover:shadow-md cursor-pointer transition-all duration-300 text-left space-y-4"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-indigo-600/10">
            {customer.avatar || 'C'}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span>{customer.name}</span>
              {customer.tags?.includes('Premium') && (
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              )}
            </h4>
            <span className="text-[10px] text-slate-400 font-light font-mono">{customer.id}</span>
          </div>
        </div>

        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider uppercase border
          ${customer.status === 'Active'
            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-500/10'
            : 'bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-500/10'}`}
        >
          {customer.status}
        </span>
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 font-sans">
        <div className="flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate font-semibold text-slate-700 dark:text-slate-300">{customer.company}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-slate-400" />
          <span>+91 {customer.mobile}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-slate-400 truncate" />
          <span className="truncate">{customer.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{customer.city}, {customer.state}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-850 flex justify-between items-center text-[10px] font-mono">
        <div>
          <span className="text-slate-400 block uppercase font-bold">Purchased</span>
          <span className="text-slate-700 dark:text-slate-200 font-bold text-xs mt-0.5">₹{customer.totalPurchase.toLocaleString()}</span>
        </div>
        <div className="text-right">
          <span className="text-slate-400 block uppercase font-bold">Outstanding</span>
          <span className={`font-bold text-xs mt-0.5 ${customer.outstandingAmount > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
            ₹{customer.outstandingAmount.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
