/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Card } from '../ui';
import { Users, Briefcase, DollarSign, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface CompanyCardProps {
  company: any;
  onClick?: () => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      onClick={onClick}
      className="bg-white/75 dark:bg-slate-950/75 border border-slate-200/50 dark:border-slate-800/60 p-5 rounded-2xl shadow-xs hover:shadow-md cursor-pointer transition-all duration-300 text-left space-y-4"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200/40 bg-slate-100 flex items-center justify-center flex-shrink-0">
            {company.logo ? (
              <img referrerPolicy="no-referrer" src={company.logo} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              <Briefcase className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate max-w-[150px]">{company.name}</h4>
            <span className="text-[10px] text-slate-400 font-light font-mono">{company.id}</span>
          </div>
        </div>

        <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10">
          {company.industry}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-850/60">
        <div className="space-y-0.5">
          <span className="text-[9px] font-black uppercase text-slate-400 font-mono flex items-center gap-1">
            <Users className="w-3 h-3 text-slate-400" /> Employees
          </span>
          <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">{company.employees}</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[9px] font-black uppercase text-slate-400 font-mono flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-slate-400" /> Value (INR)
          </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">₹{company.revenue.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 pt-1 font-mono">
        <span>Contacts: {company.contacts || company.profile?.contactsList?.length || 0} linked</span>
        <span className="text-indigo-500 dark:text-indigo-400 font-bold flex items-center gap-1">
          Open Profile <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </motion.div>
  );
};
