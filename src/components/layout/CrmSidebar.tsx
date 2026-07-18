/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOnboardingStore } from '../../store/onboardingStore';
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  LineChart,
  Users2,
  GitBranch,
  Building2,
  Contact2,
  Coins,
  Activity,
  Files,
  Sparkles,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';

export const CrmSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { businessInfo } = useOnboardingStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeBusinessName = businessInfo.businessName || "SaaS Enterprise";

  const mainMenu = [
    { title: 'Overview', path: '/dashboard/overview', icon: <TrendingUp className="w-4 h-4" /> },
    { title: 'Revenue Analytics', path: '/dashboard/revenue', icon: <Coins className="w-4 h-4" /> },
    { title: 'Order Fulfilment', path: '/dashboard/orders', icon: <Activity className="w-4 h-4" /> },
    { title: 'Customer Growth', path: '/dashboard/customers', icon: <Users2 className="w-4 h-4" /> },
    { title: 'Sourcing & Leads', path: '/dashboard/leads', icon: <GitBranch className="w-4 h-4" /> },
    { title: 'Performance Reports', path: '/dashboard/reports', icon: <Files className="w-4 h-4" /> },
  ];

  const crmMenu = [
    { title: 'Customers Directory', path: '/crm/customers', icon: <Users2 className="w-4 h-4" /> },
    { title: 'Leads Pipeline', path: '/crm/leads', icon: <GitBranch className="w-4 h-4" /> },
    { title: 'Companies Ledger', path: '/crm/companies', icon: <Building2 className="w-4 h-4" /> },
    { title: 'Contacts Directory', path: '/crm/contacts', icon: <Contact2 className="w-4 h-4" /> },
    { title: 'Deals Board', path: '/crm/deals', icon: <Coins className="w-4 h-4" /> },
    { title: 'Activities Stream', path: '/crm/activities', icon: <Activity className="w-4 h-4" /> },
    { title: 'Conversion Analytics', path: '/crm/analytics', icon: <LineChart className="w-4 h-4" /> },
    { title: 'Export Reports', path: '/crm/reports', icon: <Files className="w-4 h-4" /> },
  ];

  const renderNavGroup = (items: typeof mainMenu, groupTitle?: string) => {
    return (
      <div className="space-y-1.5 select-none">
        {groupTitle && !isCollapsed && (
          <span className="block px-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono text-left">
            {groupTitle}
          </span>
        )}
        <div className="space-y-1">
          {items.map((item) => {
            // Match active path
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <button
                key={item.title}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left
                  ${isActive
                    ? 'bg-gradient-to-r from-indigo-500/10 to-violet-500/5 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10'
                    : 'text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent'}`}
                title={isCollapsed ? item.title : undefined}
              >
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110 text-indigo-500' : 'text-slate-400 dark:text-slate-500'}`}>
                  {item.icon}
                </div>
                {!isCollapsed && <span className="truncate">{item.title}</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <aside
      className={`h-screen border-r border-slate-200/50 dark:border-slate-850 bg-white/70 dark:bg-slate-950/75 backdrop-blur-md flex flex-col justify-between transition-all duration-300 sticky top-0 z-30 relative
        ${isCollapsed ? 'w-18' : 'w-64'}`}
    >
      {/* Brand & Logo */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-850">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold flex items-center justify-center shadow-lg shadow-indigo-600/10 flex-shrink-0">
              {activeBusinessName[0].toUpperCase()}
            </div>
            {!isCollapsed && (
              <span className="text-xs font-black text-slate-800 dark:text-slate-100 tracking-wider font-mono truncate uppercase">
                {activeBusinessName}
              </span>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg border border-slate-100 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Menus */}
        <div className="p-4 space-y-6 flex-grow overflow-y-auto max-h-[calc(100vh-140px)]">
          {renderNavGroup(mainMenu, 'Executive')}
          {renderNavGroup(crmMenu, 'CRM Operations')}
        </div>
      </div>

      {/* Footer Sparkle Brand Credit */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2 select-none text-left">
          <Sparkles className="w-4 h-4 text-indigo-500 animate-spin-slow" />
          <div>
            <span className="block text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400 font-mono">Consolidated Engine</span>
            <span className="text-[8px] text-slate-400 font-mono font-bold">V2.4 SaaS Platform</span>
          </div>
        </div>
      )}
    </aside>
  );
};
