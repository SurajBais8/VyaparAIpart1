/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useAuthStore();
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing secure gateway...');

  const texts = [
    'Initializing secure gateway...',
    'Loading enterprise configuration...',
    'Checking compliance standards...',
    'Structuring encrypted workspaces...',
    'Establishing communication node...',
    'Portal ready!',
  ];

  useEffect(() => {
    // Dynamically update text based on progress
    const textInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1.25;
        if (next >= 100) {
          clearInterval(textInterval);
          return 100;
        }

        // Change text based on ranges
        const idx = Math.min(Math.floor((next / 100) * texts.length), texts.length - 1);
        setLoadingText(texts[idx]);

        return next;
      });
    }, 40);

    return () => clearInterval(textInterval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        // If user is already authenticated but onboarding is pending, go to onboarding.
        // Otherwise, go to welcome.
        const user = useAuthStore.getState().user;
        const auth = useAuthStore.getState().isAuthenticated;
        if (auth) {
          if (user?.onboardingCompleted) {
            navigate('/dashboard');
          } else {
            navigate('/onboarding');
          }
        } else {
          navigate('/welcome');
        }
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [progress, navigate]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between items-center bg-slate-950 p-8 select-none overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] max-w-[600px] max-h-[600px] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top Margin Spacer */}
      <div />

      {/* Logo & Content */}
      <div className="flex flex-col items-center max-w-sm w-full text-center space-y-7 z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, filter: 'drop-shadow(0 0 25px rgba(99,102,241,0.45))' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center border border-indigo-400/30"
        >
          <span className="text-white text-4xl font-black italic tracking-tighter">C</span>
        </motion.div>

        <div className="space-y-2">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-black text-white tracking-tight"
          >
            CoreSaaS Portal
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.4 }}
            className="text-xs text-slate-400 font-mono"
          >
            IDENTITY & MANAGEMENT SUITE
          </motion.p>
        </div>

        {/* Custom Progress Ring or Bar */}
        <div className="w-full space-y-3.5">
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-900/40">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <motion.p
            key={loadingText}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-slate-400 font-medium font-mono min-h-[16px] select-none"
          >
            {loadingText}
          </motion.p>
        </div>
      </div>

      {/* Footer Version Details */}
      <div className="flex flex-col items-center space-y-1.5 z-10">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 tracking-wider font-semibold uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
          <span>FIPS 140-2 Compliant Gateway</span>
        </div>
        <span className="text-[10px] text-slate-600 font-mono">
          VERSION 1.0.4-LTS • ENCRYPTION ACTIVE
        </span>
      </div>
    </div>
  );
};
