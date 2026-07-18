/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerService } from '../../services/customer.service';
import { DataTable } from '../../components/crm/DataTable';
import { FilterPanel } from '../../components/crm/FilterPanel';
import { SearchBar } from '../../components/crm/SearchBar';
import { ExportMenu } from '../../components/crm/ExportMenu';
import { ImportDialog } from '../../components/crm/ImportDialog';
import { Button } from '../../components/ui';
import {
  Plus,
  Filter,
  Download,
  Upload,
  Trash2,
  Mail,
  MessageSquare,
  Eye,
  Star,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

export const CustomersWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Search/Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<any>({});

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const list = await customerService.getCustomers();
      setCustomers(list);
      applyFiltersAndSearch(list, searchQuery, activeFilters);
    } catch (err) {
      toast.error('Failed to load customer list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();

    window.addEventListener('crm-data-refresh', fetchCustomers);
    return () => window.removeEventListener('crm-data-refresh', fetchCustomers);
  }, []);

  const applyFiltersAndSearch = (list: any[], query: string, filters: any) => {
    let result = [...list];

    // Search query match
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (filters.status) {
      result = result.filter((c) => c.status === filters.status);
    }

    // Location/City filter
    if (filters.city) {
      result = result.filter((c) => c.city === filters.city);
    }

    // Business model type filter
    if (filters.bizType) {
      result = result.filter((c) => c.tags?.includes(filters.bizType));
    }

    // Special tag filter
    if (filters.tag) {
      result = result.filter((c) => c.tags?.includes(filters.tag));
    }

    // Purchase range filters
    if (filters.minPurchase !== undefined) {
      result = result.filter((c) => c.totalPurchase >= filters.minPurchase);
    }
    if (filters.maxPurchase !== undefined) {
      result = result.filter((c) => c.totalPurchase <= filters.maxPurchase);
    }

    setFiltered(result);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFiltersAndSearch(customers, query, activeFilters);
  };

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    applyFiltersAndSearch(customers, searchQuery, filters);
  };

  const handleResetFilters = () => {
    setActiveFilters({});
    applyFiltersAndSearch(customers, searchQuery, {});
  };

  // DataTable columns definition
  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      render: (row: any) => <span className="font-mono text-[10px] font-bold text-slate-400">{row.id}</span>
    },
    {
      key: 'name',
      label: 'Customer Name',
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center gap-2 text-left">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs flex-shrink-0">
            {row.avatar || 'C'}
          </div>
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
              {row.name}
              {row.tags?.includes('Premium') && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
            </span>
            <span className="text-[10px] text-slate-450 block font-light">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'company',
      label: 'Corporate entity',
      sortable: true,
      render: (row: any) => <span className="font-semibold text-slate-700 dark:text-slate-350">{row.company}</span>
    },
    {
      key: 'city',
      label: 'Location',
      render: (row: any) => <span className="text-slate-500 font-medium">{row.city}, {row.state}</span>
    },
    {
      key: 'totalPurchase',
      label: 'Acquisitions (INR)',
      sortable: true,
      render: (row: any) => <span className="font-extrabold text-slate-800 dark:text-slate-200 font-mono">₹{row.totalPurchase.toLocaleString()}</span>
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row: any) => (
        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border font-mono tracking-wider uppercase
          ${row.status === 'Active'
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10'
            : 'bg-slate-500/10 text-slate-400 dark:text-slate-500 border-slate-500/10'}`}
        >
          {row.status}
        </span>
      )
    }
  ];

  // Action Menu Handlers
  const actions = [
    {
      label: 'View Profile details',
      icon: <Eye className="w-3.5 h-3.5 text-indigo-500" />,
      onClick: (row: any) => navigate(`/crm/customers/${row.id}`)
    },
    {
      label: 'Delete Record',
      icon: <Trash2 className="w-3.5 h-3.5" />,
      variant: 'danger' as const,
      onClick: async (row: any) => {
        if (confirm(`Are you sure you want to permanently delete customer ${row.name}?`)) {
          await customerService.deleteCustomer(row.id);
          toast.success(`Removed customer profile: ${row.name}`);
          fetchCustomers();
        }
      }
    }
  ];

  // Bulk Actions Handlers
  const bulkActions = [
    {
      label: 'Delete Profiles',
      icon: <Trash2 className="w-3.5 h-3.5 text-rose-500" />,
      onClick: async (selectedRows: any[]) => {
        if (confirm(`Bulk delete ${selectedRows.length} customer records?`)) {
          await customerService.bulkDelete(selectedRows.map((r) => r.id));
          toast.success(`Deleted ${selectedRows.length} customer records.`);
          fetchCustomers();
        }
      }
    },
    {
      label: 'Trigger Bulk Email',
      icon: <Mail className="w-3.5 h-3.5 text-indigo-500" />,
      onClick: (selectedRows: any[]) => {
        toast.success(`Broadcasting SMTP campaign to ${selectedRows.length} profiles!`, {
          description: 'Queued in MailGun.'
        });
      }
    },
    {
      label: 'Broadcast WhatsApp',
      icon: <MessageSquare className="w-3.5 h-3.5 text-teal-500" />,
      onClick: (selectedRows: any[]) => {
        toast.success(`Broadcasting Whatsapp templates to ${selectedRows.length} verified mobile IDs!`);
      }
    }
  ];

  const handleImportSuccess = () => {
    fetchCustomers();
  };

  return (
    <div className="space-y-5 text-left">
      
      {/* Header controls layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" /> Customers Directory
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-light mt-0.5">
            Database of all clients, purchase volumes, regional codes, and active metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="py-1.5 px-3 text-xs font-bold"
            onClick={() => setIsImportOpen(true)}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </Button>

          <ExportMenu reportType="Customers Directory Ledger" />

          <Button
            variant="primary"
            className="py-1.5 px-3 text-xs font-bold"
            onClick={() => window.dispatchEvent(new CustomEvent('crm-quick-add', { detail: 'customer' }))}
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </Button>
        </div>
      </div>

      {/* Advanced search bar row */}
      <div className="flex items-center gap-3">
        <SearchBar
          placeholder="Type an ID, corporate title, email or active tags..."
          onSearch={handleSearch}
          suggestions={['Premium', 'Mumbai', 'Active', 'TechVantage Labs']}
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

      {/* Filter panel collapse block */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        type="customers"
      />

      {/* Data Table */}
      {loading ? (
        <div className="py-12 flex justify-center text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : filtered.length > 0 ? (
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(row) => navigate(`/crm/customers/${row.id}`)}
          actions={actions}
          bulkActions={bulkActions}
        />
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-950 border rounded-2xl">
          <span className="text-xs text-slate-400">No customers found matching active search filters.</span>
        </div>
      )}

      {/* Bulk spreadsheet dialog */}
      <ImportDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportComplete={handleImportSuccess}
        dataType="Customer"
      />

    </div>
  );
};
