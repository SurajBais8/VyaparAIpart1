/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  Sparkles, 
  History, 
  ArrowRight, 
  Zap, 
  Briefcase, 
  Users, 
  Target, 
  Building,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { customerService } from '../../services/customer.service';
import { leadService } from '../../services/lead.service';
import { companyService } from '../../services/company.service';
import { dealService } from '../../services/deal.service';
import { toast } from 'sonner';

interface SearchResult {
  category: 'Customers' | 'Leads' | 'Companies' | 'Deals';
  title: string;
  sub: string;
  id: string;
  url: string;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggestions
  const searchSuggestions = [
    { label: 'Wayne Enterprises', q: 'Wayne' },
    { label: 'Priyanka Sharma', q: 'Priyanka' },
    { label: 'Active Leads', q: 'Inbound' },
    { label: 'Deals under evaluation', q: 'SaaS' }
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('crm_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        setRecentSearches(['Wayne', 'Cognitive', 'Mumbai']);
      }
    } else {
      const initial = ['Wayne', 'Cognitive', 'Mumbai'];
      setRecentSearches(initial);
      localStorage.setItem('crm_recent_searches', JSON.stringify(initial));
    }
  }, []);

  // Sync keyboard shortcuts (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input automatically on opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 120);
      setActiveIndex(-1);
      setIsAiMode(false);
      setAiResponse(null);
    }
  }, [isOpen]);

  // Search execution
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }

    const performSearch = async () => {
      const q = query.toLowerCase().trim();
      const matches: SearchResult[] = [];

      try {
        const [customers, leads, companies, deals] = await Promise.all([
          customerService.getCustomers(),
          leadService.getLeads(),
          companyService.getCompanies(),
          dealService.getDeals()
        ]);

        // Filter Customers
        customers.filter((c: any) => 
          c.name.toLowerCase().includes(q) || 
          c.company.toLowerCase().includes(q) || 
          (c.city && c.city.toLowerCase().includes(q))
        ).slice(0, 3).forEach((c: any) => {
          matches.push({
            category: 'Customers',
            title: c.name,
            sub: `${c.company} · ${c.city || 'Mumbai'}`,
            id: c.id,
            url: `/crm/contacts/${c.id}` // direct profile routing
          });
        });

        // Filter Leads
        leads.filter((l: any) => 
          l.name.toLowerCase().includes(q) || 
          l.company.toLowerCase().includes(q) || 
          l.source.toLowerCase().includes(q)
        ).slice(0, 3).forEach((l: any) => {
          matches.push({
            category: 'Leads',
            title: l.name,
            sub: `Stage: ${l.stage} · Source: ${l.source} · Score: ${l.score}`,
            id: l.id,
            url: `/crm/leads` // links to boards
          });
        });

        // Filter Companies
        companies.filter((co: any) => 
          co.name.toLowerCase().includes(q) || 
          (co.industry && co.industry.toLowerCase().includes(q))
        ).slice(0, 3).forEach((co: any) => {
          matches.push({
            category: 'Companies',
            title: co.name,
            sub: `${co.industry || 'Tech Solutions'} · ${co.employees || 100} Employees`,
            id: co.id,
            url: `/crm/companies`
          });
        });

        // Filter Deals
        deals.filter((d: any) => 
          d.name.toLowerCase().includes(q) || 
          d.company.toLowerCase().includes(q) || 
          d.stage.toLowerCase().includes(q)
        ).slice(0, 3).forEach((d: any) => {
          matches.push({
            category: 'Deals',
            title: d.name,
            sub: `Value: ₹${d.value.toLocaleString()} · Stage: ${d.stage} · ${d.probability}% Win Prob`,
            id: d.id,
            url: `/crm/deals/${d.id}` // direct profile routing
          });
        });

      } catch (err) {
        console.error('Search evaluation failure:', err);
      }

      setResults(matches);
      setActiveIndex(prev => matches.length > 0 ? 0 : -1);
    };

    const debounced = setTimeout(performSearch, 150);
    return () => clearTimeout(debounced);
  }, [query]);

  // Handle keyboard list navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1 < results.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 >= 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        handleSelectRoute(results[activeIndex]);
      } else if (query.trim()) {
        saveSearchQuery(query.trim());
        toast.info(`Executing global search for "${query}"`);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const saveSearchQuery = (term: string) => {
    const updated = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('crm_recent_searches', JSON.stringify(updated));
  };

  const handleSelectRoute = (res: SearchResult) => {
    saveSearchQuery(query || res.title);
    onClose();
    setQuery('');
    navigate(res.url);
    toast.success(`Redirected to: ${res.title}`);
  };

  const handleAiSearch = () => {
    if (!query.trim()) {
      toast.warning('Please input a query to synthesize with AI.');
      return;
    }
    setIsAiMode(true);
    setAiResponse('Connecting to secure LLM gateway...');

    // Simulate AI CRM Insights
    setTimeout(() => {
      const q = query.toLowerCase();
      if (q.includes('wayne')) {
        setAiResponse('AI SUMMARY: "Wayne Enterprises" shows a high-priority hot deal (₹8,50,000) at 85% probability. PRIORITY RECOMMENDATION: The client expected renewal is in 10 days. Schedule a follow-up call with point-of-contact instantly.');
      } else if (q.includes('priyanka')) {
        setAiResponse('AI SUMMARY: Lead "Priyanka Sharma" has a Lead Score of 94/100, which is in the top 5% of this quarter. PRIORITY RECOMMENDATION: Trigger an automated welcome brochure and coordinate with John Doe immediately.');
      } else {
        setAiResponse(`AI SUMMARY: Searched across database for "${query}". Evaluated 14 related transaction logs, lead scoring records, and communication timestamps. Insights indicate active healthy velocity with zero flagged blockages.`);
      }
    }, 850);
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const handleClearRecents = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('crm_recent_searches');
    toast.success('Search histories wiped clean.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-10 pt-20 sm:pt-28 select-none">
      {/* Semi-transparent dark blur backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/35 dark:bg-slate-950/65 backdrop-blur-xs transition-opacity" 
      />

      {/* Main command palette canvas */}
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-2xl overflow-hidden z-10 text-left flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Search input bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-150 dark:border-slate-850/60 bg-slate-50/50 dark:bg-slate-900/10">
          <Search className="w-4 h-4 text-slate-450 dark:text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search CRM databases (Ctrl+K or type anything...)"
            className="w-full bg-transparent border-0 outline-none text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-medium"
          />

          <div className="flex items-center gap-2">
            {/* AI Search Button */}
            {query.trim() && (
              <button
                onClick={handleAiSearch}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase font-mono tracking-wider flex items-center gap-1 cursor-pointer shadow-xs animate-pulse"
                title="Synthesize matching data with AI insights"
              >
                <Sparkles className="w-3 h-3 fill-white" /> AI Insight
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1 rounded-lg border border-slate-200 dark:border-slate-850 text-slate-400 hover:text-slate-650 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content canvas - Scrollable */}
        <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
          
          {/* AI Response Area */}
          {isAiMode && aiResponse && (
            <div className="p-3.5 bg-indigo-50/20 dark:bg-indigo-950/20 border border-indigo-500/10 rounded-2xl text-xs text-indigo-700 dark:text-indigo-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black font-mono tracking-widest uppercase flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-3.5 h-3.5 fill-current animate-spin" /> AI CRM ASSISTANT
                </span>
                <button 
                  onClick={() => setIsAiMode(false)}
                  className="text-[10px] text-slate-400 hover:text-slate-650 cursor-pointer font-bold font-mono"
                >
                  ✕ DISMISS
                </button>
              </div>
              <p className="font-light leading-relaxed font-sans">{aiResponse}</p>
            </div>
          )}

          {/* Results section */}
          {query.trim() ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono select-none">
                <span>Matching Database Records ({results.length})</span>
                <span className="text-[9px] lowercase italic">Use Arrow Keys + Enter</span>
              </div>

              {results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((res, idx) => (
                    <button
                      key={`${res.category}-${res.id}-${idx}`}
                      onClick={() => handleSelectRoute(res)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left cursor-pointer transition-all border
                        ${idx === activeIndex 
                          ? 'bg-indigo-600/10 border-indigo-500/20 text-slate-800 dark:text-slate-200' 
                          : 'bg-transparent border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40'}`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Categorized Lucide icons */}
                        <span className={`p-1.5 rounded-lg border
                          ${res.category === 'Customers' ? 'bg-emerald-500/10 border-emerald-500/10 text-emerald-500' : ''}
                          ${res.category === 'Leads' ? 'bg-indigo-500/10 border-indigo-500/10 text-indigo-500' : ''}
                          ${res.category === 'Companies' ? 'bg-amber-500/10 border-amber-500/10 text-amber-500' : ''}
                          ${res.category === 'Deals' ? 'bg-rose-500/10 border-rose-500/10 text-rose-500' : ''}
                        `}>
                          {res.category === 'Customers' && <Users className="w-3.5 h-3.5" />}
                          {res.category === 'Leads' && <Target className="w-3.5 h-3.5" />}
                          {res.category === 'Companies' && <Building className="w-3.5 h-3.5" />}
                          {res.category === 'Deals' && <Briefcase className="w-3.5 h-3.5" />}
                        </span>

                        <div className="space-y-0.5 text-left">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{res.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono font-medium truncate max-w-[320px]">{res.sub}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-mono font-bold bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded text-slate-450 uppercase">
                          {res.category}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mx-auto text-slate-400">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-350">No Matches Recorded</p>
                    <p className="text-[10px] text-slate-450 font-light">No records found matching your current query.</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Recent Searches section */}
              {recentSearches.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono select-none">
                    <span className="flex items-center gap-1"><History className="w-3.5 h-3.5" /> Recent CRM Queries</span>
                    <button 
                      onClick={handleClearRecents}
                      className="hover:underline text-[9px] lowercase italic hover:text-rose-500"
                    >
                      Clear history
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {recentSearches.map((term, index) => (
                      <button
                        key={`${term}-${index}`}
                        onClick={() => handleRecentClick(term)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-indigo-50/10 hover:border-indigo-500/20 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-850 font-medium cursor-pointer transition-all"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions keywords */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-850/50">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono select-none flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Recommended Explorations
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {searchSuggestions.map((sug) => (
                    <button
                      key={sug.label}
                      onClick={() => handleRecentClick(sug.q)}
                      className="px-3 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-850 bg-white/20 hover:bg-slate-50/40 text-slate-700 dark:text-slate-300 font-medium cursor-pointer transition-colors text-left flex items-center justify-between"
                    >
                      <span>{sug.label}</span>
                      <Search className="w-3 h-3 text-slate-350" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Palette Footer keyboard guide */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/10 text-center select-none text-[9px] text-slate-400 font-mono flex justify-center items-center gap-4">
          <span><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Esc</kbd> close</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">↑↓</kbd> navigate</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Enter</kbd> open</span>
        </div>

      </div>
    </div>
  );
};
