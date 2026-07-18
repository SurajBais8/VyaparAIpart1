/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card } from '../components/ui';
import { Lock, Check, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { TRANSLATIONS } from '../constants/languages';
import { toast } from 'sonner';
import { motion, AnimatePresence, useAnimation } from 'motion/react';

export const ResetPasswordScreen: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useAuthStore();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [strength, setStrength] = useState({
    score: 0,
    hasLength: false,
    hasUpper: false,
    hasNumber: false,
    hasSpecial: false,
  });

  useEffect(() => {
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    let score = 0;
    if (hasLength) score += 1;
    if (hasUpper) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecial) score += 1;

    setStrength({ score, hasLength, hasUpper, hasNumber, hasSpecial });
  }, [password]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const controls = useAnimation();

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      controls.start({
        x: [-10, 10, -10, 10, -5, 5, 0],
        transition: { duration: 0.4 },
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      toast.success('Credentials updated successfully!', {
        description: 'New security parameters synchronized.',
      });

      // Redirect to login page after delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }, 1200);
  };

  const getStrengthLabel = () => {
    switch (strength.score) {
      case 0:
      case 1:
        return { text: 'Weak', color: 'bg-red-500' };
      case 2:
      case 3:
        return { text: 'Medium', color: 'bg-amber-500' };
      case 4:
        return { text: 'Strong Enterprise Compliant', color: 'bg-emerald-500' };
      default:
        return { text: 'Weak', color: 'bg-red-500' };
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Reset Gateway Password
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
          Establish fresh, compliant security credentials to unlock your workspace.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="reset-form"
            onSubmit={handleReset}
            animate={controls}
            className="space-y-4"
          >
            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={<Lock className="w-4 h-4" />}
            />

            {/* Password strength details */}
            {password && (
              <Card variant="glass" className="p-4 border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-500 dark:text-slate-400">Strength Audit:</span>
                  <span className={`font-semibold text-white px-2 py-0.5 rounded-md text-[10px] ${getStrengthLabel().color}`}>
                    {getStrengthLabel().text}
                  </span>
                </div>
                
                {/* Strength gauge */}
                <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5 mb-3">
                  <div className={`h-full flex-grow ${strength.score >= 1 ? getStrengthLabel().color : 'bg-transparent'}`} />
                  <div className={`h-full flex-grow ${strength.score >= 2 ? getStrengthLabel().color : 'bg-transparent'}`} />
                  <div className={`h-full flex-grow ${strength.score >= 3 ? getStrengthLabel().color : 'bg-transparent'}`} />
                  <div className={`h-full flex-grow ${strength.score >= 4 ? getStrengthLabel().color : 'bg-transparent'}`} />
                </div>

                {/* Checklist requirements */}
                <ul className="text-[11px] grid grid-cols-2 gap-1.5 text-slate-500 dark:text-slate-400 font-mono">
                  <li className="flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center border text-[9px]
                      ${strength.hasLength ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'border-slate-300 dark:border-slate-700'}`}>
                      {strength.hasLength ? <Check className="w-3 h-3" /> : '•'}
                    </span>
                    Min 8 Characters
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center border text-[9px]
                      ${strength.hasUpper ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'border-slate-300 dark:border-slate-700'}`}>
                      {strength.hasUpper ? <Check className="w-3 h-3" /> : '•'}
                    </span>
                    1 Uppercase
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center border text-[9px]
                      ${strength.hasNumber ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'border-slate-300 dark:border-slate-700'}`}>
                      {strength.hasNumber ? <Check className="w-3 h-3" /> : '•'}
                    </span>
                    1 Number
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center border text-[9px]
                      ${strength.hasSpecial ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'border-slate-300 dark:border-slate-700'}`}>
                      {strength.hasSpecial ? <Check className="w-3 h-3" /> : '•'}
                    </span>
                    1 Special Char
                  </li>
                </ul>
              </Card>
            )}

            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              icon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              Update Password
            </Button>
          </motion.form>
        ) : (
          <motion.div
            key="reset-success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-10 flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center border border-emerald-500/20"
              >
                <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.2, duration: 0.45 }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping pointer-events-none" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Setup Successful</h3>
              <p className="text-xs text-slate-400 font-light">Your portal access has been reset. Redirecting to login...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
