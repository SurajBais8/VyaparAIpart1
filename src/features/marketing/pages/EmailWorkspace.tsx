/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { emailService } from '../services/email.service';
import { templateService } from '../services/template.service';
import { EmailMessage, MarketingTemplate } from '../../../types/marketing';
import { EmailCard } from '../components/EmailCard';
import { TemplateCard } from '../components/TemplateCard';
import { 
  Sparkles, Mail, Send, FileText, Clock, PenTool, Inbox, Trash2, 
  Search, Eye, Copy, ArrowLeft, RefreshCw, Layout, Smartphone, Laptop,
  PlusCircle, BookOpen, Layers, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function EmailWorkspace() {
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [templates, setTemplates] = useState<MarketingTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState<'Inbox' | 'Outbox' | 'Draft' | 'Scheduled' | 'Templates' | 'Builder'>('Inbox');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Compose drawer
  const [showCompose, setShowCompose] = useState(false);
  const [composeEmail, setComposeEmail] = useState({
    to: '',
    subject: '',
    body: '',
    status: 'Outbox' as 'Outbox' | 'Draft' | 'Scheduled'
  });

  // Drag-and-Block newsletter builder states
  const [builderTemplate, setBuilderTemplate] = useState({
    name: 'Untitled Newsletter Pack',
    category: 'Marketing' as 'Transactional' | 'Marketing' | 'Engagement',
    subject: '🔥 Instant Performance Unlock: Check your cluster now',
    blocks: [
      { id: 'b1', type: 'header', content: 'ENTERPRISE DATABASE CLOUD' },
      { id: 'b2', type: 'body', content: 'Hello {{name}}, we have finalized our high-speed solid-state cluster triggers. Click the link to instantly claim ₹5,000 credits.' },
      { id: 'b3', type: 'button', content: 'ACTIVATE PERFORMANCE DOCK', link: 'https://saas.io/dock' },
      { id: 'b4', type: 'footer', content: 'You received this transactional billing communication under opt-in SLA agreement.' }
    ]
  });
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const loadData = async () => {
    try {
      setLoading(true);
      const mailList = await emailService.getEmails();
      const tempList = await templateService.getTemplates();
      setEmails(mailList);
      setTemplates(tempList.filter(t => t.type === 'Email'));
    } catch (err) {
      toast.error('Failed to sync marketing emails.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleComposeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeEmail.to || !composeEmail.subject) {
      toast.error('Recipient email and subject line are mandatory.');
      return;
    }
    try {
      await emailService.sendEmail(composeEmail);
      toast.success(composeEmail.status === 'Draft' ? 'Draft saved' : composeEmail.status === 'Scheduled' ? 'Email scheduled' : 'Email dispatched successfully!');
      setShowCompose(false);
      setComposeEmail({ to: '', subject: '', body: '', status: 'Outbox' });
      loadData();
    } catch (err) {
      toast.error('Failed to execute dispatch.');
    }
  };

  const handleDeleteMail = async (id: string) => {
    try {
      await emailService.deleteEmail(id);
      toast.success('Email purged.');
      loadData();
    } catch (err) {
      toast.error('Delete failure.');
    }
  };

  const handleCreateTemplateFromBuilder = async () => {
    try {
      const parsedContent = builderTemplate.blocks.map(b => {
        if (b.type === 'button') return `[Button: ${b.content} -> ${b.link}]`;
        return b.content;
      }).join('\n\n');

      const created = await templateService.createTemplate({
        name: builderTemplate.name,
        type: 'Email',
        category: builderTemplate.category,
        content: parsedContent,
        variables: ['name'],
        subject: builderTemplate.subject
      });
      
      toast.success(`Newsletter Template "${created.name}" saved successfully!`);
      setActiveFolder('Templates');
      loadData();
    } catch (err) {
      toast.error('Failed to save template.');
    }
  };

  const handleDuplicateTemplate = async (tpl: MarketingTemplate) => {
    try {
      await templateService.createTemplate({
        ...tpl,
        name: `${tpl.name} (Copy)`
      });
      toast.success('Template duplicated.');
      loadData();
    } catch (err) {
      toast.error('Duplicate failure.');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await templateService.deleteTemplate(id);
      toast.success('Template purged.');
      loadData();
    } catch (err) {
      toast.error('Failed to purge template.');
    }
  };

  const handleBlockEdit = (id: string, text: string) => {
    setBuilderTemplate(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, content: text } : b)
    }));
  };

  const handleAddBlock = (type: 'header' | 'body' | 'button' | 'footer') => {
    const newId = `b-${Date.now()}`;
    const content = type === 'button' ? 'CLICK ACTION COHORT' : 'Enter block text here...';
    const newBlock = { id: newId, type, content, link: type === 'button' ? 'https://saas.io' : undefined };
    
    setBuilderTemplate(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
    toast.success(`Appended ${type} layout block.`);
  };

  const handleRemoveBlock = (id: string) => {
    setBuilderTemplate(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== id)
    }));
  };

  // Filter folder contents
  const filteredMessages = emails.filter(m => {
    const matchesSearch = m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.from.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFolder = m.status === activeFolder;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 text-left">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> Email Campaigns Panel
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">
            Email Marketing & Newsletter Hub
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => { setActiveFolder('Builder'); }}
            className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 text-indigo-600 rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <PenTool className="w-3.5 h-3.5" /> Newsletter Builder
          </button>
          <button
            onClick={() => setShowCompose(true)}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Compose Email
          </button>
        </div>
      </div>

      {/* Main Mailbox boundary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 border border-slate-150 rounded-2xl bg-white shadow-xs overflow-hidden min-h-[560px] relative">
        
        {/* Left Folder directory Side */}
        <div className="lg:col-span-1 border-r border-slate-150 p-4 bg-slate-50/40 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="block text-[9px] font-mono font-black uppercase text-slate-400 tracking-wider mb-2 text-left">Folders Directory</span>
              <div className="space-y-1">
                {[
                  { id: 'Inbox', label: 'Inbox Feed', icon: <Inbox className="w-4 h-4" /> },
                  { id: 'Outbox', label: 'Sent Campaigns', icon: <Send className="w-4 h-4" /> },
                  { id: 'Draft', label: 'Draft Folders', icon: <FileText className="w-4 h-4" /> },
                  { id: 'Scheduled', label: 'Scheduled Queue', icon: <Clock className="w-4 h-4" /> },
                ].map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => { setActiveFolder(folder.id as any); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-left ${
                      activeFolder === folder.id 
                        ? 'bg-gradient-to-r from-indigo-500/10 to-violet-500/5 text-indigo-600 border border-indigo-500/10' 
                        : 'text-slate-550 hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      {folder.icon}
                      <span>{folder.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-[9px] font-mono font-black uppercase text-slate-400 tracking-wider mb-2 text-left">Assets & Builders</span>
              <div className="space-y-1">
                <button
                  onClick={() => { setActiveFolder('Templates'); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-left ${
                    activeFolder === 'Templates' 
                      ? 'bg-gradient-to-r from-indigo-500/10 to-violet-500/5 text-indigo-600 border border-indigo-500/10' 
                      : 'text-slate-550 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <BookOpen className="w-4 h-4" />
                    <span>Stored Templates</span>
                  </div>
                  <span className="bg-slate-200 text-slate-700 text-[10px] font-mono font-black h-4 px-1.5 rounded-full flex items-center justify-center">
                    {templates.length}
                  </span>
                </button>

                <button
                  onClick={() => { setActiveFolder('Builder'); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-left ${
                    activeFolder === 'Builder' 
                      ? 'bg-gradient-to-r from-indigo-500/10 to-violet-500/5 text-indigo-600 border border-indigo-500/10' 
                      : 'text-slate-550 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Layout className="w-4 h-4" />
                    <span>Newsletter Builder</span>
                  </div>
                  <span className="text-[10px] text-indigo-600 font-mono font-black">Live</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Folder View Content */}
        <div className="lg:col-span-3 flex flex-col justify-between h-full bg-white relative p-6">
          <AnimatePresence mode="wait">
            {activeFolder !== 'Builder' && activeFolder !== 'Templates' ? (
              // NORMAL DIRECTORY FOLDERS LIST
              <motion.div
                key="folders"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 text-left"
              >
                {/* Search query box */}
                <div className="relative max-w-md mb-4">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search sender, subject metrics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-250 rounded-xl text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-3 max-h-[440px] overflow-y-auto scrollbar-thin">
                  {loading ? (
                    <div className="p-12 text-center text-xs text-slate-400 font-mono animate-pulse">Querying mail gateway...</div>
                  ) : filteredMessages.length === 0 ? (
                    <div className="p-12 text-center text-xs text-slate-400 font-mono">No communication packets in folder "{activeFolder}".</div>
                  ) : (
                    filteredMessages.map(mail => (
                      <EmailCard
                        key={mail.id}
                        email={mail}
                        onDelete={(e) => { e.stopPropagation(); handleDeleteMail(mail.id); }}
                      />
                    ))
                  )}
                </div>
              </motion.div>
            ) : activeFolder === 'Templates' ? (
              // TEMPLATES DIRECTORY
              <motion.div
                key="templates"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 text-left"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-sans font-semibold text-slate-800 text-sm uppercase tracking-wider font-mono">Stored Newsletter Templates</h3>
                  <button 
                    onClick={() => setActiveFolder('Builder')}
                    className="text-xs text-indigo-600 font-bold hover:underline flex items-center"
                  >
                    Launch Layout Builder →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[440px] overflow-y-auto scrollbar-thin p-1">
                  {templates.map(tpl => (
                    <TemplateCard
                      key={tpl.id}
                      template={tpl}
                      onPreview={() => { toast.info(`Variables: ${tpl.variables.join(', ')}\nContent:\n${tpl.content}`); }}
                      onDuplicate={() => { handleDuplicateTemplate(tpl); }}
                      onDelete={() => { handleDeleteTemplate(tpl.id); }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              // INTEGRATED DRAG-AND-BLOCK NEWSLETTER BUILDER
              <motion.div
                key="builder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-left"
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-sans font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <Layout className="w-4 h-4 text-indigo-500" />
                      Visual Block Newsletter Editor
                    </h3>
                    <p className="text-[11px] text-slate-400">Configure layout elements and save to templates.</p>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    {/* Device preview toggle */}
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                      <button
                        onClick={() => setPreviewDevice('desktop')}
                        className={`p-1 rounded cursor-pointer ${previewDevice === 'desktop' ? 'bg-white shadow text-indigo-600' : 'text-slate-400'}`}
                      >
                        <Laptop className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setPreviewDevice('mobile')}
                        className={`p-1 rounded cursor-pointer ${previewDevice === 'mobile' ? 'bg-white shadow text-indigo-600' : 'text-slate-400'}`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={handleCreateTemplateFromBuilder}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-mono uppercase tracking-wider text-[10px] font-black rounded-lg cursor-pointer shadow-sm"
                    >
                      Save Template
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Left Column: Blocks controller */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                      <span className="block text-[9px] font-mono font-black uppercase text-slate-400 tracking-wider">Configure Parameters</span>
                      
                      <div className="space-y-2">
                        <label className="block text-[10px] font-mono text-slate-500">Template Title</label>
                        <input
                          type="text"
                          value={builderTemplate.name}
                          onChange={(e) => setBuilderTemplate(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full p-2 bg-white border border-slate-200 rounded text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-800"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-mono text-slate-500">Subject line</label>
                        <input
                          type="text"
                          value={builderTemplate.subject}
                          onChange={(e) => setBuilderTemplate(prev => ({ ...prev, subject: e.target.value }))}
                          className="w-full p-2 bg-white border border-slate-200 rounded text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <span className="block text-[9px] font-mono font-black uppercase text-slate-400 tracking-wider mb-2.5">Append Layout Blocks</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAddBlock('header')}
                          className="p-2 bg-white border border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>+ Header</span>
                        </button>
                        <button
                          onClick={() => handleAddBlock('body')}
                          className="p-2 bg-white border border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>+ Body</span>
                        </button>
                        <button
                          onClick={() => handleAddBlock('button')}
                          className="p-2 bg-white border border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>+ Button</span>
                        </button>
                        <button
                          onClick={() => handleAddBlock('footer')}
                          className="p-2 bg-white border border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>+ Footer</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Canvas Live Preview */}
                  <div className="lg:col-span-3">
                    <div className={`border border-slate-200/80 rounded-xl bg-slate-100 p-4 shadow-inner mx-auto transition-all ${
                      previewDevice === 'mobile' ? 'max-w-xs' : 'w-full'
                    }`}>
                      <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden max-h-[380px] overflow-y-auto scrollbar-none p-4 text-center">
                        <div className="space-y-4">
                          {builderTemplate.blocks.map((block) => (
                            <div key={block.id} className="relative group p-2 hover:bg-slate-50/50 rounded-lg border border-dashed border-transparent hover:border-slate-350 transition-colors">
                              
                              {/* Block custom controls */}
                              <button
                                onClick={() => handleRemoveBlock(block.id)}
                                className="absolute top-1 right-1 p-0.5 bg-rose-50 text-rose-600 rounded opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold"
                                title="Remove block"
                              >
                                ✕
                              </button>

                              {block.type === 'header' ? (
                                <input
                                  type="text"
                                  value={block.content}
                                  onChange={(e) => handleBlockEdit(block.id, e.target.value)}
                                  className="w-full text-center text-xs font-bold font-mono tracking-wider text-indigo-600 border-none focus:ring-0 focus:outline-none uppercase bg-transparent"
                                />
                              ) : block.type === 'body' ? (
                                <textarea
                                  value={block.content}
                                  onChange={(e) => handleBlockEdit(block.id, e.target.value)}
                                  className="w-full text-left text-xs font-normal text-slate-650 border-none focus:ring-0 focus:outline-none bg-transparent h-16 leading-relaxed"
                                />
                              ) : block.type === 'button' ? (
                                <div className="py-2">
                                  <input
                                    type="text"
                                    value={block.content}
                                    onChange={(e) => handleBlockEdit(block.id, e.target.value)}
                                    className="w-11/12 mx-auto text-center text-[10px] font-black uppercase font-mono tracking-wider bg-indigo-600 text-white py-1.5 px-3 rounded shadow-xs focus:ring-0 focus:outline-none border-none"
                                  />
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  value={block.content}
                                  onChange={(e) => handleBlockEdit(block.id, e.target.value)}
                                  className="w-full text-center text-[10px] text-slate-450 border-none focus:ring-0 focus:outline-none bg-transparent font-light"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* COMPOSE DIALOG DRAWER */}
      {showCompose && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-1.5">
                <PenTool className="w-5 h-5 text-indigo-500" />
                Compose Campaign Message
              </h3>
              <button onClick={() => setShowCompose(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleComposeSubmit} className="space-y-4 flex-1 overflow-y-auto pr-1">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Recipient Address / List Segment</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. vip-members@broadcast.saas.io"
                  value={composeEmail.to}
                  onChange={(e) => setComposeEmail(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-500 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Subject Line</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 🚀 SaaS Performance scaleup available"
                  value={composeEmail.subject}
                  onChange={(e) => setComposeEmail(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Dispatch Mode</label>
                <select
                  value={composeEmail.status}
                  onChange={(e) => setComposeEmail(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="Outbox">Send Immediately</option>
                  <option value="Draft">Save as Draft</option>
                  <option value="Scheduled">Schedule for Later</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">HTML Body copy</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Write message copy... Use {{name}} to dynamically inject customer profiles."
                  value={composeEmail.body}
                  onChange={(e) => setComposeEmail(prev => ({ ...prev, body: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-500 text-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-650 text-xs font-bold uppercase font-mono rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase font-mono rounded-lg cursor-pointer animate-pulse"
                >
                  Confirm dispatch
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
