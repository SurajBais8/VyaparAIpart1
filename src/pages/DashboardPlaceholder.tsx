/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/ui';
import {
  Sparkles,
  Building,
  CreditCard,
  Users,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Smartphone,
  Globe
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useOnboardingStore } from '../store/onboardingStore';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { ThemeToggle } from '../components/ThemeToggle';
import { LanguageSelector } from '../components/LanguageSelector';

export const DashboardPlaceholder: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { businessInfo, companyInfo, logoUrl, bankDetails, teamInvites, resetOnboarding } = useOnboardingStore();

  const handleLogout = () => {
    logout();
    resetOnboarding();
    toast.success('Session terminated successfully!', {
      description: 'Encrypted storage cache cleared.',
    });
    navigate('/welcome');
  };

  const businessName = businessInfo.businessName || 'Your Enterprise';
  const representativeName = user ? `${user.firstName || 'John'} ${user.lastName || 'Doe'}` : 'Representative';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      
      {/* Navigation Top Bar */}
      <header className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-900/50 px-6 py-4 flex justify-between items-center sticky top-0 z-45">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-base">C</span>
          </div>
          <span className="font-bold text-base bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-350 bg-clip-text text-transparent">
            {businessName}
          </span>
          <span className="text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 rounded-md px-1.5 py-0.5 uppercase tracking-wider font-mono">
            Portal Sandbox
          </span>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector />
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl border border-red-200 dark:border-red-950/50 bg-red-50/10 dark:bg-red-950/10 hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-all duration-300 cursor-pointer text-xs font-semibold flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-grow max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-8 text-left">
        
        {/* Welcome Hero Panel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-950 border border-slate-200/10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl"
        >
          {/* Glowing blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-indigo-600/15 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-44 h-44 rounded-full bg-violet-600/10 blur-[80px] pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-bold uppercase tracking-widest font-mono">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>Workspace Initiated</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome, {representativeName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed max-w-lg">
              Enterprise parameters have been successfully structured and synchronized. Your custom secure gateway is fully active.
            </p>
          </div>

          <div className="flex-shrink-0 relative z-10 self-stretch sm:self-center flex items-center justify-center">
            {logoUrl ? (
              <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 dark:border-slate-800 p-2.5 flex items-center justify-center shadow-2xl">
                <img referrerPolicy="no-referrer" src={logoUrl} alt="Onboarded corporate logo" className="max-w-full max-h-full object-contain" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-2xl">
                <Building className="w-8 h-8" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Dynamic Data Synchronization Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Business Parameters */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card variant="glass" className="p-5 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Profile Details</span>
                  <Building className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate">{businessName}</h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono space-y-1">
                    <p className="flex justify-between border-b border-slate-100 dark:border-slate-900 pb-1">
                      <span>GST:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{businessInfo.gstNumber || 'SIMULATED_GST'}</span>
                    </p>
                    <p className="flex justify-between border-b border-slate-100 dark:border-slate-900 pb-1">
                      <span>Type:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{businessInfo.businessType || 'SaaS'}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{companyInfo.city || 'Not Provided'}</span>
                    </p>
                  </div>
                </div>
              </div>
              <span className="inline-flex self-start px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-mono">
                LEGAL VERIFIED
              </span>
            </Card>
          </motion.div>

          {/* Card 2: Financial Routing */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Card variant="glass" className="p-5 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Settlement Route</span>
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate">
                    {bankDetails.accountName ? 'Clearing Channel Active' : 'No Bank Profile'}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono space-y-1">
                    <p className="flex justify-between border-b border-slate-100 dark:border-slate-900 pb-1">
                      <span>Account No:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {bankDetails.accountNumber ? `•••• ${bankDetails.accountNumber.slice(-4)}` : 'SIMULATED'}
                      </span>
                    </p>
                    <p className="flex justify-between border-b border-slate-100 dark:border-slate-900 pb-1">
                      <span>IFSC Code:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{bankDetails.ifsc || 'SIMULATED'}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>UPI Alias:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{bankDetails.upiId || 'Not Setup'}</span>
                    </p>
                  </div>
                </div>
              </div>
              <span className="inline-flex self-start px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-mono">
                SECURE HANDSHAKE
              </span>
            </Card>
          </motion.div>

          {/* Card 3: Team Delegations */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card variant="glass" className="p-5 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Access Delegations</span>
                  <Users className="w-4 h-4 text-violet-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    {teamInvites.length} Pending Invites
                  </h3>
                  <div className="space-y-1 max-h-[80px] overflow-y-auto pr-1">
                    {teamInvites.length > 0 ? (
                      teamInvites.map((invite) => (
                        <div key={invite.email} className="flex justify-between text-[10px] text-slate-500 font-mono py-0.5 border-b border-slate-50 dark:border-slate-900/60 last:border-0 truncate">
                          <span className="truncate max-w-[110px]">{invite.email}</span>
                          <span className="font-bold text-violet-500 uppercase">{invite.role}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No team invites scheduled.</p>
                    )}
                  </div>
                </div>
              </div>
              <span className="inline-flex self-start px-2 py-0.5 rounded-full text-[9px] font-bold bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 uppercase tracking-wider font-mono">
                ROLE DELEGATED
              </span>
            </Card>
          </motion.div>
        </div>

        {/* Module 2 Announcement Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <Card variant="glass" className="p-6 border border-indigo-100/30 dark:border-indigo-950/30 bg-gradient-to-br from-indigo-50/10 to-transparent relative overflow-hidden">
            <div className="absolute top-[-100%] right-[-10%] w-72 h-72 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="space-y-2 text-left">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/30">
                  DEVELOPER ROADMAP
                </div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Module 2 — CRM & Team Role Matrices
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed max-w-xl">
                  Next module unlocks the global CRM ledger, dynamic team role permission matrices, real-time activity logs, and integrated billing widgets. Standard API routes are pre-configured.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center p-4 px-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-250/20 shadow-xs flex-shrink-0 self-stretch sm:self-auto text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">STATUS</span>
                <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 mt-0.5">COMING SOON</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* System telemetry line */}
        <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-600 font-mono pt-4 border-t border-slate-250/10">
          <span>PORTAL_SECURITY: SIGNED_STATE_ENCRYPTED</span>
          <span>© 2026 CORESAAS INC.</span>
        </div>

      </main>
    </div>
  );
};
