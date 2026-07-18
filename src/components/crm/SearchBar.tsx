/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, HelpCircle, ArrowRight } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  suggestions?: string[];
  recentKey?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search database records...",
  onSearch,
  suggestions = [],
  recentKey = "recent-crm-searches"
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(recentKey);
    if (saved) {
      setRecent(JSON.parse(saved));
    }
  }, [recentKey]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    onSearch(val);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleSelectRecent = (val: string) => {
    setQuery(val);
    onSearch(val);
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      const updated = [query, ...recent.filter((r) => r !== query)].slice(0, 5);
      setRecent(updated);
      localStorage.setItem(recentKey, JSON.stringify(updated));
      setIsFocused(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full z-20">
      <div
        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-300 bg-white dark:bg-slate-900/60
          ${isFocused ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md' : 'border-slate-200 dark:border-slate-800/80 hover:border-slate-350 dark:hover:border-slate-700/80'}`}
      >
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent border-0 outline-none text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
        />
        {query && (
          <button
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Suggestion Dropdown Panel */}
      {isFocused && (query || recent.length > 0 || suggestions.length > 0) && (
        <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl p-3 text-left space-y-3 z-30">
          
          {/* Recent Searches */}
          {!query && recent.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" /> Recent Searches
              </span>
              <div className="flex flex-wrap gap-1.5">
                {recent.map((rec) => (
                  <button
                    key={rec}
                    onClick={() => handleSelectRecent(rec)}
                    className="px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-100 dark:border-slate-850 text-[10px] font-bold text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
                  >
                    {rec}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Suggestions list */}
          {suggestions.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1">
                <HelpCircle className="w-3 h-3" /> Search Suggestions
              </span>
              <div className="space-y-1">
                {suggestions
                  .filter((s) => !query || s.toLowerCase().includes(query.toLowerCase()))
                  .slice(0, 4)
                  .map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSelectRecent(s)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 text-xs text-slate-700 dark:text-slate-350 transition-colors cursor-pointer text-left"
                    >
                      <span>{s}</span>
                      <ArrowRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
