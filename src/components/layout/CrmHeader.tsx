/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { NotificationCenter } from '../notifications/NotificationCenter';
import {
  Search,
  Bell,
  ChevronDown,
  Globe,
  Sun,
  Moon,
  PlusCircle,
  LogOut,
  Sparkles,
  Command,
  LayoutDashboard,
  Users2,
  FolderSync
} from 'lucide-react';
import { toast } from 'sonner';

interface CrmHeaderProps {
  onOpenCommandPalette: () => void;
  onOpenQuickForm: (formType: 'customer' | 'lead' | 'deal') => void;
}

export const CrmHeader: React.FC<CrmHeaderProps> = ({
  onOpenCommandPalette,
  onOpenQuickForm
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, theme, setTheme, language, setLanguage, logout } = useAuthStore();
  const { businessInfo } = useOnboardingStore();

  const [time, setTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);

  // Live clock ticking
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Notifications state
  const [unreadCount, setUnreadCount] = useState(3);
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'Lead score alert',
      desc: 'TechVantage Labs lead score exceeded 85.',
      time: 'Just now',
      unread: true,
      type: 'lead'
    },
    {
      id: 'n2',
      title: 'Pending Invoice Due',
      desc: 'Amit Roy outstanding payment of ₹45,000.',
      time: '15m ago',
      unread: true,
      type: 'payment'
    },
    {
      id: 'n3',
      title: 'SaaS Contract Renewed',
      desc: 'Cognitive Solutions standard subscription renewed.',
      time: '2h ago',
      unread: true,
      type: 'contract'
    }
  ]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (notificationsRef.current && !notificationsRef.current.contains(target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(target)) setShowProfile(false);
      if (languageRef.current && !languageRef.current.contains(target)) setShowLanguage(false);
      if (quickAddRef.current && !quickAddRef.current.contains(target)) setShowQuickAdd(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    toast.info(`Theme changed to ${nextTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}`);
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    setUnreadCount(0);
    toast.success('All notifications marked as read.');
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out of CRM Session.');
    navigate('/login');
  };

  const handleLangSelect = (lang: 'en' | 'hi' | 'ta') => {
    setLanguage(lang as any);
    setShowLanguage(false);
    toast.success(`Language updated to ${lang.toUpperCase()}`);
  };

  const isCrmPath = location.pathname.startsWith('/crm');
  const activeBusinessName = businessInfo.businessName || "SaaS Enterprise";

  return (
    <header className="h-16 border-b border-slate-200/50 dark:border-slate-850 bg-white/65 dark:bg-slate-950/65 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      
      {/* Welcome & Breadcrumb */}
      <div className="flex items-center gap-4 text-left">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5 uppercase font-mono tracking-wide">
              {activeBusinessName}
            </h2>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black font-mono tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 uppercase">
              ● Active
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
            {time.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })} — {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>

        {/* Workspace Switcher */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/30 dark:border-slate-850">
          <button
            onClick={() => navigate('/dashboard/overview')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${!isCrmPath ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-3xs font-extrabold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => navigate('/crm/customers')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isCrmPath ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-3xs font-extrabold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            <Users2 className="w-3.5 h-3.5" />
            <span>CRM Core</span>
          </button>
        </div>
      </div>

      {/* Global Actions Bar */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Command Search Bar UI */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 h-9 w-44 sm:w-56 rounded-xl border border-slate-200/50 dark:border-slate-850/80 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-350 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900 text-left text-slate-400 hover:text-slate-500 cursor-pointer transition-all duration-300"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-[11px] font-medium flex-grow truncate">Global search ledger...</span>
          <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-[8px] font-black font-mono tracking-widest text-slate-400">
            <Command className="w-2 h-2" />K
          </span>
        </button>

        {/* AI Insight Search Button */}
        <button
          onClick={() => toast.success('AI Prompt Engine is initializing...', { description: 'Semantic schema scanner ready.' })}
          className="p-1.5 h-9 w-9 rounded-xl border border-slate-200/40 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
          title="AI Search Prompt"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
        </button>

        {/* Quick Add Menu */}
        <div className="relative" ref={quickAddRef}>
          <button
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="p-1.5 h-9 w-9 rounded-xl border border-indigo-500/10 hover:border-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center cursor-pointer transition-colors"
            title="Quick Form Launcher"
          >
            <PlusCircle className="w-4 h-4" />
          </button>

          {showQuickAdd && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl py-1.5 z-40 text-left text-xs font-bold text-slate-600 dark:text-slate-300">
              <span className="block px-3 py-1 text-[9px] text-slate-400 uppercase tracking-widest font-mono">Create Opportunity</span>
              <button
                onClick={() => { setShowQuickAdd(false); onOpenQuickForm('customer'); }}
                className="w-full px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-left flex items-center gap-2 cursor-pointer"
              >
                <span>Add New Customer</span>
              </button>
              <button
                onClick={() => { setShowQuickAdd(false); onOpenQuickForm('lead'); }}
                className="w-full px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-left flex items-center gap-2 cursor-pointer"
              >
                <span>Add New Lead</span>
              </button>
              <button
                onClick={() => { setShowQuickAdd(false); onOpenQuickForm('deal'); }}
                className="w-full px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-left flex items-center gap-2 cursor-pointer"
              >
                <span>Add New Deal</span>
              </button>
            </div>
          )}
        </div>

        {/* Language Switch */}
        <div className="relative" ref={languageRef}>
          <button
            onClick={() => setShowLanguage(!showLanguage)}
            className="p-1.5 h-9 w-9 rounded-xl border border-slate-200/40 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-650 cursor-pointer flex items-center justify-center transition-colors"
          >
            <Globe className="w-4 h-4" />
          </button>
          {showLanguage && (
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-xl py-1 z-40 text-left text-[11px] font-bold">
              <button onClick={() => handleLangSelect('en')} className="w-full px-3 py-2 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900 text-left cursor-pointer">EN (English)</button>
              <button onClick={() => handleLangSelect('hi')} className="w-full px-3 py-2 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900 text-left cursor-pointer">HI (हिन्दी)</button>
              <button onClick={() => handleLangSelect('ta')} className="w-full px-3 py-2 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900 text-left cursor-pointer">TA (தமிழ்)</button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={handleToggleTheme}
          className="p-1.5 h-9 w-9 rounded-xl border border-slate-200/40 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-650 cursor-pointer flex items-center justify-center transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Slide-out Drawer */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(true)}
            className="p-1.5 h-9 w-9 rounded-xl border border-slate-200/40 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-650 cursor-pointer flex items-center justify-center transition-colors relative"
            title="System Alerts Board"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
            )}
          </button>

          <NotificationCenter 
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            onUnreadCountChange={(count) => setUnreadCount(count)}
          />
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-1.5 p-1 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-850 cursor-pointer"
          >
            <div className="w-7.5 h-7.5 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {user?.firstName?.[0] || 'J'}
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl py-1.5 z-40 text-left text-xs font-bold text-slate-700 dark:text-slate-350">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-900">
                <p className="text-[11px] text-slate-800 dark:text-slate-200 truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-[9px] text-slate-400 font-mono truncate font-light mt-0.5">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/25 text-left flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Console</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
