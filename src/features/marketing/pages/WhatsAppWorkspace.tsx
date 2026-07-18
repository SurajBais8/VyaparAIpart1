/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { whatsappService } from '../services/whatsapp.service';
import { templateService } from '../services/template.service';
import { WhatsAppChat, WhatsAppMessage, MarketingTemplate } from '../../../types/marketing';
import { WhatsAppCard } from '../components/WhatsAppCard';
import { 
  Sparkles, Send, Paperclip, Smile, Search, MessageSquare, 
  User, Phone, Star, Shield, ArrowLeft, Image, FileText, CheckCircle, 
  PlusCircle, BookOpen, Clock, RefreshCw, ChevronRight, X
} from 'lucide-react';
import { toast } from 'sonner';

export default function WhatsAppWorkspace() {
  const [chats, setChats] = useState<WhatsAppChat[]>([]);
  const [templates, setTemplates] = useState<MarketingTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Active' | 'Archived'>('Active');
  
  // Selected conversational thread
  const [selectedChat, setSelectedChat] = useState<WhatsAppChat | null>(null);
  const [inputText, setInputText] = useState('');
  
  // Modals / Dropdowns
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showAttachmentsMenu, setShowAttachmentsMenu] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // New Chat Form
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatPhone, setNewChatPhone] = useState('');
  const [newChatName, setNewChatName] = useState('');

  // Customer log notes
  const [notes, setNotes] = useState('Customer is highly interested in custom database tier options. Expected decision is Q3.');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await whatsappService.getChats();
      const temps = await templateService.getTemplates();
      setChats(res);
      setTemplates(temps.filter(t => t.type === 'WhatsApp'));

      // Keep reference to active chat synced
      if (selectedChat) {
        const refreshed = res.find(c => c.id === selectedChat.id);
        if (refreshed) setSelectedChat(refreshed);
      } else if (res.length > 0) {
        setSelectedChat(res[0]);
      }
    } catch (err) {
      toast.error('Failed to sync WhatsApp workspace logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendMessage = async (text: string, mediaUrl: string | null = null, mediaType: string | null = null) => {
    if (!selectedChat) return;
    if (!text.trim() && !mediaUrl) return;

    try {
      const msg = await whatsappService.sendMessage(selectedChat.id, text, mediaUrl, mediaType);
      setInputText('');
      setShowEmojiPicker(false);
      setShowAttachmentsMenu(false);
      toast.success('WhatsApp text dispatched.');
      await loadData();
      
      // Auto reply simulation to make it feel extremely interactive and professional
      setTimeout(async () => {
        if (!selectedChat) return;
        const list = await whatsappService.getChats();
        const chatIdx = list.findIndex(c => c.id === selectedChat.id);
        if (chatIdx >= 0) {
          const autoReply: WhatsAppMessage = {
            id: `msg-reply-${Date.now()}`,
            text: `Thank you for your response! Our corporate engineering squad has logged your ticket. Let us know if we should update your SLA.`,
            sender: 'customer',
            timestamp: new Date().toISOString(),
            mediaUrl: null,
            mediaType: null
          };
          list[chatIdx].messages.push(autoReply);
          list[chatIdx].lastMessage = autoReply.text;
          list[chatIdx].lastUpdated = new Date().toISOString();
          list[chatIdx].unread = 1;
          localStorage.setItem('saas-marketing-whatsapp', JSON.stringify(list));
          await loadData();
          toast.info(`New incoming message from ${selectedChat.contactName}`);
        }
      }, 4000);

    } catch (err) {
      toast.error('Failed to dispatch text.');
    }
  };

  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatName || !newChatPhone) {
      toast.error('Please input a valid recipient name and phone number.');
      return;
    }
    try {
      const created = await whatsappService.createChat(newChatName, newChatPhone);
      toast.success(`Chat thread initialized for ${created.contactName}`);
      setShowNewChatModal(false);
      setNewChatName('');
      setNewChatPhone('');
      await loadData();
      setSelectedChat(created);
    } catch (err) {
      toast.error('Failed to initialize chat thread.');
    }
  };

  const handleArchiveChat = async (id: string) => {
    try {
      await whatsappService.archiveChat(id);
      toast.success('Chat archived.');
      await loadData();
      if (selectedChat?.id === id) {
        setSelectedChat(null);
      }
    } catch (err) {
      toast.error('Archive failure.');
    }
  };

  const handleDeleteChat = async (id: string) => {
    if (!window.confirm('Delete this chat history permanently?')) return;
    try {
      await whatsappService.deleteChat(id);
      toast.success('Chat history deleted.');
      await loadData();
      if (selectedChat?.id === id) {
        setSelectedChat(null);
      }
    } catch (err) {
      toast.error('Failed to purge chat.');
    }
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Uploading media templates and establishing broadcast sockets...',
        success: 'WhatsApp Broadcast dispatched to 425 customer profiles successfully!',
        error: 'Socket error.'
      }
    );
    setShowBroadcastModal(false);
  };

  const handleTemplateInject = (tpl: MarketingTemplate) => {
    setInputText(tpl.content);
    setShowTemplatesModal(false);
    toast.success(`Injected template content: "${tpl.name}"`);
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  const filteredChats = chats.filter(c => {
    const matchesSearch = c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.phone.includes(searchQuery);
    const matchesStatus = c.status === activeTab;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 text-left">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> Conversational CRM
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">
            WhatsApp Gateway & Live Desk
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 text-indigo-600 rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" /> WhatsApp Broadcast
          </button>
          <button
            onClick={() => setShowNewChatModal(true)}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Initialize Chat
          </button>
        </div>
      </div>

      {/* Main chat boundary layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 border border-slate-150 rounded-2xl bg-white shadow-xs overflow-hidden h-[600px] relative">
        
        {/* Left Side: Threads index */}
        <div className="lg:col-span-1 border-r border-slate-150 flex flex-col justify-between bg-slate-50/35 h-full">
          <div>
            {/* Thread filters and search */}
            <div className="p-4 space-y-3 border-b border-slate-150 bg-white">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search chat or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 gap-0.5">
                {(['Active', 'Archived'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-[10px] py-1 font-bold font-mono uppercase rounded cursor-pointer tracking-wider flex-1 text-center ${
                      activeTab === tab ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Chats loop */}
            <div className="overflow-y-auto max-h-[460px] scrollbar-thin divide-y divide-slate-100">
              {loading ? (
                <div className="p-6 text-center text-xs text-slate-400 font-mono animate-pulse">Syncing threads...</div>
              ) : filteredChats.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 font-normal">No threads found.</div>
              ) : (
                filteredChats.map(chat => (
                  <WhatsAppCard
                    key={chat.id}
                    chat={chat}
                    isActive={selectedChat?.id === chat.id}
                    onClick={() => setSelectedChat(chat)}
                    onArchive={(e) => { e.stopPropagation(); handleArchiveChat(chat.id); }}
                    onDelete={(e) => { e.stopPropagation(); handleDeleteChat(chat.id); }}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Middle: Active Chat Panel */}
        <div className="lg:col-span-2 flex flex-col justify-between bg-slate-50 h-full relative">
          {selectedChat ? (
            <>
              {/* Active chat header info */}
              <div className="p-4 border-b border-slate-150 bg-white flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-3 text-left">
                  <div className="h-9 w-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 leading-none">{selectedChat.contactName}</h4>
                    <span className="text-[10px] font-mono text-slate-400 mt-1 block">{selectedChat.phone}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setShowTemplatesModal(true)}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center space-x-1 text-xs font-bold cursor-pointer border border-indigo-150/50 bg-indigo-50/20"
                    title="Insert WhatsApp Template"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[10px] font-mono uppercase font-black">Templates</span>
                  </button>
                </div>
              </div>

              {/* Message scroll list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin text-left">
                {selectedChat.messages.map((msg) => {
                  const isAgent = msg.sender === 'agent';
                  return (
                    <div key={msg.id} className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs md:max-w-sm rounded-2xl p-3.5 shadow-xs relative ${
                        isAgent ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-150'
                      }`}>
                        
                        {msg.mediaUrl && (
                          <div className="mb-2 rounded-lg overflow-hidden border border-slate-200/55 bg-slate-100">
                            {msg.mediaType === 'image' ? (
                              <img src={msg.mediaUrl} alt="WhatsApp attachment" className="max-w-full h-auto object-cover max-h-40" />
                            ) : (
                              <div className="p-3 flex items-center space-x-2 text-xs text-slate-700">
                                <FileText className="w-5 h-5 text-indigo-500" />
                                <span className="font-mono truncate">Invoice_Slip_7718.pdf</span>
                              </div>
                            )}
                          </div>
                        )}

                        <p className="text-xs font-normal leading-relaxed break-words">{msg.text}</p>
                        
                        <div className="flex items-center justify-end space-x-1 mt-1.5 shrink-0">
                          <span className={`text-[9px] font-mono ${isAgent ? 'text-indigo-200' : 'text-slate-400'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isAgent && <CheckCircle className="w-3 h-3 text-indigo-200 shrink-0" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat action bar input */}
              <div className="p-4 bg-white border-t border-slate-150 relative shrink-0">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
                  className="flex items-center space-x-2.5"
                >
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowAttachmentsMenu(!showAttachmentsMenu)}
                      className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl cursor-pointer"
                      title="Attach file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>

                    {showAttachmentsMenu && (
                      <div className="absolute bottom-12 left-0 bg-white border border-slate-200 rounded-xl p-2 shadow-xl z-20 space-y-1 w-32">
                        <button
                          type="button"
                          onClick={() => handleSendMessage("Shared catalog image", "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400", "image")}
                          className="w-full text-left px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-md flex items-center space-x-2"
                        >
                          <Image className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Catalog Img</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendMessage("Disbursed invoice copy", "https://saas.io/invoice/sample.pdf", "document")}
                          className="w-full text-left px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-md flex items-center space-x-2"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-500" />
                          <span>Invoice PDF</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl cursor-pointer"
                      title="Emojis list"
                    >
                      <Smile className="w-4 h-4" />
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute bottom-12 left-0 bg-white border border-slate-200 rounded-xl p-2.5 shadow-xl z-20 grid grid-cols-4 gap-1 w-36">
                        {['👋', '👍', '🔥', '🎉', '📆', '💼', '📊', '✅'].map(em => (
                          <button
                            key={em}
                            type="button"
                            onClick={() => handleEmojiSelect(em)}
                            className="p-1 hover:bg-slate-100 rounded text-sm cursor-pointer"
                          >
                            {em}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Type WhatsApp message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-sans text-slate-800"
                  />

                  <button
                    type="submit"
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400 space-y-3">
              <MessageSquare className="w-10 h-10 text-slate-350" />
              <p className="text-sm font-semibold">Select a conversational thread</p>
              <p className="text-xs max-w-xs font-normal">Choose a customer chat index from the left sidebar to start live communications.</p>
            </div>
          )}
        </div>

        {/* Right Side: Customer Details Panel */}
        <div className="lg:col-span-1 border-l border-slate-150 bg-white p-5 h-full overflow-y-auto scrollbar-thin text-left space-y-6">
          {selectedChat ? (
            <>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 mb-3">Customer Profile</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 leading-none">{selectedChat.contactName}</h4>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{selectedChat.phone}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600">
                    <div className="flex justify-between">
                      <span className="font-mono text-slate-400">Status:</span>
                      <span className="font-semibold text-indigo-600 flex items-center">
                        <Shield className="w-3.5 h-3.5 mr-0.5" /> Qualified Lead
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-slate-400">Opt-in channel:</span>
                      <span className="font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-slate-400">Account ID:</span>
                      <span className="font-semibold font-mono text-slate-800">ACC-4472</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 mb-2">Customer Notepad</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-32 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans text-slate-600 focus:outline-none focus:border-indigo-500 leading-normal"
                />
                <button
                  onClick={() => toast.success('Customer notes saved to database.')}
                  className="mt-2 w-full py-1.5 bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase font-mono tracking-wider cursor-pointer text-center"
                >
                  Update Notepad
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-1">
                <span className="block text-[10px] font-mono text-slate-400 uppercase">System triggers</span>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  All messages flowing through this gateway is archived under Compliance Guidelines (SLA-3).
                </p>
              </div>
            </>
          ) : (
            <div className="text-center p-6 text-xs text-slate-400 font-mono">Select chat thread for profile details.</div>
          )}
        </div>
      </div>

      {/* WHATSAPP TEMPLATES DRAWER MODAL */}
      {showTemplatesModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-2xl"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-150 mb-4">
              <h3 className="text-sm font-black font-mono uppercase tracking-wider text-slate-800 flex items-center">
                <BookOpen className="w-4 h-4 mr-1.5 text-indigo-500" />
                Select pre-built template
              </h3>
              <button onClick={() => setShowTemplatesModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
              {templates.length === 0 ? (
                <p className="text-xs text-slate-400 font-mono">No WhatsApp templates formulated.</p>
              ) : (
                templates.map(tpl => (
                  <div
                    key={tpl.id}
                    onClick={() => handleTemplateInject(tpl)}
                    className="p-3 bg-slate-50 hover:bg-indigo-50/40 hover:border-indigo-250 border border-slate-150 rounded-lg cursor-pointer text-left transition-all"
                  >
                    <p className="text-xs font-bold text-slate-800 mb-1">{tpl.name}</p>
                    <p className="text-[11px] text-slate-600 font-mono line-clamp-3 bg-white p-2 rounded border border-slate-100">{tpl.content}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* NEW CHAT FORMULATE MODAL */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-6 shadow-2xl text-left"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-150 mb-4">
              <h3 className="text-sm font-black font-mono uppercase tracking-wider text-slate-800">
                Initialize WhatsApp Thread
              </h3>
              <button onClick={() => setShowNewChatModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateChat} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newChatName}
                  onChange={(e) => setNewChatName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">WhatsApp Number (with country code)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 99999 88888"
                  value={newChatPhone}
                  onChange={(e) => setNewChatPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-500 font-semibold text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewChatModal(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-650 text-xs font-bold uppercase font-mono rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase font-mono rounded-lg cursor-pointer"
                >
                  Establish Thread
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* WHATSAPP BROADCAST SETUP MODAL */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-2xl text-left"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-150 mb-4">
              <h3 className="text-sm font-black font-mono uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                Trigger Broadcast Notification
              </h3>
              <button onClick={() => setShowBroadcastModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Target Segment</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer">
                  <option>Premium Members (1420 Contacts)</option>
                  <option>All Active Customers (15200 Contacts)</option>
                  <option>SaaS Trial Signups (2540 Contacts)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">WhatsApp Template Reference</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer">
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-[11px] text-amber-700 leading-relaxed font-normal">
                Important: Broadcast notifications require pre-approved WhatsApp Business meta variables. Delivery logs will generate inside analytics desk immediately on socket dispatch.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-650 text-xs font-bold uppercase font-mono rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase font-mono rounded-lg cursor-pointer"
                >
                  Disburse Broadcast
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
