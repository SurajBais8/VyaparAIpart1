/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import { Mail, Phone, Flame, Shield, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { TRANSLATIONS } from '../constants/languages';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { language, login } = useAuthStore();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleGoogleLogin = () => {
    login('google.user@enterprise.com', 'Google', 'User');
    toast.success('Successfully authenticated via Google Sandbox!', {
      description: 'Logged in as google.user@enterprise.com',
    });
    navigate('/onboarding');
  };

  const handleMicrosoftLogin = () => {
    toast.info('Microsoft OAuth Handshake Simulated!', {
      description: 'Federated credentials are ready for integration.',
    });
  };

  const handlePhoneLogin = () => {
    navigate('/login?mode=phone');
  };

  return (
    <div className="space-y-8 py-4">
      {/* Brand & Tagline */}
      <div className="text-center space-y-3.5">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 mb-2"
        >
          <Flame className="w-7 h-7" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-black text-slate-900 dark:text-white tracking-tight"
        >
          {t.welcome}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto leading-relaxed"
        >
          {t.tagline}
        </motion.p>
      </div>

      {/* Decorative Interactive Illustration Widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <Card variant="glass" className="p-5 flex items-center justify-between gap-4 border border-indigo-100/30 dark:border-indigo-950/30 bg-gradient-to-br from-white/90 to-slate-50/50 dark:from-slate-950/90 dark:to-slate-900/50">
          <div className="flex gap-3 items-center">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex-shrink-0 border border-indigo-100/20 dark:border-indigo-900/20">
              <Shield className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Local Sandbox Mode</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">AUTH_STORE: REDUX_FREE</p>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/20">
            ONLINE
          </span>
        </Card>
      </motion.div>

      {/* Auth Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-3"
      >
        <Button
          variant="primary"
          onClick={() => navigate('/login')}
          className="w-full justify-between"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {t.login}
        </Button>

        <Button
          variant="outline"
          onClick={() => navigate('/register')}
          className="w-full"
        >
          {t.register}
        </Button>
      </motion.div>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
        </div>
        <span className="relative px-3 bg-slate-50 dark:bg-slate-950 text-xs font-semibold uppercase text-slate-400 dark:text-slate-550">
          {t.or}
        </span>
      </div>

      {/* Third Party OAuth Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-3"
      >
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer transition-all duration-300 shadow-xs"
        >
          {/* Google SVG Icon */}
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.96 1 12 1 7.35 1 3.4 3.65 1.51 7.54l3.74 2.9C6.12 7.06 8.84 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.51h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.67 2.84c2.14-1.97 3.38-4.88 3.38-8.55z"
            />
            <path
              fill="#FBBC05"
              d="M5.25 10.44c-.25-.75-.39-1.55-.39-2.39s.14-1.64.39-2.39L1.51 2.76C.54 4.7.01 6.89.01 9.15c0 2.26.53 4.45 1.5 6.39l3.74-3.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.67-2.84c-1.1.74-2.5 1.18-4.29 1.18-3.16 0-5.88-2.02-6.84-5.4l-3.74 2.9C3.4 20.35 7.35 23 12 23z"
            />
          </svg>
          {t.googleLogin}
        </button>

        <button
          onClick={handleMicrosoftLogin}
          className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer transition-all duration-300 shadow-xs"
        >
          {/* Microsoft SVG Icon */}
          <svg className="w-4 h-4 mr-1" viewBox="0 0 23 23">
            <path fill="#f35325" d="M0 0h11v11H0z" />
            <path fill="#80bb0a" d="M12 0h11v11H12z" />
            <path fill="#00a1f1" d="M0 12h11v11H0z" />
            <path fill="#ffb900" d="M12 12h11v11H12z" />
          </svg>
          {t.msLogin}
        </button>

        <button
          onClick={handlePhoneLogin}
          className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer transition-all duration-300 shadow-xs"
        >
          <Phone className="w-4 h-4 text-emerald-500 mr-1" />
          {t.phoneLogin}
        </button>
      </motion.div>
    </div>
  );
};
