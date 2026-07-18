/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { campaignService } from '../services/campaign.service';
import { templateService } from '../services/template.service';
import { audienceService } from '../services/audience.service';
import { Campaign, MarketingTemplate, Audience } from '../../../types/marketing';
import { CampaignCard } from '../components/CampaignCard';
import { CampaignTimeline } from '../components/CampaignTimeline';
import { 
  Sparkles, PlusCircle, Search, Filter, Mail, MessageSquare, 
  Phone, Calendar, TrendingUp, DollarSign, ArrowLeft, Eye, 
  Trash2, Play, Pause, Archive, CheckCircle, FileText, Download,
  ChevronRight, ExternalLink, HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function CampaignWorkspace() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<MarketingTemplate[]>([]);
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'All' | 'Active' | 'Scheduled' | 'Draft' | 'Completed' | 'Archived'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState<'All' | 'Email' | 'WhatsApp' | 'SMS'>('All');
  
  // Selected Campaign for details
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [detailTab, setDetailTab] = useState<'Overview' | 'Audience' | 'Messages' | 'Analytics' | 'Timeline' | 'Notes' | 'AI Suggestions'>('Overview');

  // Bulk operation tracking
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Create Campaign modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'Email' as 'Email' | 'WhatsApp' | 'SMS',
    audience: '',
    channel: 'Email' as 'Email' | 'WhatsApp' | 'SMS',
    status: 'Draft' as Campaign['status'],
    startDate: '',
    endDate: '',
    budget: 0,
    description: '',
    subject: '',
    body: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const list = await campaignService.getCampaigns();
      const temps = await templateService.getTemplates();
      const auds = await audienceService.getAudiences();
      setCampaigns(list);
      setTemplates(temps);
      setAudiences(auds);
      
      // Auto-populate default audience for modal if any
      if (auds.length > 0 && !newCampaign.audience) {
        setNewCampaign(prev => ({ ...prev, audience: auds[0].name }));
      }
    } catch (err) {
      toast.error('Failed to sync campaigns.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectCampaign = (camp: Campaign) => {
    setSelectedCampaign(camp);
    setDetailTab('Overview');
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredCampaigns.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCampaigns.map(c => c.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  // Bulk operational controls
  const handleBulkStatusChange = async (status: Campaign['status']) => {
    if (selectedIds.length === 0) return;
    try {
      await campaignService.bulkUpdateStatus(selectedIds, status);
      toast.success(`Successfully transitioned ${selectedIds.length} campaigns to ${status}.`);
      setSelectedIds([]);
      loadData();
      if (selectedCampaign && selectedIds.includes(selectedCampaign.id)) {
        const refreshed = await campaignService.getCampaignById(selectedCampaign.id);
        setSelectedCampaign(refreshed);
      }
    } catch (err) {
      toast.error('Failed to complete status transition.');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} campaigns? This cannot be undone.`)) return;
    try {
      await campaignService.bulkDelete(selectedIds);
      toast.success(`Deleted ${selectedIds.length} campaign items.`);
      setSelectedIds([]);
      loadData();
      if (selectedCampaign && selectedIds.includes(selectedCampaign.id)) {
        setSelectedCampaign(null);
      }
    } catch (err) {
      toast.error('Failed to execute bulk deletion.');
    }
  };

  const handleBulkExport = () => {
    if (selectedIds.length === 0) {
      toast.error('No campaign listings selected for export.');
      return;
    }
    const filtered = campaigns.filter(c => selectedIds.includes(c.id));
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Name,Type,Audience,Status,StartDate,EndDate,Budget,Conversion"].join(",") + "\n"
      + filtered.map(c => `${c.id},"${c.name}",${c.type},"${c.audience}",${c.status},${c.startDate},${c.endDate},${c.budget},${c.conversion}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Campaigns_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Successfully compiled and exported raw CSV ledger.');
  };

  // Single entity actions
  const handleDeleteSingle = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await campaignService.deleteCampaign(id);
      toast.success('Campaign record purged.');
      loadData();
      if (selectedCampaign?.id === id) {
        setSelectedCampaign(null);
      }
    } catch (err) {
      toast.error('Purge failure.');
    }
  };

  // Creation action
  const handleCreateCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.name) {
      toast.error('Campaign title is mandatory.');
      return;
    }
    try {
      const created = await campaignService.createCampaign({
        ...newCampaign,
        sentCount: newCampaign.status === 'Active' ? 1200 : 0,
        leadsCount: newCampaign.status === 'Active' ? 15 : 0,
        conversion: newCampaign.status === 'Active' ? 2.5 : 0
      });
      toast.success(`Campaign "${created.name}" formulated successfully!`);
      setShowCreateModal(false);
      // reset
      setNewCampaign({
        name: '',
        type: 'Email',
        audience: audiences[0]?.name || 'All Active Customers',
        channel: 'Email',
        status: 'Draft',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        budget: 15000,
        description: '',
        subject: '',
        body: ''
      });
      loadData();
    } catch (err) {
      toast.error('Formulation failed.');
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const matched = templates.find(t => t.id === templateId);
    if (matched) {
      setNewCampaign(prev => ({
        ...prev,
        subject: matched.subject || '',
        body: matched.content
      }));
      toast.success(`Imported variables from Stored Template: "${matched.name}"`);
    }
  };

  // Search & tab filters
  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.audience.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = selectedTab === 'All' || c.status === selectedTab;
    const matchesChannel = channelFilter === 'All' || c.type === channelFilter;

    return matchesSearch && matchesTab && matchesChannel;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 text-left">
      <AnimatePresence mode="wait">
        {!selectedCampaign ? (
          // MAIN LIST VIEW WITH TABLES & METRICS
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> Marketing Pipelines
                </span>
                <h1 className="text-2xl font-black tracking-tight text-slate-800">
                  Campaign Management Control
                </h1>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-sm"
              >
                <PlusCircle className="w-4 h-4" /> Formulate Campaign
              </button>
            </div>

            {/* Filters bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search campaigns by name, audience ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Status Selector */}
              <div className="flex bg-white p-1 rounded-xl border border-slate-200 overflow-x-auto gap-0.5 scrollbar-thin">
                {(['All', 'Active', 'Scheduled', 'Draft', 'Completed', 'Archived'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-wider rounded-lg whitespace-nowrap cursor-pointer flex-1 ${
                      selectedTab === tab ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Channel Filter */}
              <div className="flex items-center space-x-2 bg-white p-1.5 rounded-xl border border-slate-200 px-3">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Channel:</span>
                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value as any)}
                  className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none flex-1 cursor-pointer"
                >
                  <option value="All">All Channels</option>
                  <option value="Email">Email Only</option>
                  <option value="WhatsApp">WhatsApp Only</option>
                  <option value="SMS">SMS Only</option>
                </select>
              </div>
            </div>

            {/* Bulk actions bar */}
            {selectedIds.length > 0 && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-3 bg-indigo-50 border border-indigo-150 rounded-xl flex flex-wrap items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 bg-indigo-600 rounded-full" />
                  <p className="text-xs font-mono font-bold text-indigo-700">
                    {selectedIds.length} campaigns selected
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => handleBulkStatusChange('Active')}
                    className="px-2.5 py-1 bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200 text-[10px] font-mono font-bold uppercase rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3" /> Start
                  </button>
                  <button
                    onClick={() => handleBulkStatusChange('Draft')}
                    className="px-2.5 py-1 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-[10px] font-mono font-bold uppercase rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Pause className="w-3 h-3" /> Pause
                  </button>
                  <button
                    onClick={() => handleBulkStatusChange('Archived')}
                    className="px-2.5 py-1 bg-white text-amber-700 hover:bg-amber-50 border border-amber-200 text-[10px] font-mono font-bold uppercase rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Archive className="w-3 h-3" /> Archive
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-2.5 py-1 bg-white text-rose-700 hover:bg-rose-50 border border-rose-200 text-[10px] font-mono font-bold uppercase rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                  <div className="w-px h-4 bg-indigo-200 mx-1" />
                  <button
                    onClick={handleBulkExport}
                    className="px-2.5 py-1 bg-indigo-600 text-white hover:bg-indigo-700 text-[10px] font-mono font-bold uppercase rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" /> Export CSV
                  </button>
                </div>
              </motion.div>
            )}

            {/* Campaign List Grid & Table */}
            {loading ? (
              <div className="p-12 text-center text-slate-400 font-mono text-xs animate-pulse">
                Synchronizing live campaign registries...
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="p-12 bg-white border border-slate-100 rounded-xl text-center space-y-3">
                <HelpCircle className="w-8 h-8 text-slate-350 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No matching campaigns found</p>
                <p className="text-xs text-slate-400 font-normal">Formulate a new campaign or modify search parameters.</p>
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        <th className="py-3.5 px-4 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.length === filteredCampaigns.length && filteredCampaigns.length > 0}
                            onChange={handleToggleSelectAll}
                            className="cursor-pointer rounded"
                          />
                        </th>
                        <th className="py-3.5 px-4">Campaign Name</th>
                        <th className="py-3.5 px-4">Type</th>
                        <th className="py-3.5 px-4">Audience</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Time Window</th>
                        <th className="py-3.5 px-4 text-right">Budget</th>
                        <th className="py-3.5 px-4 text-right">Conversion</th>
                        <th className="py-3.5 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs">
                      {filteredCampaigns.map((camp) => {
                        const isChecked = selectedIds.includes(camp.id);
                        return (
                          <tr key={camp.id} className={`hover:bg-slate-50/50 transition-colors ${isChecked ? 'bg-indigo-50/10' : ''}`}>
                            <td className="py-3 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleSelectRow(camp.id)}
                                className="cursor-pointer rounded"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-800 hover:text-indigo-600 cursor-pointer flex items-center gap-1.5" onClick={() => handleSelectCampaign(camp)}>
                                {camp.name}
                                <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                              </div>
                              <span className="text-[10px] font-mono text-slate-400">{camp.id}</span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-1.5">
                                {camp.type === 'Email' ? <Mail className="w-3.5 h-3.5 text-indigo-500" /> : camp.type === 'WhatsApp' ? <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> : <Phone className="w-3.5 h-3.5 text-amber-500" />}
                                <span className="font-medium text-slate-600">{camp.type}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-600">{camp.audience}</td>
                            <td className="py-3 px-4">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                camp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                camp.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                camp.status === 'Draft' ? 'bg-slate-50 text-slate-550 border-slate-200' :
                                camp.status === 'Completed' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {camp.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                              {camp.startDate} to {camp.endDate}
                            </td>
                            <td className="py-3 px-4 text-right font-semibold font-mono text-slate-700">
                              ₹{camp.budget.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className="font-bold text-emerald-600 font-mono">{camp.conversion}%</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center space-x-1">
                                <button
                                  onClick={() => handleSelectCampaign(camp)}
                                  className="p-1 text-slate-400 hover:text-indigo-650 hover:bg-slate-100 rounded-md"
                                  title="Inspect details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSingle(camp.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-md"
                                  title="Purge record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          // CAMPAIGN DETAILS DRILLDOWN VIEW
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Details Back header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => { setSelectedCampaign(null); loadData(); }}
                  className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer"
                  title="Back to list"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-600" />
                </button>
                <div>
                  <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    Campaign Inspection Slot: {selectedCampaign.id}
                  </span>
                  <h1 className="text-xl font-black text-slate-800 flex items-center gap-2 mt-1">
                    {selectedCampaign.name}
                  </h1>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${
                  selectedCampaign.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  selectedCampaign.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  selectedCampaign.status === 'Draft' ? 'bg-slate-50 text-slate-550 border-slate-200' :
                  selectedCampaign.status === 'Completed' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                  'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  Current: {selectedCampaign.status}
                </span>
              </div>
            </div>

            {/* Tabs selector */}
            <div className="flex border-b border-slate-200 scrollbar-none overflow-x-auto">
              {(['Overview', 'Audience', 'Messages', 'Analytics', 'Timeline', 'Notes', 'AI Suggestions'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setDetailTab(tab)}
                  className={`py-2.5 px-4 font-sans font-medium text-xs border-b-2 whitespace-nowrap cursor-pointer transition-all ${
                    detailTab === tab 
                      ? 'border-indigo-600 text-indigo-600 font-bold' 
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENT IMPLEMENTATION */}
            <div className="bg-white border border-slate-100 rounded-xl p-6 min-h-[350px]">
              {detailTab === 'Overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-indigo-600">Core Parameters</h3>
                    
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-mono">Description:</span>
                        <span className="text-slate-700 font-medium text-right max-w-xs">{selectedCampaign.description}</span>
                      </div>
                      <div className="flex justify-between text-xs pt-2.5 border-t border-slate-200/50">
                        <span className="text-slate-400 font-mono">Channel Core:</span>
                        <span className="text-slate-700 font-semibold">{selectedCampaign.type} Channel</span>
                      </div>
                      <div className="flex justify-between text-xs pt-2.5 border-t border-slate-200/50">
                        <span className="text-slate-400 font-mono">Target Segment:</span>
                        <span className="text-slate-700 font-semibold">{selectedCampaign.audience}</span>
                      </div>
                      <div className="flex justify-between text-xs pt-2.5 border-t border-slate-200/50">
                        <span className="text-slate-400 font-mono">Active Window:</span>
                        <span className="text-slate-700 font-semibold font-mono">{selectedCampaign.startDate} to {selectedCampaign.endDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-indigo-600">Financial Allocations</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
                        <p className="text-[10px] text-slate-400 font-mono uppercase">Budget Ceiling</p>
                        <h4 className="text-lg font-bold font-mono text-slate-800 mt-1">₹{selectedCampaign.budget.toLocaleString()}</h4>
                      </div>
                      <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
                        <p className="text-[10px] text-slate-400 font-mono uppercase">Direct ROI Ledger</p>
                        <h4 className="text-lg font-bold font-mono text-emerald-600 mt-1">₹{(selectedCampaign.revenue || 0).toLocaleString()}</h4>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                      <p className="text-xs text-indigo-850 leading-relaxed font-normal">
                        This campaign utilizes real-time tracking pixels to attribute qualified lead captures. Dynamic routing rules automatically process opt-out responses.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {detailTab === 'Audience' && (
                <div className="space-y-4 text-left">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-indigo-600">Target Cohort Analysis</h3>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 max-w-2xl">
                    <p className="text-sm font-semibold text-slate-700 mb-2">Segment Title: {selectedCampaign.audience}</p>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed font-normal">
                      The active segment is compiled from operational database triggers mapping specific account activity, country origin matrices, and contract parameters.
                    </p>
                    
                    <div className="bg-white p-3.5 rounded-lg border border-slate-150 text-xs space-y-2">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Estimated Audience Count:</span>
                        <span className="font-bold text-slate-800">{(selectedCampaign.sentCount || 15200).toLocaleString()} profiles</span>
                      </div>
                      <div className="flex justify-between font-mono pt-2 border-t border-slate-100">
                        <span className="text-slate-400">Opt-out Ratio:</span>
                        <span className="font-semibold text-rose-600">0.42% average</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {detailTab === 'Messages' && (
                <div className="space-y-4 text-left max-w-3xl">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-indigo-600">Formulated Message Template</h3>
                  
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <div className="bg-white p-4 border-b border-slate-200 space-y-1.5">
                      {selectedCampaign.subject && (
                        <p className="text-xs font-semibold text-slate-700 font-mono">
                          Subject: <span className="text-indigo-600 font-sans">{selectedCampaign.subject}</span>
                        </p>
                      )}
                      <p className="text-[10px] text-slate-400 font-mono uppercase">Channel format: {selectedCampaign.type}</p>
                    </div>

                    <div className="p-6 bg-white max-h-96 overflow-y-auto">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-xs whitespace-pre-wrap text-slate-700 leading-relaxed text-left">
                        {selectedCampaign.body || "No template content configured."}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {detailTab === 'Analytics' && (
                <div className="space-y-6 text-left">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-indigo-600">Funnel Metrics Tracker</h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-mono uppercase">Total Dispatched</p>
                      <h4 className="text-xl font-bold font-mono text-slate-800 mt-1">{selectedCampaign.sentCount.toLocaleString()}</h4>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-mono uppercase">Opens/Reads</p>
                      <h4 className="text-xl font-bold font-mono text-indigo-600 mt-1">{(selectedCampaign.openedCount || Math.round(selectedCampaign.sentCount * 0.55)).toLocaleString()}</h4>
                    </div>
                    <td className="hidden"></td>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-mono uppercase">Click CTRs</p>
                      <h4 className="text-xl font-bold font-mono text-blue-600 mt-1">{(selectedCampaign.clickedCount || Math.round(selectedCampaign.sentCount * 0.15)).toLocaleString()}</h4>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-mono uppercase">Leads Captured</p>
                      <h4 className="text-xl font-bold font-mono text-emerald-600 mt-1">{(selectedCampaign.leadsCount || 0).toLocaleString()}</h4>
                    </div>
                  </div>

                  <div className="p-4 border border-indigo-100 bg-indigo-50/20 rounded-xl max-w-xl">
                    <p className="text-xs text-indigo-850 leading-relaxed font-normal">
                      Conversion efficiency: <span className="font-bold font-mono text-indigo-600">{selectedCampaign.conversion}%</span> of dispatched logs converted to deep pipeline leads.
                    </p>
                  </div>
                </div>
              )}

              {detailTab === 'Timeline' && (
                <div className="text-left max-w-xl">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-indigo-600 mb-6">Execution Chronology</h3>
                  <CampaignTimeline />
                </div>
              )}

              {detailTab === 'Notes' && (
                <div className="space-y-4 text-left">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-indigo-600">Operational Log Notes</h3>
                  <textarea
                    className="w-full h-32 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans focus:outline-none focus:border-indigo-500"
                    placeholder="Enter custom validation markers or team annotations for this campaign..."
                    defaultValue="Reviewed by operations squad. Pre-blast checks complete. A/B testing on subject line showed improved CTR with emoji usage."
                  />
                  <button 
                    onClick={() => toast.success('Operational log updated.')}
                    className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold uppercase font-mono cursor-pointer"
                  >
                    Save Notes
                  </button>
                </div>
              )}

              {detailTab === 'AI Suggestions' && (
                <div className="space-y-4 text-left max-w-xl">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-indigo-600 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1.5 text-indigo-500 animate-pulse" />
                    Predictive AI Optimization recommendations
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-violet-50 border border-violet-100 rounded-xl text-xs text-slate-700 leading-relaxed">
                      <p className="font-bold text-violet-700 mb-1">A/B Content Optimizer Suggestion</p>
                      Your content contains dense technical phrasing. Replacing "Cognitive API architecture limits" with "Simplify your developer onboarding" will increase projected click ratios by ~8.5%.
                    </div>
                    <div className="p-4 bg-violet-50 border border-violet-100 rounded-xl text-xs text-slate-700 leading-relaxed">
                      <p className="font-bold text-violet-700 mb-1">Dispatch Synchronization Index</p>
                      The "Loyal Customers Tier-1" list logs are highly active on mornings. Recommend scheduling dispatches at exactly 10:15 AM on Tuesdays for premium engagement indices.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE CAMPAIGN MODAL FORMULATION */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Formulate New Campaign
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="space-y-4 pt-4 overflow-y-auto pr-1 flex-1 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Campaign Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UPI Autopay Promo"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans focus:outline-none focus:border-indigo-500 font-semibold text-slate-850"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Channel Type</label>
                  <select
                    value={newCampaign.type}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, type: e.target.value as any, channel: e.target.value as any }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans focus:outline-none focus:border-indigo-500 font-semibold text-slate-750 cursor-pointer"
                  >
                    <option value="Email">Email</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="SMS">SMS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Target Segment</label>
                  <select
                    value={newCampaign.audience}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, audience: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans focus:outline-none focus:border-indigo-500 font-semibold text-slate-750 cursor-pointer"
                  >
                    {audiences.map(aud => (
                      <option key={aud.id} value={aud.name}>{aud.name} ({aud.count} items)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Initial Status</label>
                  <select
                    value={newCampaign.status}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans focus:outline-none focus:border-indigo-500 font-semibold text-slate-750 cursor-pointer"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Active">Active</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newCampaign.startDate}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-500 font-semibold text-slate-750 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={newCampaign.endDate}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-500 font-semibold text-slate-750 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Budget Ceiling (₹)</label>
                  <input
                    type="number"
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, budget: Number(e.target.value) }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-500 font-semibold text-slate-750"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Clear out dormant cold Q2 leads"
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans focus:outline-none focus:border-indigo-500 text-slate-800"
                />
              </div>

              {/* Template Import Picker */}
              <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                <label className="block text-[10px] font-mono font-bold uppercase text-indigo-600 mb-1 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Import variables from Stored Templates
                </label>
                <select
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  defaultValue=""
                  className="w-full p-2 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="" disabled>-- Select a pre-built template --</option>
                  {templates.filter(t => t.type === newCampaign.type).map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
                  ))}
                </select>
              </div>

              {newCampaign.type === 'Email' && (
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Email Subject</label>
                  <input
                    type="text"
                    placeholder="Subject line"
                    value={newCampaign.subject}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans focus:outline-none focus:border-indigo-500 font-semibold text-slate-800"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Message Body Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write body copy here... Use {{name}} for dynamic template injection values."
                  value={newCampaign.body}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, body: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-500 text-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-650 text-xs font-black uppercase font-mono tracking-wider rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase font-mono tracking-wider rounded-lg cursor-pointer"
                >
                  Confirm Formulation
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
