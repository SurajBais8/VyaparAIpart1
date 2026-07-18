/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dealService } from '../../services/deal.service';
import { Card } from '../../components/ui';
import { Timeline } from '../../components/crm/Timeline';
import { 
  ArrowLeft, 
  Coins, 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  Trash2, 
  Briefcase, 
  User, 
  ShoppingBag, 
  FileText, 
  Plus, 
  Download, 
  Save, 
  Edit2, 
  Activity, 
  Compass, 
  Gauge, 
  Lightbulb, 
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

export const DealProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [deal, setDeal] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'products' | 'notes' | 'ai' | 'edit'>('overview');

  // Notes & Timeline logs
  const [noteText, setNoteText] = useState('');
  const [notesList, setNotesList] = useState<any[]>([
    { id: '1', text: 'Legal team has signed off on standard liability clauses.', time: '1 day ago', author: 'John Doe' },
    { id: '2', text: 'Offered 10% discount on slack integration addon to finalize deal.', time: '4 days ago', author: 'Jane Smith' }
  ]);

  // Documents
  const [documents, setDocuments] = useState<any[]>([
    { id: 'DOC-551', name: 'Master_Services_Agreement_SLA_V2.pdf', size: '1.8 MB', date: '2026-07-16' },
    { id: 'DOC-550', name: 'Pricing_Proposal_Telemetry_Wayne.xlsx', size: '480 KB', date: '2026-07-12' }
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    company: '',
    value: 0,
    stage: 'Prospect',
    probability: 50,
    expectedClosing: '',
    owner: '',
    status: 'active',
    notes: ''
  });

  const fetchDeal = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await dealService.getDealById(id);
      if (data) {
        setDeal(data);
        setEditForm({
          name: data.name || '',
          company: data.company || '',
          value: data.value || 0,
          stage: data.stage || 'Prospect',
          probability: data.probability || 50,
          expectedClosing: data.expectedClosing || '',
          owner: data.owner || '',
          status: data.status || 'active',
          notes: data.notes || ''
        });
      } else {
        toast.error('Deal opportunity not found.');
        navigate('/crm/deals');
      }
    } catch (err) {
      toast.error('Failed to load deal ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeal();
  }, [id]);

  const handleUpdateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      const updated = await dealService.updateDeal(id, editForm);
      if (updated) {
        setDeal(updated);
        toast.success('Deal ledger adjustments saved!');
        setActiveTab('overview');
      }
    } catch (err) {
      toast.error('Failed to adjust deal properties.');
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    const note = {
      id: Date.now().toString(),
      text: noteText,
      time: 'Just now',
      author: 'Self'
    };
    setNotesList([note, ...notesList]);
    setNoteText('');
    toast.success('Internal deal memo logged.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      const doc = {
        id: `DOC-${Math.floor(Math.random() * 900 + 100)}`,
        name: file.name,
        size: sizeStr,
        date: new Date().toISOString().split('T')[0]
      };
      setDocuments([doc, ...documents]);
      toast.success(`Attached document "${file.name}" to deal room!`);
    }
  };

  if (loading || !deal) {
    return (
      <div className="space-y-6 text-left p-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-100 dark:bg-slate-900 rounded-2xl" />
          <div className="lg:col-span-2 h-96 bg-slate-100 dark:bg-slate-900 rounded-2xl" />
        </div>
      </div>
    );
  }

  const getProbabilityColor = (p: number) => {
    if (p >= 80) return 'bg-emerald-500';
    if (p >= 50) return 'bg-amber-500';
    return 'bg-indigo-500';
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/crm/deals')}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono">
                {deal.name}
              </h1>
              <span className={`px-2 py-0.5 rounded text-[9px] font-black font-mono tracking-wider uppercase border
                ${deal.status === 'won' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' : 
                  deal.status === 'lost' ? 'bg-rose-500/10 text-rose-600 border-rose-500/10' : 
                  'bg-indigo-500/10 text-indigo-600 border-indigo-500/10'}`}
              >
                {deal.stage}
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-light mt-0.5">
              Associated Company: {deal.company} • Owner: {deal.owner}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('edit')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold font-mono uppercase bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-indigo-500" /> Adjust Deal
          </button>
          <button
            onClick={async () => {
              if (confirm('Permanently close out this deal ledger file?')) {
                await dealService.deleteDeal(deal.id);
                toast.success('Deal opportunity deleted.');
                navigate('/crm/deals');
              }
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold font-mono uppercase bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-xl cursor-pointer hover:bg-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deal financial snapshot card */}
        <div className="space-y-6">
          <Card variant="glass" className="p-5 border-slate-200/50 dark:border-slate-850 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-150/50 dark:border-slate-850/30 pb-3">
              <Coins className="w-4 h-4 text-indigo-500" />
              <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
                Deal Financial Snapshot
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl border border-slate-150/40 dark:border-slate-850/40 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Contract Value</span>
                <span className="text-2xl font-black text-emerald-600 font-mono">₹{deal.value.toLocaleString()}</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[10px] text-slate-400">
                  <span className="uppercase font-bold">Win Probability</span>
                  <span>{deal.probability}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${getProbabilityColor(deal.probability)}`} style={{ width: `${deal.probability}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 font-sans pt-1">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Expected Closing</span>
                  <span className="font-semibold text-slate-750 dark:text-slate-200 block mt-0.5">{deal.expectedClosing}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Stage Status</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 block mt-0.5 capitalize">{deal.stage}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-150/40 dark:border-slate-850/30 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Strategic Account Owner</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-[10px]">
                    {deal.owner?.charAt(0) || 'U'}
                  </div>
                  <span className="font-semibold text-slate-750 dark:text-slate-200">{deal.owner}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Panel and tabs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab buttons */}
          <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex items-center gap-1 border border-slate-200/50 dark:border-slate-850 overflow-x-auto max-w-full no-scrollbar text-[11px] font-bold">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'timeline', label: 'Deal Milestone logs' },
              { id: 'products', label: 'Included Products' },
              { id: 'notes', label: 'Memos & Documents' },
              { id: 'ai', label: 'AI Prediction & Pitch' }
            ].map((tb) => (
              <button
                key={tb.id}
                onClick={() => setActiveTab(tb.id as any)}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tb.id 
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-3xs font-extrabold' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tb.label}
              </button>
            ))}
          </div>

          <Card variant="glass" className="p-5 border border-slate-200/50 dark:border-slate-850/60 rounded-2xl">
            
            {/* Overview Detail Page */}
            {activeTab === 'overview' && (
              <div className="space-y-4 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">Deal Health Summary</span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl space-y-1">
                    <span className="text-[9px] font-bold text-slate-450 uppercase block font-mono">Weighted Forecast</span>
                    <span className="text-base font-black text-indigo-600 block font-mono">₹{(deal.value * (deal.probability / 100)).toLocaleString()}</span>
                    <span className="text-[8px] text-slate-400 font-sans block">Based on probability weighting</span>
                  </div>

                  <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-1">
                    <span className="text-[9px] font-bold text-slate-450 uppercase block font-mono">Associated Company</span>
                    <span className="text-xs font-black text-emerald-600 block truncate">{deal.company}</span>
                    <span className="text-[8px] text-slate-400 font-sans block">Client Profile Ledger mapped</span>
                  </div>

                  <div className="p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-1">
                    <span className="text-[9px] font-bold text-slate-450 uppercase block font-mono">Milestone Status</span>
                    <span className="text-xs font-black text-amber-600 block uppercase font-mono">{deal.stage}</span>
                    <span className="text-[8px] text-slate-400 font-sans block">SLA stage targets active</span>
                  </div>
                </div>

                {deal.notes && (
                  <div className="p-4 bg-slate-50/20 dark:bg-slate-900/10 border border-slate-150 dark:border-slate-850/30 rounded-xl text-xs space-y-2">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">Deal Context Details</h4>
                    <p className="text-slate-500 leading-relaxed font-light font-sans">
                      {deal.notes}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Milestone progression logs */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">Chronological Deal Event Registry</span>
                <Timeline
                  items={(deal.timeline || []).map((t: any) => ({
                    type: 'milestone',
                    title: t.event,
                    desc: `Event processed into deal room by account manager.`,
                    time: t.date,
                    user: t.author
                  }))}
                />
              </div>
            )}

            {/* Included SaaS licenses and products */}
            {activeTab === 'products' && (
              <div className="space-y-4 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">Contract Scope Products</span>
                
                <div className="space-y-2.5">
                  {(deal.products || ["Standard Enterprise Suite Service"]).map((p: string, i: number) => (
                    <div key={i} className="p-3 bg-white dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850/60 rounded-xl text-xs flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <ShoppingBag className="w-4 h-4 text-indigo-500" />
                        <div>
                          <span className="font-bold block text-slate-850 dark:text-slate-200">{p}</span>
                          <span className="text-[9px] text-slate-400 font-mono">SAC: 998311 (Software Service Bundle)</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono bg-emerald-500/10 text-emerald-600">
                        Active Scope
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => toast.success('Additional software product mapping added to catalog.')}
                  className="w-full py-2 border-2 border-dashed border-slate-250 dark:border-slate-800 hover:border-slate-400 text-slate-500 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase font-mono tracking-wider cursor-pointer"
                >
                  + Include catalog add-on product
                </button>
              </div>
            )}

            {/* Memos & Contract PDF documents */}
            {activeTab === 'notes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-left">
                
                {/* Notes Column */}
                <div className="space-y-4 border-r border-slate-150 dark:border-slate-850/40 pr-0 md:pr-6">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">Internal Memos</span>
                  
                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Type a deal progress note..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="flex-grow text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 outline-none"
                    />
                    <button type="submit" className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold font-mono text-[10px]">Add</button>
                  </form>

                  <div className="space-y-3 pt-2">
                    {notesList.map((n) => (
                      <div key={n.id} className="p-2.5 bg-slate-50/40 dark:bg-slate-900/20 border border-slate-150 dark:border-slate-850/40 rounded-xl">
                        <p className="text-slate-700 dark:text-slate-350">{n.text}</p>
                        <div className="flex justify-between text-[8px] text-slate-400 font-mono mt-1 pt-1 border-t border-slate-100 dark:border-slate-850/20">
                          <span>{n.author}</span>
                          <span>{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shared Documents Column */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Contract Files</span>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[9px] font-bold font-mono uppercase px-2 py-0.5 bg-indigo-500/10 text-indigo-600 rounded"
                    >
                      Upload
                    </button>
                    <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                  </div>

                  <div className="space-y-2.5">
                    {documents.map((doc) => (
                      <div key={doc.id} className="p-2.5 bg-white dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850/60 rounded-xl flex justify-between items-center">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <div className="truncate">
                            <span className="font-bold block truncate text-slate-800 dark:text-slate-200">{doc.name}</span>
                            <span className="text-[8px] text-slate-400 font-mono block">Size: {doc.size}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => toast.success(`Downloading "${doc.name}"...`)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-indigo-500"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* AI Win/Loss Predictions & Pitch Advice */}
            {activeTab === 'ai' && (
              <div className="space-y-5 text-left">
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-150/50 dark:border-slate-850/30">
                  <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                  <span className="text-[10px] font-black text-indigo-600 uppercase font-mono tracking-wider">AI Predictive Win Probability & Strategies</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl space-y-1">
                    <span className="text-[9px] uppercase font-bold text-indigo-600 block font-mono">Predictive Score</span>
                    <span className="text-2xl font-black text-indigo-600 block font-mono">84.6% Win Rate</span>
                    <p className="text-[9px] text-slate-450 pt-1 leading-relaxed">
                      Chances of closing are highly favorable. Wayne Enterprises telemetry requirements match 100% of our enterprise compliance certifications list.
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-1">
                    <span className="text-[9px] uppercase font-bold text-emerald-600 block font-mono">AI Next Best Action</span>
                    <span className="text-xs font-black text-emerald-600 block uppercase font-mono">Draft Master Service Agreement</span>
                    <p className="text-[9px] text-slate-450 pt-1 leading-relaxed">
                      Deliver the dynamic GSTIN compliance mapping configuration document. Speed-to-closing is forecast to decrease by 4.2 days if sent immediately.
                    </p>
                  </div>
                </div>

                <Card variant="glass" className="p-4 border-slate-200/50 dark:border-slate-850 bg-white/50 dark:bg-slate-950/20 rounded-xl space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 font-mono flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Executive Pitch Suggestions
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-slate-650 dark:text-slate-350 font-light">
                    <li>The buyer represents a highly secure offline environment. Pitch the local multi-node encryption addon.</li>
                    <li>Refer to our standard CGST @ 9% and SGST @ 9% dynamic invoice engine to satisfy their compliance division concerns.</li>
                    <li>Arrange an onboarding walk-through tutorial with Amit Roy.</li>
                  </ul>
                </Card>
              </div>
            )}

            {/* Edit Deal Form */}
            {activeTab === 'edit' && (
              <form onSubmit={handleUpdateDeal} className="space-y-4 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">Adjust Deal Attributes</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Opportunity Name</label>
                    <input 
                      type="text" 
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 text-slate-800 dark:text-slate-200"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Contract Value (INR)</label>
                    <input 
                      type="number" 
                      value={editForm.value}
                      onChange={(e) => setEditForm({...editForm, value: Number(e.target.value)})}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 text-slate-800 dark:text-slate-200"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Pipeline Stage</label>
                    <select 
                      value={editForm.stage}
                      onChange={(e) => setEditForm({...editForm, stage: e.target.value})}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 text-slate-800 dark:text-slate-200 font-mono"
                    >
                      <option value="Prospect">Prospect</option>
                      <option value="Qualification">Qualification</option>
                      <option value="Proposal">Proposal</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Won">Won</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Win Probability (%)</label>
                    <input 
                      type="number" 
                      min="0"
                      max="100"
                      value={editForm.probability}
                      onChange={(e) => setEditForm({...editForm, probability: Number(e.target.value)})}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 text-slate-800 dark:text-slate-200"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Expected Closing Date</label>
                    <input 
                      type="date" 
                      value={editForm.expectedClosing}
                      onChange={(e) => setEditForm({...editForm, expectedClosing: e.target.value})}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 text-slate-800 dark:text-slate-200 font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Deal Owner / Rep</label>
                    <input 
                      type="text" 
                      value={editForm.owner}
                      onChange={(e) => setEditForm({...editForm, owner: e.target.value})}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Deal Memo details</label>
                  <textarea 
                    value={editForm.notes}
                    onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                    rows={3}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 text-slate-800 dark:text-slate-200"
                  />
                </div>

                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[10px] font-bold uppercase rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save adjusted deal terms
                </button>
              </form>
            )}

          </Card>
        </div>

      </div>
    </div>
  );
};
