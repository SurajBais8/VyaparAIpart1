/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  FileText,
  Users2,
  TrendingUp,
  FolderOpen,
  Settings,
  X,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { customerService } from '../../services/customer.service';
import { leadService } from '../../services/lead.service';
import { companyService } from '../../services/company.service';
import { dealService } from '../../services/deal.service';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickForm: (formType: 'customer' | 'lead' | 'deal') => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenQuickForm
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ category: string; title: string; id: string; url: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Dynamic searches inside mock lists
  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();

    const fetchMatches = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      const q = query.toLowerCase();
      const matches: typeof results = [];

      try {
        const [custs, lds, comps, dls] = await Promise.all([
          customerService.getCustomers(),
          leadService.getLeads(),
          companyService.getCompanies(),
          dealService.getDeals()
        ]);

        custs.filter((c: any) => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q))
          .slice(0, 3)
          .forEach((c: any) => matches.push({ category: 'Customers', title: c.name, id: c.id, url: `/crm/customers/${c.id}` }));

        lds.filter((l: any) => l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q))
          .slice(0, 3)
          .forEach((l: any) => matches.push({ category: 'Leads', title: l.name, id: l.id, url: `/crm/leads/${l.id}` }));

        comps.filter((co: any) => co.name.toLowerCase().includes(q))
          .slice(0, 3)
          .forEach((co: any) => matches.push({ category: 'Companies', title: co.name, id: co.id, url: `/crm/companies/${co.id}` }));

        dls.filter((d: any) => d.name.toLowerCase().includes(q))
          .slice(0, 3)
          .forEach((d: any) => matches.push({ category: 'Deals', title: `${d.name} (₹${d.value.toLocaleString()})`, id: d.id, url: `/crm/deals` }));

      } catch (err) {
        console.error(err);
      }

      setResults(matches);
    };

    const timer = setTimeout(fetchMatches, 150);
    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Handle Escape key, or direct route selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelectRoute = (url: string) => {
    onClose();
    setQuery('');
    navigate(url);
  };

  const handleQuickForm = (type: 'customer' | 'lead' | 'deal') => {
    onClose();
    setQuery('');
    onOpenQuickForm(type);
  };

  if (!isOpen) return null;

  const quickNavigations = [
    { title: 'Overview Dashboard', url: '/dashboard/overview', icon: <TrendingUp className="w-4 h-4 text-indigo-500" /> },
    { title: 'Customers Directory', url: '/crm/customers', icon: <Users2 className="w-4 h-4 text-emerald-500" /> },
    { title: 'Leads Pipeline (Kanban)', url: '/crm/leads', icon: <FolderOpen className="w-4 h-4 text-rose-500" /> },
    { title: 'Corporate Companies', url: '/crm/companies', icon: <FileText className="w-4 h-4 text-amber-500" /> },
    { title: 'Sales Performance Reports', url: '/dashboard/reports', icon: <Settings className="w-4 h-4 text-indigo-500" /> }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-10 pt-20 sm:pt-28">
      {/* Dark backdrop */}
      <div className="fixed inset-0 bg-slate-900/45 dark:bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -10 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 text-left flex flex-col"
      >
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-900/10">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a name, company, deal amount, or action keyword..."
            className="w-full bg-transparent border-0 outline-none text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Query Results */}
        <div className="max-h-96 overflow-y-auto p-3.5 space-y-4">
          {query.trim() && results.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Found Records
              </span>
              <div className="space-y-1">
                {results.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => handleSelectRoute(res.url)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 text-xs text-slate-700 dark:text-slate-350 transition-colors cursor-pointer text-left"
                  >
                    <div>
                      <span className="font-extrabold text-indigo-700 dark:text-indigo-400 font-mono text-[9px] uppercase mr-2 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded border border-indigo-500/10">{res.category}</span>
                      <span>{res.title}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-400 italic">
              No matching records found. Try typing another search prompt.
            </div>
          )}

          {/* Quick Actions Panel */}
          {!query.trim() && (
            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1 select-none">
                <Zap className="w-3.5 h-3.5" /> Instant Launch Actions
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleQuickForm('customer')}
                  className="p-3 border border-slate-150/50 dark:border-slate-850 hover:border-indigo-500/30 dark:hover:border-indigo-500/35 bg-slate-50/20 hover:bg-indigo-50/10 rounded-xl flex flex-col items-center justify-center text-center gap-1 cursor-pointer transition-all duration-300"
                >
                  <PlusCircle className="w-5 h-5 text-indigo-500" />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-tight">New Customer</span>
                </button>
                <button
                  onClick={() => handleQuickForm('lead')}
                  className="p-3 border border-slate-150/50 dark:border-slate-850 hover:border-indigo-500/30 dark:hover:border-indigo-500/35 bg-slate-50/20 hover:bg-indigo-50/10 rounded-xl flex flex-col items-center justify-center text-center gap-1 cursor-pointer transition-all duration-300"
                >
                  <PlusCircle className="w-5 h-5 text-rose-500" />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-tight">New Lead</span>
                </button>
                <button
                  onClick={() => handleQuickForm('deal')}
                  className="p-3 border border-slate-150/50 dark:border-slate-850 hover:border-indigo-500/30 dark:hover:border-indigo-500/35 bg-slate-50/20 hover:bg-indigo-50/10 rounded-xl flex flex-col items-center justify-center text-center gap-1 cursor-pointer transition-all duration-300"
                >
                  <PlusCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-tight">New Deal Opportunity</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick navigation links */}
          {!query.trim() && (
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-850/65">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono select-none">
                Workspace Shortcuts
              </span>
              <div className="space-y-1">
                {quickNavigations.map((nav) => (
                  <button
                    key={nav.title}
                    onClick={() => handleSelectRoute(nav.url)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-xs text-slate-750 dark:text-slate-300 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      {nav.icon}
                      <span>{nav.title}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
