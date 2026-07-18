/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audienceService } from '../services/audience.service';
import { Audience } from '../../../types/marketing';
import { AudienceCard } from '../components/AudienceCard';
import { 
  Sparkles, Users2, PlusCircle, Search, Filter, ShieldCheck, 
  Trash2, Database, HelpCircle, Key, GitMerge, FileText, Download
} from 'lucide-react';
import { toast } from 'sonner';

export default function AudienceWorkspace() {
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Create Segment Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSegment, setNewSegment] = useState({
    name: '',
    description: '',
    count: 1200,
    rules: [
      { field: 'Account Value', operator: 'Greater Than', value: '₹50,000' }
    ],
    source: 'CRM Database' as Audience['source']
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const list = await audienceService.getAudiences();
      setAudiences(list);
    } catch (err) {
      toast.error('Failed to sync audience segments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSegment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSegment.name) {
      toast.error('Segment title is required.');
      return;
    }
    try {
      await audienceService.createAudience({
        ...newSegment,
        status: 'Active'
      });
      toast.success(`Segment "${newSegment.name}" formulated with ${newSegment.count.toLocaleString()} matches!`);
      setShowCreateModal(false);
      setNewSegment({
        name: '',
        description: '',
        count: 1200,
        rules: [{ field: 'Account Value', operator: 'Greater Than', value: '₹50,000' }],
        source: 'CRM Database'
      });
      loadData();
    } catch (err) {
      toast.error('Failed to register audience segment.');
    }
  };

  const handleDeleteSegment = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this audience segment? Campaigns matching this segment will need remapping.')) return;
    try {
      await audienceService.deleteAudience(id);
      toast.success('Segment records purged.');
      loadData();
    } catch (err) {
      toast.error('Purge failure.');
    }
  };

  const handleRuleChange = (idx: number, key: 'field' | 'operator' | 'value', text: string) => {
    setNewSegment(prev => {
      const updatedRules = [...prev.rules];
      updatedRules[idx] = { ...updatedRules[idx], [key]: text };
      return { ...prev, rules: updatedRules };
    });
  };

  const handleAddRule = () => {
    setNewSegment(prev => ({
      ...prev,
      rules: [...prev.rules, { field: 'Country', operator: 'Equals', value: 'India' }]
    }));
  };

  const handleRemoveRule = (idx: number) => {
    setNewSegment(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== idx)
    }));
  };

  const filteredAudiences = audiences.filter(aud => 
    aud.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    aud.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    aud.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 text-left">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> Audience Directories
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">
            Target Segments & Cohorts
          </h1>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5" /> Compile Segment
        </button>
      </div>

      {/* Segment Search/Filters */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search segments, description markers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Grid of Segments */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 font-mono animate-pulse">Syncing segment lists...</div>
      ) : filteredAudiences.length === 0 ? (
        <div className="p-12 bg-white border border-slate-100 rounded-xl text-center space-y-3">
          <Users2 className="w-8 h-8 text-slate-355 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No segments formulated</p>
          <p className="text-xs text-slate-400 font-normal">Click "+ Compile Segment" to design your first customer segment filter ruleset.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {filteredAudiences.map(aud => (
            <AudienceCard
              key={aud.id}
              audience={aud}
              onDelete={() => handleDeleteSegment(aud.id)}
            />
          ))}
        </div>
      )}

      {/* COMPILE AUDIENCE SEGMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-left"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-150">
              <h3 className="text-sm font-black font-mono uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-indigo-500" />
                Compile Segment Ruleset
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateSegment} className="space-y-4 pt-4 overflow-y-auto flex-1 pr-1">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Segment Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High Value UPI Users"
                  value={newSegment.name}
                  onChange={(e) => setNewSegment(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans focus:outline-none focus:border-indigo-500 font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Source Database mapping</label>
                <select
                  value={newSegment.source}
                  onChange={(e) => setNewSegment(prev => ({ ...prev, source: e.target.value as any }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans focus:outline-none focus:border-indigo-500 font-semibold text-slate-750 cursor-pointer"
                >
                  <option value="CRM Database">Enterprise CRM Data</option>
                  <option value="Billing Service">Active Billing Records</option>
                  <option value="Marketing Form">Web capture Form entries</option>
                  <option value="External Import">Uploaded CSV File Stream</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Description Mapping</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Customers with value metrics exceeding limits"
                  value={newSegment.description}
                  onChange={(e) => setNewSegment(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-750"
                />
              </div>

              {/* Dynamic Filter rules blocks */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-mono font-black uppercase text-indigo-600 flex items-center">
                    <GitMerge className="w-3.5 h-3.5 mr-1" /> Dynamic Filters rules
                  </span>
                  <button
                    type="button"
                    onClick={handleAddRule}
                    className="text-[10px] text-indigo-600 font-black font-mono uppercase hover:underline"
                  >
                    + Add Rule
                  </button>
                </div>

                <div className="space-y-3.5">
                  {newSegment.rules.map((rule, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-3.5 rounded-lg border border-slate-150 relative">
                      {newSegment.rules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRule(idx)}
                          className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 text-[9px] font-black flex items-center justify-center border border-rose-200"
                        >
                          ✕
                        </button>
                      )}

                      <div>
                        <label className="block text-[8px] font-mono uppercase text-slate-400 mb-0.5">DB Field</label>
                        <select
                          value={rule.field}
                          onChange={(e) => handleRuleChange(idx, 'field', e.target.value)}
                          className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 cursor-pointer"
                        >
                          <option value="Account Value">Account Value</option>
                          <option value="Country">Country</option>
                          <option value="Last Active">Last Active</option>
                          <option value="SLA Tier">SLA Tier</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[8px] font-mono uppercase text-slate-400 mb-0.5">Operator</label>
                        <select
                          value={rule.operator}
                          onChange={(e) => handleRuleChange(idx, 'operator', e.target.value)}
                          className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 cursor-pointer"
                        >
                          <option value="Equals">Equals</option>
                          <option value="Greater Than">Greater Than</option>
                          <option value="Less Than">Less Than</option>
                          <option value="Contains">Contains</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[8px] font-mono uppercase text-slate-400 mb-0.5">Match Value</label>
                        <input
                          type="text"
                          required
                          value={rule.value}
                          onChange={(e) => handleRuleChange(idx, 'value', e.target.value)}
                          className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-750 font-mono"
                          placeholder="Match constant..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulated audience size calculator */}
              <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="block text-[9px] font-mono font-black uppercase text-emerald-700">Projected database size</span>
                    <span className="text-xs font-black font-mono text-emerald-800">1,242 verified matching contacts</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setNewSegment(prev => ({ ...prev, count: Math.floor(Math.random() * 8000) + 500 }));
                    toast.success('Dynamic index size recalibration complete.');
                  }}
                  className="px-2 py-1 bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-[9px] font-mono font-black uppercase rounded"
                >
                  Recalculate Size
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-650 text-xs font-bold uppercase font-mono rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase font-mono rounded-lg cursor-pointer"
                >
                  Confirm compilation
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
