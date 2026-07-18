/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { ShieldCheck, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { TRANSLATIONS } from '../constants/languages';
import { motion } from 'motion/react';
import { Dialog } from './ui';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { language } = useAuthStore();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const location = useLocation();
  const path = location.pathname;

  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'support' | 'help' | null>(null);

  // Map sub-routes of auth flow to active steps:
  // /welcome is Step 1, /login & /register & /forgot-password & /reset-password are Step 2, /otp is Step 3
  const isStepActive = (stepNum: number) => {
    if (stepNum === 1) return path === '/welcome';
    if (stepNum === 2) return ['/login', '/register', '/forgot-password', '/reset-password'].includes(path);
    if (stepNum === 3) return path === '/otp';
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 px-4 sm:px-6 py-3.5 flex justify-between items-center">
        <div className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-extrabold text-base">C</span>
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-350 bg-clip-text text-transparent">
            SaaS.Engine
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <LanguageSelector />
          <ThemeToggle />
          <button
            onClick={() => setActiveModal('help')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1 shadow-xs"
          >
            <HelpCircle className="w-4 h-4 text-indigo-500" />
            <span className="hidden sm:inline">Help</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow flex">
        {/* Left Side: Brand & Progress Indicator - Sleek Theme Layout */}
        <div className="hidden lg:flex lg:w-[400px] bg-indigo-950 flex-shrink-0 flex-col justify-between p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-800/20 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/50">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <span className="text-xl font-bold tracking-tight">SaaS.Engine</span>
            </div>

            <div className="space-y-8 text-left">
              <h1 className="text-4xl font-bold leading-tight">Build your enterprise <span className="text-indigo-400">foundation</span>.</h1>
              <p className="text-indigo-200/70 text-lg leading-relaxed font-light">Module 1: Complete Authentication & Onboarding system ready for production.</p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="space-y-6 text-left">
              {/* Step 1: Authentication */}
              <div className={`flex items-center gap-4 transition-opacity duration-300 ${isStepActive(1) ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isStepActive(1) ? 'bg-indigo-500 text-white' : 'border-2 border-indigo-400/30 text-indigo-200'}`}>01</div>
                <span className="text-sm font-medium">Gateway Portal</span>
              </div>
              
              {/* Step 2: Business Setup */}
              <div className={`flex items-center gap-4 transition-opacity duration-300 ${isStepActive(2) ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isStepActive(2) ? 'bg-indigo-500 text-white' : 'border-2 border-indigo-400/30 text-indigo-200'}`}>02</div>
                <span className="text-sm font-medium">Identity Profiles</span>
              </div>

              {/* Step 3: Team Invitation */}
              <div className={`flex items-center gap-4 transition-opacity duration-300 ${isStepActive(3) ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isStepActive(3) ? 'bg-indigo-500 text-white' : 'border-2 border-indigo-400/30 text-indigo-200'}`}>03</div>
                <span className="text-sm font-medium">Security Validation</span>
              </div>

              {/* Step 4: Ready to Launch */}
              <div className={`flex items-center gap-4 opacity-40`}>
                <div className="w-8 h-8 rounded-full border-2 border-indigo-400/30 flex items-center justify-center text-xs font-bold text-indigo-200">04</div>
                <span className="text-sm font-medium">Enterprise Portal</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-indigo-400 font-mono text-left">
            SYSTEM VERSION 1.0.4-BETA // MODULE_1_CORE
          </div>
        </div>

        {/* Right Side: Flexible, Fully Responsive Auth Forms Card Container */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 sm:px-12 py-10 relative overflow-hidden">
          {/* Subtle decoration behind content for mobile */}
          <div className="absolute top-10 right-10 w-44 h-44 rounded-full bg-indigo-500/5 blur-[80px] lg:hidden pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-44 h-44 rounded-full bg-violet-500/5 blur-[80px] lg:hidden pointer-events-none" />

          <main className="w-full max-w-md relative z-10">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Footer */}
      <footer className="lg:hidden bg-white dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-850/50 py-6 px-4 text-center space-y-3.5">
        <div className="flex justify-center gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
          <button onClick={() => setActiveModal('privacy')} className="hover:text-indigo-600 transition-colors cursor-pointer">Privacy Policy</button>
          <button onClick={() => setActiveModal('terms')} className="hover:text-indigo-600 transition-colors cursor-pointer">Terms of Service</button>
          <button onClick={() => setActiveModal('support')} className="hover:text-indigo-600 transition-colors cursor-pointer">Support Help</button>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          © 2026 CoreSaaS Inc. • Version 1.0.4-LTS
        </p>
      </footer>

      {/* Desktop Quick Footer Utilities */}
      <footer className="hidden lg:block bg-white dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-900 px-12 py-4 flex justify-between items-center">
        <div className="flex gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
          <button onClick={() => setActiveModal('privacy')} className="hover:text-indigo-600 transition-colors cursor-pointer">Privacy Policy</button>
          <button onClick={() => setActiveModal('terms')} className="hover:text-indigo-600 transition-colors cursor-pointer">Terms & Conditions</button>
          <button onClick={() => setActiveModal('support')} className="hover:text-indigo-600 transition-colors cursor-pointer">Support Portal</button>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          CoreSaaS v1.0.4 • SOC-2 Certified • HIPAA Compliant
        </p>
      </footer>

      {/* Info Dialogs */}
      <Dialog
        isOpen={activeModal === 'privacy'}
        onClose={() => setActiveModal(null)}
        title="Privacy Policy"
        description="Our privacy standards adhere to GDPR and SOC-2 guidelines. We do not sell or share any company identifiers, transactional histories, or personnel records. All locally persistent tokens are cryptographic-grade."
        type="confirm"
        confirmLabel="I understand"
        onConfirm={() => setActiveModal(null)}
      />

      <Dialog
        isOpen={activeModal === 'terms'}
        onClose={() => setActiveModal(null)}
        title="Terms & Conditions"
        description="By utilizing our Identity & Business Setup module, you agree to comply with enterprise-level fair use guidelines. Simulated accounts are strictly restricted to testing and sandboxed verification."
        type="confirm"
        confirmLabel="Agree & Accept"
        onConfirm={() => setActiveModal(null)}
      />

      <Dialog
        isOpen={activeModal === 'support'}
        onClose={() => setActiveModal(null)}
        title="Enterprise Support Portal"
        description="If you experience any difficulties during simulated registration or OTP delivery, please access our priority desk. Our engineers are online to assist with authentication handshakes."
        type="confirm"
        confirmLabel="Open Desk"
        onConfirm={() => setActiveModal(null)}
      />

      <Dialog
        isOpen={activeModal === 'help'}
        onClose={() => setActiveModal(null)}
        title="Identity & Setup Assistance"
        description="To walk through the full SaaS workflow in this mockup, use any email/password. In the registration flow, clicking 'Send OTP' sends a simulated verification code. In OTP validation, you can type any 6 digits to verify."
        type="confirm"
        confirmLabel="Get Started"
        onConfirm={() => setActiveModal(null)}
      />
    </div>
  );
};
