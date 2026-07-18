/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dealService } from '../../services/deal.service';
import { Card } from '../../components/ui';
import { SearchBar } from '../../components/crm/SearchBar';
import { Button } from '../../components/ui';
import { Plus, Coins, TrendingUp, Sparkles, Calendar, Trash2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export const DealsWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const list = await dealService.getDeals();
      setDeals(list);
      setFiltered(list);
    } catch (err) {
      toast.error('Failed to parse opportunities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();

    window.addEventListener('crm-data-refresh', fetchDeals);
    return () => window.removeEventListener('crm-data-refresh', fetchDeals);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFiltered(deals);
      return;
    }
    const q = query.toLowerCase();
    setFiltered(
      deals.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.company.toLowerCase().includes(q) ||
          d.stage.toLowerCase().includes(q)
      )
    );
  };

  const handleDeleteDeal = async (id: string, name: string) => {
    if (confirm(`Remove deal "${name}" permanently?`)) {
      await dealService.deleteDeal(id);
      toast.success(`Removed deal option: ${name}`);
      fetchDeals();
    }
  };

  const getProbabilityColor = (p: number) => {
    if (p >= 80) return 'bg-emerald-500';
    if (p >= 50) return 'bg-amber-500';
    return 'bg-indigo-500';
  };

  const totalValue = filtered.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-5 text-left">
      
      {/* Title block action row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <Coins className="w-5 h-5 text-indigo-500" /> Active Deals Board
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-light mt-0.5">
            Evaluate win probabilities, forecasted closure values, and stage targets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block text-right">
            <span className="text-[9px] font-black uppercase text-slate-400 font-mono">Total Board Volume</span>
            <span className="text-sm font-black text-emerald-600 block font-mono">₹{totalValue.toLocaleString()}</span>
          </div>

          <Button
            variant="primary"
            className="py-1.5 px-3 text-xs font-bold"
            onClick={() => window.dispatchEvent(new CustomEvent('crm-quick-add', { detail: 'deal' }))}
          >
            <Plus className="w-4 h-4" />
            <span>Add Deal Opportunity</span>
          </Button>
        </div>
      </div>

      <SearchBar
        placeholder="Type a deal keyword, stage, or corporate company..."
        onSearch={handleSearch}
        suggestions={['Prospect', 'Proposal', 'SaaS Subscription']}
      />

      {/* Grid List cards representation */}
      {loading ? (
        <div className="py-12 flex justify-center text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((deal) => (
            <Card
              key={deal.id}
              variant="glass"
              className="p-5 border border-slate-200/50 dark:border-slate-850 hover:border-indigo-500/25 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer"
              onClick={() => navigate(`/crm/deals/${deal.id}`)}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="space-y-0.5 text-left">
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide font-mono truncate max-w-[170px] group-hover:text-indigo-650">{deal.name}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[170px] block">{deal.company}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteDeal(deal.id, deal.name);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Deal value & Probability bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">₹{deal.value.toLocaleString()}</span>
                  <span className="text-[10px] font-bold font-mono text-slate-450 uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" /> {deal.probability}% probability
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${getProbabilityColor(deal.probability)}`} style={{ width: `${deal.probability}%` }} />
                </div>
              </div>

              {/* Timeline footnote */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-850/60 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {deal.expectedClosing}</span>
                <span className="capitalize bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded font-extrabold text-slate-500">{deal.stage}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border rounded-2xl">
          <span className="text-xs text-slate-400">No deal pipeline entries found matching search filters.</span>
        </div>
      )}

    </div>
  );
};
