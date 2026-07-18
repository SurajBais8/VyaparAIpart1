/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { contactService } from '../../services/contact.service';
import { DataTable } from '../../components/crm/DataTable';
import { SearchBar } from '../../components/crm/SearchBar';
import { Button } from '../../components/ui';
import { Plus, Search, Contact2, Star, Trash2, Mail, MessageSquare, Eye } from 'lucide-react';
import { toast } from 'sonner';

export const ContactsWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const list = await contactService.getContacts();
      setContacts(list);
      setFiltered(list);
    } catch (err) {
      toast.error('Failed to parse contacts directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFiltered(contacts);
      return;
    }
    const q = query.toLowerCase();
    setFiltered(
      contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      )
    );
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      render: (row: any) => (
        <span 
          onClick={() => navigate(`/crm/contacts/${row.id}`)}
          className="font-mono text-[10px] font-bold text-indigo-500 hover:underline cursor-pointer"
        >
          {row.id}
        </span>
      )
    },
    {
      key: 'name',
      label: 'Personnel Name',
      sortable: true,
      render: (row: any) => (
        <div 
          onClick={() => navigate(`/crm/contacts/${row.id}`)}
          className="flex flex-col text-left cursor-pointer group"
        >
          <span className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:underline">{row.name}</span>
          <span className="text-[10px] text-slate-400 font-mono font-bold">{row.role}</span>
        </div>
      )
    },
    {
      key: 'company',
      label: 'Company Association',
      sortable: true,
      render: (row: any) => <span className="font-semibold text-slate-700 dark:text-slate-350">{row.company}</span>
    },
    {
      key: 'email',
      label: 'Email ID',
      render: (row: any) => <span className="text-slate-550 font-medium">{row.email}</span>
    },
    {
      key: 'mobile',
      label: 'Mobile ID',
      render: (row: any) => <span className="text-slate-500 font-mono">+91 {row.mobile}</span>
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row: any) => (
        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border font-mono tracking-wider uppercase
          ${row.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' : 'bg-slate-500/10 text-slate-400 border-slate-500/10'}`}
        >
          {row.status}
        </span>
      )
    }
  ];

  const actions = [
    {
      label: 'View Full Profile',
      icon: <Eye className="w-3.5 h-3.5 text-indigo-500" />,
      onClick: (row: any) => navigate(`/crm/contacts/${row.id}`)
    },
    {
      label: 'Trigger Quick Email',
      icon: <Mail className="w-3.5 h-3.5 text-indigo-500" />,
      onClick: (row: any) => toast.success(`Composing mail to ${row.name}...`)
    },
    {
      label: 'Remove Contact',
      icon: <Trash2 className="w-3.5 h-3.5 text-rose-500" />,
      onClick: async (row: any) => {
        if (confirm(`Remove personnel ${row.name}?`)) {
          await contactService.deleteContact(row.id);
          toast.success(`Removed contact: ${row.name}`);
          fetchContacts();
        }
      }
    }
  ];

  return (
    <div className="space-y-5 text-left">
      
      {/* Title action row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <Contact2 className="w-5 h-5 text-indigo-500" /> Contacts Directory
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-light mt-0.5">
            Key personnel directory of external corporate entities, direct mail IDs, and mobile lines.
          </p>
        </div>

        <Button
          variant="primary"
          className="py-1.5 px-3 text-xs font-bold"
          onClick={() => toast.success('Personnel addition triggered.')}
        >
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </Button>
      </div>

      <SearchBar
        placeholder="Type name, company, email or active role..."
        onSearch={handleSearch}
        suggestions={['Amit Roy', 'Cognitive Solutions', 'Chief Technology Officer']}
      />

      {/* Grid Table rendering */}
      {loading ? (
        <div className="py-12 flex justify-center text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : filtered.length > 0 ? (
        <DataTable
          columns={columns}
          data={filtered}
          actions={actions}
        />
      ) : (
        <div className="p-12 text-center bg-white border rounded-2xl">
          <span className="text-xs text-slate-400">No personnel records found matching search filters.</span>
        </div>
      )}

    </div>
  );
};
