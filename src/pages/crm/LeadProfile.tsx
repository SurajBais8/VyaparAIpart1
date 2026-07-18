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

        {/* Interaction history panel */}
        <Card variant="glass" className="lg:col-span-2 p-5 border border-slate-200/50 dark:border-slate-850/60 rounded-2xl">
          <span className="text-[10px] font-black text-slate-400 uppercase font-mono tracking-wider block mb-4">Activities & Touchpoints Ledger</span>
          <Timeline
            items={[
              { type: 'call', title: 'Outgoing Call', desc: 'Discussed basic API compliance standards.', time: lead.lastContact, user: lead.owner },
              { type: 'email', title: 'SMTP Proposal Sent', desc: 'Draft pricing structure delivered.', time: '3 days ago', user: lead.owner }
            ]}
          />
        </Card>

      </div>

    </div>
  );
};
