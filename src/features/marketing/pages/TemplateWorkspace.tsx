/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { templateService } from '../services/template.service';
import { MarketingTemplate } from '../../../types/marketing';
import { TemplateCard } from '../components/TemplateCard';
import { 
  Sparkles, BookOpen, PlusCircle, Search, Filter, 
  Mail, MessageSquare, Phone, Trash2, Copy, FileText, HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function TemplateWorkspace() {
  const [templates, setTemplates] = useState<MarketingTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState<'All' | 'Email' | 'WhatsApp' | 'SMS'>('All');

  // Create Template modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'Email' as 'Email' | 'WhatsApp' | 'SMS',
    category: 'Marketing' as MarketingTemplate['category'],
    content: '',
    subject: '',
    variables: ['name']
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const list = await templateService.getTemplates();
      setTemplates(list);
    } catch (err) {
      toast.error('Failed to sync marketing templates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplate.name || !newTemplate.content) {
      toast.error('Template title and content copy are mandatory.');
      return;
    }
    try {
      await templateService.createTemplate(newTemplate);
      toast.success(`Template "${newTemplate.name}" added to Stored assets!`);
      setShowCreateModal(false);
      setNewTemplate({
        name: '',
        type: 'Email',
        category: 'Marketing',
        content: '',
        subject: '',
        variables: ['name']
      });
      loadData();
    } catch (err) {
      toast.error('Formulation failed.');
    }
  };

  const handleDuplicate = async (tpl: MarketingTemplate) => {
    try {
      await templateService.createTemplate({
        ...tpl,
        name: `${tpl.name} (Duplicate)`
      });
      toast.success('Template asset duplicated.');
      loadData();
    } catch (err) {
      toast.error('Failed to duplicate.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this template permanently from asset warehouse?')) return;
    try {
      await templateService.deleteTemplate(id);
      toast.success('Template purged.');
      loadData();
    } catch (err) {
      toast.error('Failed to delete template.');
    }
  };

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel = channelFilter === 'All' || t.type === channelFilter;
    return matchesSearch && matchesChannel;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 text-left">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> Stored Assets
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">
            Stored Templates Warehouse
          </h1>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5" /> Formulize Asset
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 max-w-3xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search templates content, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 bg-white p-1.5 rounded-xl border border-slate-200 px-3">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Channel Type:</span>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value as any)}
            className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none flex-1 cursor-pointer font-mono"
          >
            <option value="All">All Channels</option>
            <option value="Email">Email Templates</option>
            <option value="WhatsApp">WhatsApp Templates</option>
            <option value="SMS">SMS Templates</option>
          </select>
        </div>
      </div>

      {/* List Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 font-mono animate-pulse">Syncing assets directory...</div>
      ) : filteredTemplates.length === 0 ? (
        <div className="p-12 bg-white border border-slate-100 rounded-xl text-center space-y-3">
          <BookOpen className="w-8 h-8 text-slate-350 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No matching templates found</p>
          <p className="text-xs text-slate-400 font-normal font-mono">Create new assets to catalog copy variables.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {filteredTemplates.map(tpl => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              onPreview={() => { toast.info(`Variables: ${tpl.variables.join(', ')}\n\nContent:\n${tpl.content}`); }}
              onDuplicate={() => { handleDuplicate(tpl); }}
              onDelete={() => { handleDelete(tpl.id); }}
            />
          ))}
        </div>
      )}

      {/* FORMULATE ASSET MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-2xl text-left flex flex-col max-h-[90vh] overflow-hidden"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-150 mb-4">
              <h3 className="text-sm font-black font-mono uppercase tracking-wider text-slate-800">
                Formulize Template Asset
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Asset Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UPI SLA Failure alert"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans focus:outline-none focus:border-indigo-500 font-bold text-slate-850"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Channel Type</label>
                  <select
                    value={newTemplate.type}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-750 cursor-pointer"
                  >
                    <option value="Email">Email</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="SMS">SMS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Category Core</label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-750 cursor-pointer"
                  >
                    <option value="Marketing">Marketing (General)</option>
                    <option value="Transactional">Transactional (Billing/Alerts)</option>
                    <option value="Engagement">Engagement (Newsletter)</option>
                  </select>
                </div>
              </div>

              {newTemplate.type === 'Email' && (
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Subject Line</label>
                  <input
                    type="text"
                    placeholder="e.g. Action required on SLA status"
                    value={newTemplate.subject}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans focus:outline-none focus:border-indigo-500 font-semibold text-slate-800"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Template Content</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Body copy variables... Use {{name}} to represent dynamic recipient mapping."
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-500 text-slate-700 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
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
                  Save Asset
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
