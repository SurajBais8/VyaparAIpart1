import React from 'react';
import { Search, Filter } from 'lucide-react';

interface AnalyticsFilterProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  categories: string[];
}

export const AnalyticsFilter: React.FC<AnalyticsFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-slate-950 p-4 border border-slate-150 dark:border-slate-850 rounded-2xl shadow-2xs">
      {/* Search Input */}
      <div className="relative sm:col-span-2">
        <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search records, tags, or IDs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 text-xs text-slate-800 dark:text-slate-200 outline-none"
        />
      </div>

      {/* Category select */}
      <div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-650 dark:text-slate-350 outline-none font-bold"
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
