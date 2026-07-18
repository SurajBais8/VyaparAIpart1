/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadService } from '../../services/lead.service';
import { KanbanBoard } from '../../components/crm/KanbanBoard';
import { DataTable } from '../../components/crm/DataTable';
import { SearchBar } from '../../components/crm/SearchBar';
import { FilterPanel } from '../../components/crm/FilterPanel';
import { LeadCard } from '../../components/crm/LeadCard';
import { Button } from '../../components/ui';
import {
  LayoutGrid,
  List,
  Filter,
  Plus,
  ArrowRight,
  Flame,
  CheckSquare,
  Globe,
  Trash2,
  FolderOpen
} from 'lucide-react';
import { toast } from 'sonner';

export const LeadsWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Search/Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<any>({});

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const list = await leadService.getLeads();
      setLeads(list);
      applyFiltersAndSearch(list, searchQuery, activeFilters);
    } catch (err) {
      toast.error('Failed to load lead prospects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();

    window.addEventListener('crm-data-refresh', fetchLeads);
    return () => window.removeEventListener('crm-data-refresh', fetchLeads);
  }, []);

  const applyFiltersAndSearch = (list: any[], query: string, filters: any) => {
    let result = [...list];

    // Search query match
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)
      );
    }

    // Lead stage filter
    if (filters.leadStage) {
      result = result.filter((l) => l.stage?.toLowerCase() === filters.leadStage.toLowerCase() || l.stage === filters.leadStage);
    }

    setFiltered(result);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFiltersAndSearch(leads, query, activeFilters);
  };

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    applyFiltersAndSearch(leads, searchQuery, filters);
  };

  const handleResetFilters = () => {
    setActiveFilters({});
    applyFiltersAndSearch(leads, searchQuery, {});
  };

  const handleStageChange = async (itemId: string, newStage: string) => {
    const originalItem = leads.find(l => l.id === itemId);
    if (!originalItem) return;

    try {
      await leadService.updateLead(itemId, { stage: newStage });
      toast.success(`Promoted ${originalItem.name} to "${newStage}" stage.`);
      fetchLeads();
    } catch (err) {
      toast.error('Failed to shift lead stage.');
    }
  };

  // Define Kanban stages / columns
  const columns = [
    { id: 'New', title: 'New Capture', color: 'bg-indigo-500' },
    { id: 'Contacted', title: 'Contacted', color: 'bg-amber-500' },
    { id: 'Qualified', title: 'Qualified', color: 'bg-rose-500' },
    { id: 'Proposal', title: 'Proposal Sent', color: 'bg-violet-500' },
    { id: 'Negotiation', title: 'Negotiation', color: 'bg-teal-500' },
    { id: 'Won', title: 'Deals Won', color: 'bg-emerald-500' }
  ];

  // List view columns definition
  const listColumns = [
    {
      key: 'id',
      label: 'Lead ID',
      sortable: true,
      render: (row: any) => <span className="font-mono text-[10px] font-bold text-slate-400">{row.id}</span>
    },
    {
      key: 'name',
      label: 'Prospect Name',
      sortable: true,
      render: (row: any) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-slate-800 dark:text-slate-100">{row.name}</span>
          <span className="text-[10px] text-slate-450 font-light font-sans">{row.email}</span>
        </div>
      )
    },
    {
      key: 'company',
      label: 'Company Entity',
      sortable: true,
      render: (row: any) => <span className="font-semibold text-slate-700 dark:text-slate-350">{row.company}</span>
    },
    {
      key: 'source',
      label: 'Inbound channel',
      render: (row: any) => <span className="text-slate-500 flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {row.source}</span>
    },
    {
      key: 'score',
      label: 'Triage Score',
      sortable: true,
      render: (row: any) => (
        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg border text-[10px] font-bold font-mono text-orange-600 bg-orange-500/10 border-orange-500/10">
          <Flame className="w-3 h-3" /> {row.score}
        </span>
      )
    },
    {
      key: 'stage',
      label: 'Sales Stage',
      sortable: true,
      render: (row: any) => <span className="font-bold capitalize text-indigo-600 dark:text-indigo-400 font-mono">{row.stage}</span>
    }
  ];

  const listActions = [
    {
      label: 'Open Details profile',
      icon: <ArrowRight className="w-3.5 h-3.5" />,
      onClick: (row: any) => navigate(`/crm/leads/${row.id}`)
    },
    {
      label: 'Remove Lead',
      icon: <Trash2 className="w-3.5 h-3.5" />,
      variant: 'danger' as const,
      onClick: async (row: any) => {
        if (confirm(`Remove lead prospect ${row.name}?`)) {
          await leadService.deleteLead(row.id);
          toast.success(`Removed lead index: ${row.name}`);
          fetchLeads();
        }
      }
    }
  ];

  return (
    <div className="space-y-5 text-left">
      
      {/* Header title controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-indigo-500" /> Leads Pipeline Workspace
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-light mt-0.5">
            Group captured prospects, track pipeline deal probabilities, and qualify entries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle board vs table */}
          <div className="bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl flex items-center border border-slate-200/50 dark:border-slate-850">
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-lg cursor-pointer ${viewMode === 'board' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs' : 'text-slate-500'}`}
              title="Board View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg cursor-pointer ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs' : 'text-slate-500'}`}
              title="List Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            className="py-1.5 px-3 text-xs font-bold"
            onClick={() => window.dispatchEvent(new CustomEvent('crm-quick-add', { detail: 'lead' }))}
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </Button>
        </div>
      </div>

      {/* Advanced search panel row */}
      <div className="flex items-center gap-3">
        <SearchBar
          placeholder="Search prospects by name, company entity, or emails..."
          onSearch={handleSearch}
          suggestions={['Google Search', 'Inbound Web', 'Sneha Iyer']}
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

      {/* Advanced filters */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        type="leads"
      />

      {/* Dynamic Board view vs list view */}
      {loading ? (
        <div className="py-12 flex justify-center text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : viewMode === 'board' ? (
        <KanbanBoard
          columns={columns}
          items={filtered}
          onStageChange={handleStageChange}
          onItemClick={(item) => navigate(`/crm/leads/${item.id}`)}
          onAddItemClick={(stageId) => {
            window.dispatchEvent(new CustomEvent('crm-quick-add', { detail: 'lead' }));
          }}
          itemRender={(item) => (
            <LeadCard lead={item} onClick={() => navigate(`/crm/leads/${item.id}`)} />
          )}
        />
      ) : filtered.length > 0 ? (
        <DataTable
          columns={listColumns}
          data={filtered}
          onRowClick={(row) => navigate(`/crm/leads/${row.id}`)}
          actions={listActions}
        />
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-950 border rounded-2xl">
          <span className="text-xs text-slate-400">No prospects matching your filters found.</span>
        </div>
      )}

    </div>
  );
};
