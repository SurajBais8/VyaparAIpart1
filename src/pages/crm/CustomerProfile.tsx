/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerService } from '../../services/customer.service';
import { Timeline } from '../../components/crm/Timeline';
import { Card } from '../../components/ui';
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
  Star
} from 'lucide-react';
import { toast } from 'sonner';

export const CustomerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'invoices' | 'payments' | 'documents'>('timeline');
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
          <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex items-center border border-slate-200/50 dark:border-slate-850 w-fit text-[11px] font-bold">
            {(['timeline', 'invoices', 'payments', 'documents'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg capitalize transition-all cursor-pointer ${activeTab === tab ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-3xs font-extrabold' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {tab}
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

            {/* Invoices Mock */}
            {activeTab === 'invoices' && (
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">Billed Invoice Logs</span>
                <div className="divide-y divide-slate-100 dark:divide-slate-900 space-y-3">
                  {(customer.profile?.invoices || []).map((inv: any) => (
                    <div key={inv.id} className="flex justify-between items-center py-2.5 text-xs">
                      <div className="text-left space-y-0.5">
                        <span className="font-bold text-slate-750 dark:text-slate-250 block font-mono">{inv.id}</span>
                        <span className="text-[10px] text-slate-400 font-light block">Billed: {inv.date}</span>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="font-extrabold text-slate-800 dark:text-slate-100 font-mono">₹{inv.amount.toLocaleString()}</span>
                        <span className={`block px-1.5 py-0.5 rounded text-[9px] font-bold font-mono tracking-wide uppercase border
                          ${inv.status === 'Paid'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10'
                            : 'bg-rose-500/10 text-rose-600 border-rose-500/10'}`}
                        >
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!customer.profile?.invoices || customer.profile.invoices.length === 0) && (
                    <p className="text-xs text-slate-400 italic py-6">No invoices created for this profile.</p>
                  )}
                </div>
              </div>
            )}

            {/* Payments Mock */}
            {activeTab === 'payments' && (
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">Settlement Inflow Records</span>
                <div className="divide-y divide-slate-100 dark:divide-slate-900 space-y-3">
                  {(customer.profile?.payments || []).map((pay: any) => (
                    <div key={pay.id} className="flex justify-between items-center py-2.5 text-xs">
                      <div className="text-left space-y-0.5">
                        <span className="font-bold text-slate-750 dark:text-slate-250 block font-mono">{pay.id}</span>
                        <span className="text-[10px] text-slate-450 block font-medium">Method: {pay.method} ({pay.date})</span>
                      </div>
                      <span className="font-extrabold text-emerald-600 font-mono">₹{pay.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  {(!customer.profile?.payments || customer.profile.payments.length === 0) && (
                    <p className="text-xs text-slate-400 italic py-6">No payments captured for this profile.</p>
                  )}
                </div>
              </div>
            )}

            {/* Documents Mock */}
            {activeTab === 'documents' && (
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">Shared Business Documents</span>
                <div className="divide-y divide-slate-100 dark:divide-slate-900 space-y-3">
                  {(customer.profile?.documents || []).map((doc: any, i: number) => (
                    <div key={i} className="flex justify-between items-center py-2.5 text-xs">
                      <div className="text-left space-y-0.5 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-slate-750 dark:text-slate-250 block">{doc.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono font-medium block">Key: {doc.id}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => toast.success(`Preparing securely signed download link for "${doc.name}"...`)}
                        className="text-indigo-600 hover:underline font-bold cursor-pointer font-mono"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                  {(!customer.profile?.documents || customer.profile.documents.length === 0) && (
                    <p className="text-xs text-slate-400 italic py-6">No documents uploaded.</p>
                  )}
                </div>
              </div>
            )}

          </Card>
        </div>

      </div>

    </div>
  );
};
