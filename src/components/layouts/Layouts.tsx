/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ThemeToggle } from '../ThemeToggle';
import { LanguageSelector } from '../LanguageSelector';
import { APP_CONFIG } from '../../config/app.config';

// GuestLayout: Centered responsive card container for simpler operations
export const GuestLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 transition-colors duration-300 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

      {/* Floating control buttons */}
      <div className="absolute top-4 right-4 flex items-center gap-2.5 z-50">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 text-left"
      >
        <div className="flex items-center gap-2.5 mb-6 justify-center">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-extrabold text-sm">S</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-100">
            {APP_CONFIG.name}
          </span>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

// OnboardingLayout: Full width structured layout with a stepper container at the top
export const OnboardingLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      {/* Top Bar */}
      <header className="h-16 border-b border-slate-200/40 dark:border-slate-900/60 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md px-6 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-extrabold text-sm">S</span>
          </div>
          <span className="font-bold text-base tracking-tight text-slate-800 dark:text-slate-100">
            {APP_CONFIG.name}
          </span>
          <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-md font-mono">
            SETUP
          </span>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </header>

      {/* Workspace Frame */}
      <div className="flex-grow flex flex-col justify-center max-w-4xl w-full mx-auto p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/50 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

// MinimalLayout: Absolute minimalist setup for system notices, alerts, and errors
export const MinimalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-center items-center p-6 text-center select-none relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 max-w-sm"
      >
        {children}
      </motion.div>
    </div>
  );
};
