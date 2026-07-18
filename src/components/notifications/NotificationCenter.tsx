/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  Trash2, 
  Search, 
  Filter, 
  AlertCircle, 
  Coins, 
  UserPlus, 
  FileCheck, 
  RefreshCw, 
  Mail, 
  Volume2,
  Inbox
} from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  type: 'lead' | 'deal' | 'system' | 'contract';
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  isOpen, 
  onClose,
  onUnreadCountChange 
}) => {
  // Mock initial notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'N-101',
      title: 'New High Score Lead Assigned',
      desc: 'Sourcing Lead "Priyanka Sharma" assigned with score 94/100.',
      time: '10 mins ago',
      unread: true,
      type: 'lead'
    },
    {
      id: 'N-102',
      title: 'Deal Value Revision',
      desc: 'Wayne Enterprises license contract expanded to ₹8,50,000.',
      time: '1 hour ago',
      unread: true,
      type: 'deal'
    },
    {
      id: 'N-103',
      title: 'Standard SLA Subscription Renewed',
      desc: 'Cognitive Solutions standard subscription renewed for 12 months.',
      time: '2 hours ago',
      unread: true,
      type: 'contract'
    },
    {
      id: 'N-104',
      title: 'System Auto-Backup Completed',
      desc: 'Durable Firestore local export completed. 248 records archived.',
      time: 'Yesterday',
      unread: false,
      type: 'system'
    },
    {
      id: 'N-105',
      title: 'Dormant Lead Alert',
      desc: 'Lead "Amit Patel" has been in contact stage for more than 5 days.',
      time: '2 days ago',
      unread: false,
      type: 'lead'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'lead' | 'deal' | 'contract' | 'system'>('all');
  const [visibleCount, setVisibleCount] = useState(4);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Notify parent of unread count updates
  const unreadCount = useMemo(() => {
    return notifications.filter(n => n.unread).length;
  }, [notifications]);

  useEffect(() => {
    if (onUnreadCountChange) {
      onUnreadCountChange(unreadCount);
    }
  }, [unreadCount, onUnreadCountChange]);

  // Handle live search and filter logic
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch = 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.desc.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      if (filterType === 'all') return true;
      if (filterType === 'unread') return n.unread;
      return n.type === filterType;
    });
  }, [notifications, searchQuery, filterType]);

  // Actions
  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    toast.success('Marked all notifications as read.');
  };

  const handleMarkSingleRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification removed.');
  };

  const handleClearAll = () => {
    if (confirm('Clear all notifications permanently?')) {
      setNotifications([]);
      toast.success('Notification board cleared.');
    }
  };

  // Infinite Scroll mock load more
  const handleLoadMore = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const historical: Notification[] = [
        {
          id: `N-${Math.floor(Math.random() * 900 + 200)}`,
          title: 'Contract SLA Term Checklist Executed',
          desc: 'Legal department auto-approved compliance questionnaire form.',
          time: '5 days ago',
          unread: false,
          type: 'contract'
        },
        {
          id: `N-${Math.floor(Math.random() * 900 + 200)}`,
          title: 'System Core Build Succeeded',
          desc: 'Production server deployed. Ingress routing to port 3000 verified.',
          time: '1 week ago',
          unread: false,
          type: 'system'
        }
      ];
      setNotifications(prev => [...prev, ...historical]);
      setVisibleCount(prev => prev + 2);
      setIsRefreshing(false);
      toast.info('Historical notifications loaded.');
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/30 dark:bg-slate-950/50 backdrop-blur-xs z-50 transition-opacity duration-300"
      />

      {/* Slide-out Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-200 dark:border-slate-850 z-50 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-150 dark:border-slate-850/60 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 relative">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono">
                System Alerts Board
              </h2>
              <p className="text-[10px] text-slate-450 font-mono font-bold">
                {unreadCount} UNREAD NOTIFICATIONS
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-450 hover:text-slate-650 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body - Controls & Filtering */}
        <div className="p-4 space-y-3 border-b border-slate-100 dark:border-slate-905">
          {/* Live Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search alert messages or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 text-xs text-slate-800 dark:text-slate-200 outline-none"
            />
          </div>

          {/* Type filters chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[10px] font-black uppercase font-mono">
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: 'Unread' },
              { id: 'lead', label: 'Leads' },
              { id: 'deal', label: 'Deals' },
              { id: 'contract', label: 'Contracts' },
              { id: 'system', label: 'System' }
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setFilterType(chip.id as any)}
                className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                  filterType === chip.id 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-slate-50/40 dark:bg-slate-900/20 text-slate-500 border-slate-200 dark:border-slate-800 hover:text-slate-750'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Quick operations */}
          <div className="flex justify-between items-center text-[10px] font-bold font-mono">
            <button 
              onClick={handleMarkAllRead}
              className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              ✓ MARK ALL AS READ
            </button>
            <button 
              onClick={handleClearAll}
              className="text-rose-500 hover:underline cursor-pointer"
            >
              ✕ CLEAR ALL BOARD
            </button>
          </div>
        </div>

        {/* Notifications List Content */}
        <div className="flex-grow overflow-y-auto p-4 space-y-3 text-left">
          {filteredNotifications.length > 0 ? (
            <>
              {filteredNotifications.slice(0, visibleCount).map((n) => (
                <div 
                  key={n.id}
                  onClick={() => handleMarkSingleRead(n.id)}
                  className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer text-xs space-y-1.5 relative group
                    ${n.unread 
                      ? 'bg-indigo-50/15 dark:bg-indigo-950/10 border-indigo-500/10 hover:border-indigo-500/20' 
                      : 'bg-white dark:bg-slate-950/40 border-slate-150 dark:border-slate-850/60 hover:bg-slate-50/20'}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-1.5">
                      {/* Icon per type */}
                      <span className={`p-1 rounded text-slate-500
                        ${n.type === 'lead' ? 'bg-indigo-500/10 text-indigo-500' : ''}
                        ${n.type === 'deal' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                        ${n.type === 'contract' ? 'bg-amber-500/10 text-amber-500' : ''}
                        ${n.type === 'system' ? 'bg-slate-500/10 text-slate-500' : ''}
                      `}>
                        {n.type === 'lead' && <UserPlus className="w-3.5 h-3.5" />}
                        {n.type === 'deal' && <Coins className="w-3.5 h-3.5" />}
                        {n.type === 'contract' && <FileCheck className="w-3.5 h-3.5" />}
                        {n.type === 'system' && <AlertCircle className="w-3.5 h-3.5" />}
                      </span>
                      <h4 className="font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wide font-mono text-[11px] truncate max-w-[200px]">
                        {n.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[9px] font-mono font-medium text-slate-400">{n.time}</span>
                      <button
                        onClick={(e) => handleDeleteNotification(n.id, e)}
                        className="p-1 rounded text-slate-400 hover:text-rose-500 cursor-pointer hidden group-hover:block"
                        title="Delete Alert"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 font-light leading-relaxed text-[11px]">
                    {n.desc}
                  </p>

                  <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest font-mono">
                    <span className={`px-1.5 py-0.5 rounded
                      ${n.type === 'lead' ? 'bg-indigo-500/10 text-indigo-500' : ''}
                      ${n.type === 'deal' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                      ${n.type === 'contract' ? 'bg-amber-500/10 text-amber-500' : ''}
                      ${n.type === 'system' ? 'bg-slate-500/10 text-slate-400' : ''}
                    `}>
                      {n.type} tag
                    </span>

                    {n.unread && (
                      <span className="text-emerald-500 animate-pulse flex items-center gap-1">
                        ● NEW ALERT
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* Load More simulator representing Infinite Scroll */}
              {visibleCount < filteredNotifications.length || filterType === 'all' ? (
                <button
                  onClick={handleLoadMore}
                  disabled={isRefreshing}
                  className="w-full py-2.5 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 border border-slate-200/50 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase font-mono tracking-wider cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isRefreshing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Loading historical logs...
                    </>
                  ) : (
                    <>
                      Load historical logs (Infinite Scroll)
                    </>
                  )}
                </button>
              ) : null}
            </>
          ) : (
            /* Empty State rendering */
            <div className="py-16 text-center space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mx-auto text-slate-400 border border-slate-100 dark:border-slate-800">
                <Inbox className="w-5 h-5 text-slate-400" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-350">No Alerts Recorded</p>
                <p className="text-[10px] text-slate-450 font-light max-w-xs mx-auto leading-relaxed">
                  Your communication node is perfectly caught up. No active warnings or lead allocations detected.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer info */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/10 text-center select-none">
          <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-widest">
            FIPS 140-2 Encrypted Notification Node
          </span>
        </div>

      </div>
    </>
  );
};
