/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerService } from '../../services/customer.service';
import { Timeline } from '../../components/crm/Timeline';
import { Card } from '../../components/ui';

// Sub-components for expanded customer tabs
import { CustomerOrders } from './CustomerOrders';
import { CustomerInvoices } from './CustomerInvoices';
import { CustomerPayments } from './CustomerPayments';
import { CustomerDocuments } from './CustomerDocuments';
import { CustomerAISummary } from './CustomerAISummary';

import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  DollarSign,
  FileText,
  CreditCard,
  Notebook,
  Send,
  Star,
  Settings,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

export const CustomerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'invoices' | 'payments' | 'timeline' | 'documents' | 'activities' | 'aiSummary' | 'settings'>('timeline');
  const [newNote, setNewNote] = useState('');

  const fetchCustomer = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await customerService.getCustomerById(id);
      if (data) {
        setCustomer(data);
      } else {
        toast.error('Customer profile not found in active records.');
        navigate('/crm/customers');
      }
    } catch (err) {
      toast.error('Failed to resolve profile index.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !customer) return;

    const noteItem = {
      type: 'note',
      title: 'Manual Memo Logged',
      desc: newNote,
      time: 'Just now',
      user: 'John Doe'
    };

    const updatedProfile = {
      ...customer.profile,
      timeline: [noteItem, ...(customer.profile.timeline || [])]
    };

    try {
      await customerService.updateCustomer(customer.id, { profile: updatedProfile });
      toast.success('Memo logged successfully.');
      setNewNote('');
      fetchCustomer();
    } catch (err) {
      toast.error('Failed to log memo.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 text-left">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse" />
          <div className="lg:col-span-2 h-96 bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="space-y-6 text-left">
      
      {/* Back to list and header action row */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/crm/customers')}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-widest block">Customer Ledger Profile</span>
          <h1 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono mt-0.5">
            {customer.name}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Core Info Details Card */}
        <div className="space-y-6">
          <Card variant="glass" className="p-5 border border-slate-200/50 dark:border-slate-850 space-y-5">
            <div className="flex justify-between items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                {customer.avatar || 'C'}
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono border uppercase tracking-wider
                ${customer.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' : 'bg-slate-500/10 text-slate-400 border-slate-500/10'}`}
              >
                {customer.status}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-850 dark:text-slate-50 flex items-center gap-1.5">
                <span>{customer.name}</span>
                {customer.tags?.includes('Premium') && <Star className="w-4 h-4 fill-amber-400 text-amber-400" />}
              </h3>
              <span className="text-[10px] text-slate-400 font-mono font-bold block">ID: {customer.id}</span>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-850/60 text-xs text-slate-550 dark:text-slate-400 font-sans">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="font-semibold text-slate-700 dark:text-slate-350">{customer.company}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>+91 {customer.mobile}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0 truncate" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>{customer.city}, {customer.state}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-850/60 flex justify-between text-[11px] font-mono font-bold">
              <div>
                <span className="text-slate-400 block uppercase">Total Purchase</span>
                <span className="text-indigo-600 dark:text-indigo-400 text-xs mt-0.5 block">₹{customer.totalPurchase?.toLocaleString()}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block uppercase">Outstanding</span>
                <span className={`text-xs mt-0.5 block ${customer.outstandingAmount > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                  ₹{customer.outstandingAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* AI insights Summary panel */}
          {customer.profile?.aiSummary && (
            <Card variant="glass" className="p-4 border border-indigo-500/10 bg-indigo-50/10 dark:bg-indigo-950/5 space-y-2 rounded-2xl">
              <span className="text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400 font-mono tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Client Sentiment Insight
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-light font-sans">
                {customer.profile.aiSummary}
              </p>
            </Card>
          )}
        </div>

        {/* Right Side: Tab panel view list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex items-center gap-1 border border-slate-200/50 dark:border-slate-850 overflow-x-auto max-w-full no-scrollbar text-[11px] font-bold">
            {([
              { id: 'timeline', label: 'Timeline' },
              { id: 'orders', label: 'Orders' },
              { id: 'invoices', label: 'Invoices' },
              { id: 'payments', label: 'Payments' },
              { id: 'documents', label: 'Documents' },
              { id: 'activities', label: 'Activities' },
              { id: 'aiSummary', label: 'AI Summary' },
              { id: 'settings', label: 'Settings' }
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-3xs font-extrabold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Card variant="glass" className="p-5 border border-slate-200/50 dark:border-slate-850/60 rounded-2xl">
            
            {/* Timeline Stream */}
            {activeTab === 'timeline' && (
              <div className="space-y-6">
                
                {/* Note Logger Form */}
                <form onSubmit={handleAddNote} className="flex gap-3">
                  <div className="flex-grow">
                    <input
                      type="text"
                      placeholder="Add an internal audit memo note on this profile..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <Timeline items={customer.profile?.timeline || []} />
              </div>
            )}

            {/* Orders Subcomponent */}
            {activeTab === 'orders' && (
              <CustomerOrders customerId={customer.id} />
            )}

            {/* Invoices Subcomponent */}
            {activeTab === 'invoices' && (
              <CustomerInvoices customerId={customer.id} />
            )}

            {/* Payments Subcomponent */}
            {activeTab === 'payments' && (
              <CustomerPayments customerId={customer.id} outstandingAmount={customer.outstandingAmount} />
            )}

            {/* Documents Subcomponent */}
            {activeTab === 'documents' && (
              <CustomerDocuments customerId={customer.id} />
            )}

            {/* Activities Stream View */}
            {activeTab === 'activities' && (
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">Operational Activities Log</span>
                <div className="space-y-3.5">
                  {[
                    { title: 'Contract Renewal Completed', desc: 'SaaS SLA agreement successfully signed off for Year 2026.', user: 'Jane Smith', date: 'Yesterday' },
                    { title: 'Dunning Alert Bypassed', desc: 'Outstanding fee warning deferred by finance manager.', user: 'John Doe', date: '3 days ago' },
                    { title: 'Onboarding Training Walkthrough', desc: 'Delivered customized console tutorials to their core development team.', user: 'John Doe', date: '5 days ago' }
                  ].map((act, idx) => (
                    <div key={idx} className="p-3 bg-white dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850/60 rounded-xl text-xs text-left flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-800 dark:text-slate-100 block flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-indigo-500" />
                          {act.title}
                        </span>
                        <p className="text-slate-500 dark:text-slate-450">{act.desc}</p>
                        <span className="text-[9px] text-slate-400 block font-mono">Logged by: {act.user}</span>
                      </div>
                      <span className="font-mono text-[9px] text-slate-400 shrink-0">{act.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Summary Subcomponent */}
            {activeTab === 'aiSummary' && (
              <CustomerAISummary customer={customer} />
            )}

            {/* Settings View */}
            {activeTab === 'settings' && (
              <div className="space-y-5 text-left">
                <div>
                  <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Settings className="w-4 h-4 text-slate-450" /> Client Profile Control
                  </h3>
                  <p className="text-[10px] text-slate-400 font-light mt-0.5">
                    Configure priority alert states, custom billing schedules, and ledger access conditions.
                  </p>
                </div>

                <div className="space-y-3.5 pt-2">
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-950/30 border border-slate-150 dark:border-slate-850/60 rounded-xl text-xs">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">Mark as Premium VIP Clientele</span>
                      <span className="text-[9px] text-slate-400 block font-light">Enables custom support lines and SLA priority guarantees.</span>
                    </div>
                    <button 
                      onClick={() => toast.success('Client marked as VIP Premium!')}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[9px] font-bold uppercase rounded-lg cursor-pointer"
                    >
                      Enable
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-950/30 border border-slate-150 dark:border-slate-850/60 rounded-xl text-xs">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">Dunning Auto-Suspension Toggles</span>
                      <span className="text-[9px] text-slate-400 block font-light">Automatically suspends accounts on late outstanding payments.</span>
                    </div>
                    <button 
                      onClick={() => toast.success('Auto-suspension dunning thresholds updated!')}
                      className="px-3 py-1 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-mono text-[9px] font-bold uppercase rounded-lg cursor-pointer text-slate-700 dark:text-slate-300"
                    >
                      Configure
                    </button>
                  </div>
                </div>
              </div>
            )}

          </Card>
        </div>

      </div>

    </div>
  );
};
