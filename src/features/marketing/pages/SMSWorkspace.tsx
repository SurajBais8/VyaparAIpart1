/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { smsService } from '../services/sms.service';
import { templateService } from '../services/template.service';
import { SMSMessage, MarketingTemplate } from '../../../types/marketing';
import { SMSCard } from '../components/SMSCard';
import { 
  Sparkles, Phone, Send, Clock, BookOpen, Search, Filter, 
  HelpCircle, RefreshCw, Layers, CheckCircle, AlertCircle, Trash2
} from 'lucide-react';
import { toast } from 'sonner';

export default function SMSWorkspace() {
  const [messages, setMessages] = useState<SMSMessage[]>([]);
  const [templates, setTemplates] = useState<MarketingTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Delivered' | 'Pending' | 'Failed'>('All');

  // Direct SMS compose
  const [composeSMS, setComposeSMS] = useState({
    to: '',
    text: '',
    senderId: 'SAASIO'
  });
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  // GSM Character Counter helpers
  const CHAR_LIMIT = 160;
  const charCount = composeSMS.text.length;
  const segments = Math.ceil(charCount / CHAR_LIMIT) || 1;

  const loadData = async () => {
    try {
      setLoading(true);
      const list = await smsService.getSMSMessages();
      const temps = await templateService.getTemplates();
      setMessages(list);
      setTemplates(temps.filter(t => t.type === 'SMS'));
    } catch (err) {
      toast.error('Failed to sync SMS logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleComposeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeSMS.to || !composeSMS.text) {
      toast.error('Recipient phone and text copy are mandatory.');
      return;
    }
    try {
      await smsService.sendSMS(composeSMS.to, composeSMS.text, 'Delivered');
      toast.success(`SMS dispatched successfully via "${composeSMS.senderId}" gateway!`);
      setComposeSMS({ to: '', text: '', senderId: 'SAASIO' });
      loadData();
    } catch (err) {
      toast.error('Failed to dispatch SMS.');
    }
  };

  const handleDeleteLog = async (id: string) => {
    try {
      await smsService.deleteSMS(id);
      toast.success('SMS log purged.');
      loadData();
    } catch (err) {
      toast.error('Purge failure.');
    }
  };

  const handleTemplateInject = (tpl: MarketingTemplate) => {
    setComposeSMS(prev => ({ ...prev, text: tpl.content }));
    setShowTemplatesModal(false);
    toast.success(`Injected template: "${tpl.name}"`);
  };

  // Filter list
  const filteredMessages = messages.filter(m => {
    const matchesSearch = m.to.includes(searchQuery) || m.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 text-left">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> SMS Gateway
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">
            SMS Broadcasts & GSM Core
          </h1>
        </div>
      </div>

      {/* Main boundary layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left pane: Direct Compose GSM limits checker */}
        <div className="lg:col-span-1 p-5 bg-white border border-slate-150 rounded-2xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="text-xs font-black font-mono uppercase tracking-wider text-slate-800">
              Direct Gateway Dispatch
            </h3>
            
            <button
              onClick={() => setShowTemplatesModal(true)}
              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 text-indigo-600 rounded-lg text-[10px] font-black uppercase font-mono tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" /> Select Template
            </button>
          </div>

          <form onSubmit={handleComposeSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Sender ID Registry</label>
              <input
                type="text"
                maxLength={6}
                value={composeSMS.senderId}
                onChange={(e) => setComposeSMS(prev => ({ ...prev, senderId: e.target.value.toUpperCase() }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-indigo-500 text-indigo-600"
                placeholder="e.g. SAASIO"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Recipient Number</label>
              <input
                type="text"
                required
                placeholder="e.g. +919999988888"
                value={composeSMS.to}
                onChange={(e) => setComposeSMS(prev => ({ ...prev, to: e.target.value }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-500 font-semibold text-slate-800"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400">Message Text copy</label>
                <span className={`text-[10px] font-mono font-bold ${charCount > CHAR_LIMIT ? 'text-amber-600' : 'text-slate-450'}`}>
                  {charCount}/{CHAR_LIMIT} ({segments} segments)
                </span>
              </div>
              <textarea
                rows={5}
                required
                placeholder="Enter SMS payload... Standard opt-out keywords will automatically append to satisfy SLA-4."
                value={composeSMS.text}
                onChange={(e) => setComposeSMS(prev => ({ ...prev, text: e.target.value }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-sans text-slate-700 leading-relaxed"
              />
              <span className="text-[9px] text-slate-400 mt-1 block font-mono">Note: 1 SMS segment = 160 characters. Text will send in clean GSM-7 encoding.</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" /> Disburse SMS
            </button>
          </form>
        </div>

        {/* Right pane: Delivery Reports list */}
        <div className="lg:col-span-2 p-5 bg-white border border-slate-150 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-black font-mono uppercase tracking-wider text-slate-800">
                  SMS Gateway Delivery logs
                </h3>
                <p className="text-[10px] text-slate-400">Live operational ledger logs</p>
              </div>

              {/* Filters */}
              <div className="flex items-center bg-slate-50 border border-slate-200 p-1 rounded-lg gap-1">
                {(['All', 'Delivered', 'Pending', 'Failed'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded cursor-pointer ${
                      statusFilter === tab ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* List Loop */}
            <div className="space-y-3.5 max-h-[380px] overflow-y-auto scrollbar-thin">
              {loading ? (
                <div className="p-6 text-center text-xs text-slate-400 font-mono animate-pulse">Querying GSM logs...</div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 font-normal">No gateway logs match the active filter.</div>
              ) : (
                filteredMessages.map(msg => (
                  <SMSCard
                    key={msg.id}
                    sms={msg}
                    onDelete={(e) => { e.stopPropagation(); handleDeleteLog(msg.id); }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SMS TEMPLATES MODAL DIALOG */}
      {showTemplatesModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-6 shadow-2xl text-left"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-150 mb-4">
              <h3 className="text-sm font-black font-mono uppercase tracking-wider text-slate-800 flex items-center">
                <BookOpen className="w-4 h-4 mr-1.5 text-indigo-500" />
                Select SMS Template
              </h3>
              <button onClick={() => setShowTemplatesModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {templates.length === 0 ? (
                <p className="text-xs text-slate-400 font-mono">No SMS templates formulated.</p>
              ) : (
                templates.map(tpl => (
                  <div
                    key={tpl.id}
                    onClick={() => handleTemplateInject(tpl)}
                    className="p-3 bg-slate-50 hover:bg-indigo-50/40 hover:border-indigo-250 border border-slate-150 rounded-lg cursor-pointer transition-all"
                  >
                    <p className="text-xs font-bold text-slate-800 mb-1">{tpl.name}</p>
                    <p className="text-[11px] text-slate-600 font-mono line-clamp-2 bg-white p-2 rounded border border-slate-100">{tpl.content}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
