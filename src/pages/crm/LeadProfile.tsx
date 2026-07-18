/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leadService } from '../../services/lead.service';
import { Card } from '../../components/ui';
import { Timeline } from '../../components/crm/Timeline';
import {
  ArrowLeft,
  Building2,
  Mail,
  User,
  Sparkles,
  Flame,
  Globe,
  Settings,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

export const LeadProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lead, setLead] = useState<any>(null);
  
  // Tab and Memo logs state
  const [activeTab, setActiveTab] = useState<'timeline' | 'notes' | 'followUps' | 'aiInsights' | 'documents'>('timeline');
  const [noteText, setNoteText] = useState('');
  const [notesList, setNotesList] = useState<any[]>([
    { id: '1', text: 'Stressed the importance of seamless local GST calculations.', time: '2 hours ago', author: 'Self' },
    { id: '2', text: 'Sent API overview and developer SDK playground links.', time: 'Yesterday', author: 'John Doe' }
  ]);

  const fetchLead = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await leadService.getLeadById(id);
      if (data) {
        setLead(data);
      } else {
        toast.error('Lead prospect not found.');
        navigate('/crm/leads');
      }
    } catch (err) {
      toast.error('Failed to locate lead profile index.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  const handleStageSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!lead) return;
    const nextStage = e.target.value;

    try {
      await leadService.updateLead(lead.id, { stage: nextStage });
      toast.success(`Pipeline shifted to "${nextStage}".`);
      fetchLead();
    } catch (err) {
      toast.error('Failed to update funnel stage.');
    }
  };

  const handleConvertLead = async () => {
    if (!lead) return;
    toast.loading('Converting lead prospect into signed Customer...', { id: 'conv' });

    setTimeout(() => {
      toast.success('Conversion Complete!', {
        id: 'conv',
        description: 'Customer record compiled and added to database ledger.'
      });
      navigate('/crm/customers');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="space-y-6 text-left animate-pulse">
        <div className="h-6 w-32 bg-slate-250 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-100 rounded-2xl" />
          <div className="lg:col-span-2 h-96 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="space-y-6 text-left">
      
      {/* Action row back */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/crm/leads')}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-widest block">Lead Prospect Evaluation</span>
            <h1 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono mt-0.5">
              {lead.name}
            </h1>
          </div>
        </div>

        <button
          onClick={handleConvertLead}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/10 cursor-pointer uppercase font-mono tracking-wide"
        >
          Convert into signed Customer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core details side */}
        <div className="space-y-6">
          <Card variant="glass" className="p-5 border border-slate-200/50 dark:border-slate-850 space-y-4">
            <div className="flex justify-between items-start gap-4">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg border text-[10px] font-black font-mono tracking-wide text-orange-600 bg-orange-500/10 border-orange-500/10">
                <Flame className="w-3 h-3" /> Score: {lead.score}
              </span>
              <span className="text-[10px] font-mono text-slate-400 font-bold">ID: {lead.id}</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-850 dark:text-slate-50">{lead.name}</h3>
              <span className="text-xs text-slate-500 font-light block font-sans">{lead.email}</span>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-850/60 space-y-2.5 text-xs text-slate-550 dark:text-slate-400 font-sans">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="font-semibold text-slate-700 dark:text-slate-350">{lead.company}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Source: {lead.source}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Assigned: {lead.owner || 'Unassigned'}</span>
              </div>
            </div>

            {/* Quick stage selector */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-850/60 text-xs">
              <label className="text-[10px] font-black text-slate-400 uppercase font-mono tracking-wider block mb-1">Set Funnel Stage</label>
              <select
                value={lead.stage}
                onChange={handleStageSelect}
                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-250 font-bold focus:outline-none"
              >
                {['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'].map((stg) => (
                  <option key={stg} value={stg}>{stg}</option>
                ))}
              </select>
            </div>
          </Card>

          {/* AI Suggestions checklist panel */}
          {lead.profile?.aiSuggestions && (
            <Card variant="glass" className="p-4 border border-indigo-500/10 bg-indigo-50/10 dark:bg-indigo-950/5 space-y-3 rounded-2xl">
              <span className="text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400 font-mono tracking-widest flex items-center gap-1 select-none">
                <Sparkles className="w-3.5 h-3.5" /> AI Recommended Next Steps
              </span>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-350 font-light font-sans">
                {lead.profile.aiSuggestions.map((sug: string, i: number) => (
                  <li key={i} className="flex gap-2 items-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Interaction history panel & tabs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex items-center gap-1 border border-slate-200/50 dark:border-slate-850 overflow-x-auto max-w-full no-scrollbar text-[11px] font-bold">
            {[
              { id: 'timeline', label: 'Timeline' },
              { id: 'notes', label: 'Notes' },
              { id: 'followUps', label: 'Follow-ups' },
              { id: 'aiInsights', label: 'AI Insights' },
              { id: 'documents', label: 'Documents' }
            ].map((tb) => (
              <button
                key={tb.id}
                onClick={() => setActiveTab(tb.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
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
            {/* Timeline Stream */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">Activities & Touchpoints Ledger</span>
                <Timeline
                  items={[
                    { type: 'call', title: 'Outgoing Call', desc: 'Discussed basic API compliance standards.', time: lead.lastContact, user: lead.owner },
                    { type: 'email', title: 'SMTP Proposal Sent', desc: 'Draft pricing structure delivered.', time: '3 days ago', user: lead.owner }
                  ]}
                />
              </div>
            )}

            {/* Notes Section */}
            {activeTab === 'notes' && (
              <div className="space-y-4 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">Lead Memo Logs</span>
                
                {/* Add Note Form */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!noteText.trim()) return;
                    setNotesList(prev => [{
                      id: Date.now().toString(),
                      text: noteText,
                      time: 'Just now',
                      author: 'Self'
                    }, ...prev]);
                    setNoteText('');
                    toast.success('Lead note added successfully!');
                  }}
                  className="flex gap-2"
                >
                  <input 
                    type="text" 
                    placeholder="Type an internal note on this client prospect..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="flex-grow text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 outline-none"
                  />
                  <button 
                    type="submit" 
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </form>

                <div className="space-y-3 pt-2">
                  {notesList.map((n) => (
                    <div key={n.id} className="p-3 bg-slate-50/20 dark:bg-slate-900/10 border border-slate-150 dark:border-slate-850/60 rounded-xl text-xs">
                      <p className="text-slate-750 dark:text-slate-350">{n.text}</p>
                      <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-850/30">
                        <span>By: {n.author}</span>
                        <span>{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Follow-ups Section */}
            {activeTab === 'followUps' && (
              <div className="space-y-4 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">Upcoming Touchpoint Schedule</span>
                
                <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-2 text-xs">
                  <Calendar className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-850 dark:text-slate-200 block">Next Interaction Schedule</span>
                    <p className="text-slate-450 mt-0.5 leading-relaxed">
                      Follow up via phone next Wednesday regarding the SaaS license proposal pricing terms.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-[9px] font-black uppercase text-slate-400 font-mono">Planned Touchpoints</span>
                  {[
                    { type: 'Call', desc: 'Call to review secondary custom integrations', date: 'Next Wednesday, 3:30 PM' },
                    { type: 'Email', desc: 'Deliver updated pilot team license details', date: 'In 2 days' }
                  ].map((f, i) => (
                    <div key={i} className="p-3 bg-white dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850/60 rounded-xl text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold block">{f.type}</span>
                        <span className="text-[10px] text-slate-450 font-light mt-0.5 block">{f.desc}</span>
                      </div>
                      <span className="font-mono text-[9px] text-indigo-500 font-bold">{f.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Insights Section */}
            {activeTab === 'aiInsights' && (
              <div className="space-y-4 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">AI Conversion & Pitch Indicators</span>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-center">
                    <span className="text-[9px] font-bold text-slate-450 uppercase block font-mono">Win Probability</span>
                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono block mt-1">78.4%</span>
                  </div>
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-center">
                    <span className="text-[9px] font-bold text-slate-450 uppercase block font-mono">Projected Annual Revenue</span>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono block mt-1">₹1,80,000</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50/20 dark:bg-slate-900/10 border border-slate-150 dark:border-slate-850/60 rounded-xl text-xs space-y-2">
                  <span className="font-bold text-slate-850 dark:text-slate-200 block flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" /> Pitch Trigger Playbook
                  </span>
                  <p className="text-slate-550 leading-relaxed font-light">
                    The prospect highlighted high compliance overhead issues. Focus the pitch on the automated IRN generator and local CGST/SGST ledger compliance features.
                  </p>
                </div>
              </div>
            )}

            {/* Documents Section */}
            {activeTab === 'documents' && (
              <div className="space-y-4 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">Prospect Shared Files</span>
                
                <div className="space-y-2.5">
                  {[
                    { name: 'Initial_API_Requirements_Draft.docx', size: '240 KB' },
                    { name: 'Pricing_Proposal_Corporate.pdf', size: '1.2 MB' }
                  ].map((doc, idx) => (
                    <div key={idx} className="p-3 bg-white dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850/60 rounded-xl text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold block">{doc.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono font-medium block">Size: {doc.size}</span>
                      </div>
                      <button 
                        onClick={() => toast.success(`Commencing secure download for "${doc.name}"`)}
                        className="text-indigo-600 hover:underline font-bold font-mono text-[10px] cursor-pointer"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

      </div>

    </div>
  );
};
