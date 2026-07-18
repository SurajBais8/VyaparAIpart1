/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contactService } from '../../services/contact.service';
import { Card } from '../../components/ui';
import { Timeline } from '../../components/crm/Timeline';
import { 
  ArrowLeft, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Sparkles, 
  Edit2, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  Download, 
  PhoneCall, 
  Send, 
  ShieldAlert,
  Save,
  Clock,
  Briefcase
} from 'lucide-react';
import { toast } from 'sonner';

export const ContactProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'notes' | 'documents' | 'ai' | 'edit'>('overview');
  
  // States for Notes
  const [newNote, setNewNote] = useState('');
  const [notesList, setNotesList] = useState<any[]>([
    { id: '1', text: 'Spoke with Amit. He is ready to review the custom API integration pricing sheet.', time: '2 hours ago', author: 'Jane Smith' },
    { id: '2', text: 'Left voicemail reminding about SLA draft feedback.', time: 'Yesterday', author: 'John Doe' }
  ]);

  // States for Documents
  const [documents, setDocuments] = useState<any[]>([
    { id: 'DOC-110', name: 'Compliance_Security_Self_Assessment_v1.pdf', size: '940 KB', date: '2026-07-10' },
    { id: 'DOC-109', name: 'Technical_Spec_TechVantage_Integration.docx', size: '1.2 MB', date: '2026-07-08' }
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States for Edit Form
  const [editForm, setEditForm] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    mobile: '',
    status: 'Active',
    notes: ''
  });

  const fetchContact = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await contactService.getContactById(id);
      if (data) {
        setContact(data);
        setEditForm({
          name: data.name || '',
          title: data.title || '',
          company: data.company || '',
          email: data.email || '',
          mobile: data.mobile || '',
          status: data.status || 'Active',
          notes: data.notes || ''
        });
      } else {
        toast.error('Contact profile not found.');
        navigate('/crm/contacts');
      }
    } catch (err) {
      toast.error('Failed to load contact record.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, [id]);

  const handleUpdateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      const updated = await contactService.updateContact(id, editForm);
      if (updated) {
        setContact(updated);
        toast.success('Contact record updated successfully!');
        setActiveTab('overview');
      }
    } catch (err) {
      toast.error('Failed to save contact adjustments.');
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const note = {
      id: Date.now().toString(),
      text: newNote,
      time: 'Just now',
      author: 'Self'
    };
    setNotesList([note, ...notesList]);
    setNewNote('');
    toast.success('Internal memo note logged.');
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
      toast.success(`Uploaded "${file.name}"!`);
    }
  };

  if (loading || !contact) {
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

  // Combined Interaction Stream (Timeline, Call, Email, WhatsApp History)
  const allTouchpoints = [
    { type: 'call', title: 'Outgoing Call', desc: 'Discussed basic API compliance standards.', time: '2 hours ago', channel: 'Voice Call', outcome: 'Connected' },
    { type: 'email', title: 'Proposal Email Sent', desc: 'Detailed PDF with quote was sent via CRM automation.', time: 'Yesterday', channel: 'Email', outcome: 'Opened' },
    { type: 'whatsapp', title: 'WhatsApp Direct Chat', desc: 'Sent temporary playground workspace token code.', time: '2 days ago', channel: 'WhatsApp', outcome: 'Delivered' },
    { type: 'call', title: 'Inbound Inquiry', desc: 'Clarified local Indian CGST/SGST ledger automation compliance.', time: '4 days ago', channel: 'Voice Call', outcome: 'Resolved' }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header action row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/crm/contacts')}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono">
                {contact.name}
              </h1>
              <span className={`px-2 py-0.5 rounded text-[9px] font-black font-mono tracking-wider uppercase border
                ${contact.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' : 'bg-slate-500/10 text-slate-400 border-slate-500/10'}`}
              >
                {contact.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-light mt-0.5">
              {contact.title} at {contact.company} • Key Personnel Record
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('edit')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold font-mono uppercase bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-indigo-500" /> Edit Contact
          </button>
          <button
            onClick={async () => {
              if (confirm('Delete this contact personnel file?')) {
                await contactService.deleteContact(contact.id);
                toast.success('Personnel removed successfully.');
                navigate('/crm/contacts');
              }
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold font-mono uppercase bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-xl cursor-pointer hover:bg-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Contact overview details card */}
        <div className="space-y-6">
          <Card variant="glass" className="p-5 border-slate-200/50 dark:border-slate-850 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-150/50 dark:border-slate-850/30 pb-3">
              <User className="w-4 h-4 text-indigo-500" />
              <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
                Personnel Profile Information
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Mobile Direct Line</span>
                <span className="font-mono font-semibold text-slate-750 dark:text-slate-200">+91 {contact.mobile}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Email Address</span>
                <span className="font-semibold text-slate-750 dark:text-slate-200">{contact.email}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Linked Customer Entity</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer block" onClick={() => navigate(`/crm/customers/${contact.companyId || 'CUST-001'}`)}>
                  {contact.company} (View Ledger)
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Linked Corporate Company</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer block" onClick={() => navigate(`/crm/companies/${contact.companyId || 'COM-001'}`)}>
                  {contact.company} Profile
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Creation Stamp</span>
                <span className="font-mono text-slate-500">{contact.dateAdded}</span>
              </div>

              {contact.notes && (
                <div className="pt-2 border-t border-slate-150/40 dark:border-slate-850/30">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Context Note</span>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-light mt-1 bg-slate-50/40 dark:bg-slate-900/10 p-2 rounded-lg border border-slate-100 dark:border-slate-850/20">
                    {contact.notes}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right column: Tabs & Content Panels */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Selection */}
          <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex items-center gap-1 border border-slate-200/50 dark:border-slate-850 overflow-x-auto max-w-full no-scrollbar text-[11px] font-bold">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'timeline', label: 'History & Logs' },
              { id: 'notes', label: 'Internal Notes' },
              { id: 'documents', label: 'Documents' },
              { id: 'ai', label: 'AI Summary' }
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
            
            {/* Overview Section */}
            {activeTab === 'overview' && (
              <div className="space-y-4 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">Operational Summary</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-left space-y-1">
                    <span className="text-[9px] font-bold text-slate-450 uppercase block font-mono">Recent Communication</span>
                    <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">Voice Call connected</span>
                    <span className="text-[9px] text-slate-400 font-mono">Logged: 2 hours ago</span>
                  </div>

                  <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-left space-y-1">
                    <span className="text-[9px] font-bold text-slate-450 uppercase block font-mono">Engagement Status</span>
                    <span className="text-xs font-bold block text-emerald-600">Active Champion</span>
                    <span className="text-[9px] text-slate-400 font-mono">Score: 88/100</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/20 dark:bg-slate-900/10 border border-slate-150 dark:border-slate-850/30 rounded-xl text-xs space-y-2">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Linked Account Standing</h4>
                  <p className="text-slate-500 leading-relaxed font-light">
                    {contact.name} is mapped as the primary stakeholder on corporate company <span className="font-semibold text-slate-850 dark:text-slate-200">{contact.company}</span>. No outstanding overdue invoices exist for this entity.
                  </p>
                </div>
              </div>
            )}

            {/* Timeline & touchpoints history */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Multi-Channel Touchpoint History</span>
                  <div className="flex gap-1">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500">Call Logs</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500">Email</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500">WhatsApp</span>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {allTouchpoints.map((tp, idx) => (
                    <div key={idx} className="p-3.5 bg-white dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850/60 rounded-xl text-xs flex justify-between items-start text-left">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`p-1 rounded bg-indigo-500/10 text-indigo-500`}>
                            {tp.type === 'call' && <PhoneCall className="w-3.5 h-3.5" />}
                            {tp.type === 'email' && <Mail className="w-3.5 h-3.5" />}
                            {tp.type === 'whatsapp' && <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />}
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-100">{tp.title}</span>
                          <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-900 text-slate-400">
                            {tp.channel}
                          </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-405 font-light leading-relaxed">{tp.desc}</p>
                      </div>

                      <div className="text-right space-y-1 shrink-0">
                        <span className="font-mono text-[9px] text-slate-400 block">{tp.time}</span>
                        <span className="inline-block px-1 rounded text-[8px] font-black uppercase font-mono bg-emerald-500/10 text-emerald-600 border border-emerald-500/10">
                          {tp.outcome}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes Section */}
            {activeTab === 'notes' && (
              <div className="space-y-4 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">Internal Memo Logbook</span>
                
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Log an internal memo details regarding this contact personnel..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-grow text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 outline-none"
                  />
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer font-mono uppercase tracking-wide"
                  >
                    Log Memo
                  </button>
                </form>

                <div className="space-y-3.5 pt-2">
                  {notesList.map((n) => (
                    <div key={n.id} className="p-3 bg-white dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850/60 rounded-xl text-xs">
                      <p className="text-slate-700 dark:text-slate-300 font-light leading-relaxed">{n.text}</p>
                      <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-100 dark:border-slate-850/20">
                        <span>By: {n.author}</span>
                        <span>{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents shared */}
            {activeTab === 'documents' && (
              <div className="space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Shared Documents Registry</span>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-[9px] font-bold font-mono uppercase px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Upload File
                  </button>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                  />
                </div>

                <div className="space-y-2.5">
                  {documents.map((doc) => (
                    <div key={doc.id} className="p-3 bg-white dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850/60 rounded-xl text-xs flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-indigo-500" />
                        <div>
                          <span className="font-bold block text-slate-800 dark:text-slate-200">{doc.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono">Size: {doc.size} • Uploaded: {doc.date}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => toast.success(`Downloading "${doc.name}" securely...`)}
                        className="p-1 rounded text-slate-400 hover:text-indigo-500 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Summary and outreach scripts */}
            {activeTab === 'ai' && (
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-150/50 dark:border-slate-850/30">
                  <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-indigo-600 uppercase font-mono tracking-wider">AI Persona Summary & Smart Prompts</span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-light">
                  Amit Roy is highly analytical and serves as the core Technical Leader at {contact.company}. He expects extremely crisp compliance specs and direct CJS bundle details. Suggest bypassing visual generic flow charts and jumping directly into code blocks during presentations.
                </p>

                <div className="p-3.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl space-y-2 text-xs">
                  <span className="font-bold text-indigo-600 block flex items-center gap-1 font-mono uppercase text-[9px]">
                    Generated Outreach Cold Draft
                  </span>
                  <p className="text-[11px] text-slate-650 dark:text-slate-400 italic bg-white dark:bg-slate-900/50 p-2.5 rounded border border-indigo-500/10 leading-relaxed font-mono">
                    "Hi Amit, I have prepared our full custom SaaS SLA documentation detailing the CGST @ 9% localized tax calculations configuration we spoke of. Let me know if you would like me to push our dev package code repository access invitation directly to your tech team..."
                  </p>
                  <button 
                    onClick={() => {
                      navigator.clipboard?.writeText("Hi Amit, I have prepared our full custom SaaS SLA documentation detailing the CGST @ 9% localized tax calculations configuration we spoke of. Let me know if you would like me to push our dev package code repository access invitation directly to your tech team...");
                      toast.success('AI Draft copied to clipboard!');
                    }}
                    className="mt-1 text-[10px] font-bold font-mono text-indigo-600 hover:underline cursor-pointer block"
                  >
                    Copy Outreach Draft
                  </button>
                </div>
              </div>
            )}

            {/* Edit Contact Panel */}
            {activeTab === 'edit' && (
              <form onSubmit={handleUpdateContact} className="space-y-4 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">Adjust Personnel Attributes</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Name</label>
                    <input 
                      type="text" 
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 text-slate-800 dark:text-slate-200"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Role / Title</label>
                    <input 
                      type="text" 
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                    <input 
                      type="email" 
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 text-slate-800 dark:text-slate-200"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Mobile Phone</label>
                    <input 
                      type="text" 
                      value={editForm.mobile}
                      onChange={(e) => setEditForm({...editForm, mobile: e.target.value})}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Entity Status</label>
                    <select 
                      value={editForm.status}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 text-slate-800 dark:text-slate-200"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Context Summary / Memo Notes</label>
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
                  <Save className="w-4 h-4" /> Save Adjusted Ledger
                </button>
              </form>
            )}

          </Card>
        </div>
      </div>
    </div>
  );
};
