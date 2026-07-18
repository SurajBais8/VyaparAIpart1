/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyService } from '../../services/company.service';
import { CompanyCard } from '../../components/crm/CompanyCard';
import { SearchBar } from '../../components/crm/SearchBar';
import { FilterPanel } from '../../components/crm/FilterPanel';
import { Button } from '../../components/ui';
import { Plus, Filter, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export const CompaniesWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Search/Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<any>({});

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const list = await companyService.getCompanies();
      setCompanies(list);
      applyFiltersAndSearch(list, searchQuery, activeFilters);
    } catch (err) {
      toast.error('Failed to load corporate companies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const applyFiltersAndSearch = (list: any[], query: string, filters: any) => {
    let result = [...list];

    // Search query match
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }

    // Industry filter
    if (filters.industry) {
      result = result.filter((c) => c.industry === filters.industry);
    }

    setFiltered(result);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFiltersAndSearch(companies, query, activeFilters);
  };

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    applyFiltersAndSearch(companies, searchQuery, filters);
  };

  const handleResetFilters = () => {
    setActiveFilters({});
    applyFiltersAndSearch(companies, searchQuery, {});
  };

  return (
    <div className="space-y-5 text-left">
      
      {/* Title block row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-500" /> Companies Ledger
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-light mt-0.5">
            Directory of corporate organizations, their employee bands, industries, and overall account values.
          </p>
        </div>

        <Button
          variant="primary"
          className="py-1.5 px-3 text-xs font-bold"
          onClick={() => toast.success('Add Company feature loaded.')}
        >
          <Plus className="w-4 h-4" />
          <span>Add Company</span>
        </Button>
      </div>

      {/* Advanced filters */}
      <div className="flex items-center gap-3">
        <SearchBar
          placeholder="Type corporate name..."
          onSearch={handleSearch}
          suggestions={['TechVantage Labs', 'Cognitive Solutions', 'Delta Logistics']}
        />
        <Button
          variant={isFilterOpen ? 'primary' : 'outline'}
          className="py-2.5 px-4 text-xs font-bold shrink-0"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </Button>
      </div>

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        type="companies"
      />

      {/* Grid container layout */}
      {loading ? (
        <div className="py-12 flex justify-center text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onClick={() => navigate(`/crm/companies/${company.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border rounded-2xl">
          <span className="text-xs text-slate-400">No companies found matching search filters.</span>
        </div>
      )}

    </div>
  );
};
