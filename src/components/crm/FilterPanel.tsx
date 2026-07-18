/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Card } from '../ui';
import { Filter, X, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FilterPanelProps {
  isOpen: boolean;
  onClose?: () => void;
  onApplyFilters: (filters: any) => void;
  onResetFilters: () => void;
  availableStatuses?: string[];
  availableCities?: string[];
  availableTypes?: string[];
  availableTags?: string[];
  availableIndustries?: string[];
  type?: 'customers' | 'leads' | 'companies' | 'deals';
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  onResetFilters,
  availableStatuses = ['Active', 'Inactive'],
  availableCities = ['Mumbai', 'Bangalore', 'Chennai', 'Pune', 'Delhi'],
  availableTypes = ['Enterprise', 'Mid-Market', 'SMB'],
  availableTags = ['Premium', 'Consulting', 'Tech', 'Healthcare', 'Partner'],
  availableIndustries = ['Engineering & Design', 'Technology & Software', 'Defense & Technology', 'Healthcare', 'Finance'],
  type = 'customers'
}) => {
  const [status, setStatus] = useState('');
  const [city, setCity] = useState('');
  const [bizType, setBizType] = useState('');
  const [tag, setTag] = useState('');
  const [minPurchase, setMinPurchase] = useState('');
  const [maxPurchase, setMaxPurchase] = useState('');
  const [leadStage, setLeadStage] = useState('');
  const [dealStage, setDealStage] = useState('');
  const [industry, setIndustry] = useState('');

  const handleApply = () => {
    onApplyFilters({
      status,
      city,
      bizType,
      tag,
      minPurchase: minPurchase ? Number(minPurchase) : undefined,
      maxPurchase: maxPurchase ? Number(maxPurchase) : undefined,
      leadStage,
      dealStage,
      industry
    });
  };

  const handleReset = () => {
    setStatus('');
    setCity('');
    setBizType('');
    setTag('');
    setMinPurchase('');
    setMaxPurchase('');
    setLeadStage('');
    setDealStage('');
    setIndustry('');
    onResetFilters();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="w-full overflow-hidden"
    >
      <Card variant="glass" className="p-4 sm:p-5 border border-slate-200/60 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 rounded-2xl">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-850 mb-4">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100 text-xs">
            <Filter className="w-4 h-4 text-indigo-500" />
            <span>Advanced Search Ledger Filters</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg border border-transparent text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
            >
              <RefreshCcw className="w-3 h-3" /> Reset
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
          {/* Status Filter */}
          {type !== 'deals' && (
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider font-mono">Status Indicator</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">All Statuses</option>
                {availableStatuses.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          )}

          {/* Customer-Specific Filters */}
          {type === 'customers' && (
            <>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider font-mono">Metro / City Location</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">All Cities</option>
                  {availableCities.map((ct) => (
                    <option key={ct} value={ct}>{ct}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider font-mono">Corporate Model</label>
                <select
                  value={bizType}
                  onChange={(e) => setBizType(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">All Business Types</option>
                  {availableTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider font-mono">Special Tags</label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">All Tags</option>
                  {availableTags.map((tg) => (
                    <option key={tg} value={tg}>{tg}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider font-mono">Purchase Limit Range (₹)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPurchase}
                    onChange={(e) => setMinPurchase(e.target.value)}
                    className="w-1/2 text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <span className="text-slate-300 font-mono">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPurchase}
                    onChange={(e) => setMaxPurchase(e.target.value)}
                    className="w-1/2 text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            </>
          )}

          {/* Lead-Specific Filters */}
          {type === 'leads' && (
            <>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider font-mono">Kanban Stage</label>
                <select
                  value={leadStage}
                  onChange={(e) => setLeadStage(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">All Stages</option>
                  {['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'].map((stg) => (
                    <option key={stg} value={stg}>{stg}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Company-Specific Filters */}
          {type === 'companies' && (
            <>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider font-mono">Industry Vertical</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">All Industries</option>
                  {availableIndustries.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Deal-Specific Filters */}
          {type === 'deals' && (
            <>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider font-mono">Sales Stage</label>
                <select
                  value={dealStage}
                  onChange={(e) => setDealStage(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">All Stages</option>
                  {['Prospect', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'].map((dstg) => (
                    <option key={dstg} value={dstg}>{dstg}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-5 pt-3 border-t border-slate-100 dark:border-slate-850">
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md shadow-indigo-600/10 active:scale-98 transition-all duration-300"
          >
            Apply Active Filters
          </button>
        </div>
      </Card>
    </motion.div>
  );
};
