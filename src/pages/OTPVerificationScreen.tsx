/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button, OTPInput, Card } from '../components/ui';
import { ArrowLeft, Clock, ShieldCheck, Mail, Phone, Info, PhoneCall } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { TRANSLATIONS } from '../constants/languages';
import { toast } from 'sonner';
import { motion, AnimatePresence, useAnimation } from 'motion/react';

export const OTPVerificationScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language, login, tempEmail, tempPhone } = useAuthStore();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Flow meta: register, phone (login with phone), forgot (forgot-password reset)
  const flowType = searchParams.get('type') || 'register';
  const queryEmail = searchParams.get('email') || tempEmail || 'user@enterprise.com';
  const queryFirstName = searchParams.get('first') || 'Enterprise';
  const queryLastName = searchParams.get('last') || 'User';

  const [otpValue, setOtpValue] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Timer states
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Framer motion controls for shake animation
  const controls = useAnimation();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const shakeError = async () => {
    await controls.start({
      x: [-10, 10, -10, 10, -5, 5, 0],
      transition: { duration: 0.4, ease: 'easeInOut' },
    });
  };

  const handleVerify = (customOtp?: string) => {
    const finalOtp = customOtp !== undefined ? customOtp : otpValue;
    if (finalOtp.length < 6) {
      setError('Please enter the full 6-digit verification code.');
      shakeError();
      return;
    }

    // Optional error demo simulation
    if (finalOtp === '000000') {
      setError('Simulated security failure: This OTP code has expired.');
      shakeError();
      toast.error('Verification failed', {
        description: 'Incorrect or expired security passcode',
      });
      return;
    }

    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // Play a quick delay for the beautiful green tick check animation
      setTimeout(() => {
        if (flowType === 'register') {
          // Log user in
          login(queryEmail, queryFirstName, queryLastName);
          toast.success('Registration verified successfully!', {
            description: `Session initiated for ${queryEmail}`,
          });
          navigate('/onboarding');
        } else if (flowType === 'phone') {
          login('mobile.user@enterprise.com', 'Mobile', 'User');
          toast.success('Mobile authenticated successfully!', {
            description: `Logged in via OTP authorization`,
          });
          navigate('/onboarding');
        } else if (flowType === 'forgot') {
          toast.success('OTP security handshake verified!', {
            description: 'Proceeding to credential reset gateway',
          });
          navigate('/reset-password');
        }
      }, 1500);
    }, 1100);
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtpValue('');
    setError('');
    setCountdown(30);
    setCanResend(false);

    toast.success('Simulated security broadcast transmitted!', {
      description: `A fresh 6-digit verification pin was sent successfully.`,
    });
  };

  const handleVoiceCallOtp = () => {
    toast.success('Simulated text-to-speech call dispatched!', {
      description: 'You will receive an automated voice call dictating your OTP within 60 seconds.',
    });
  };

  const handleAutoPaste = () => {
    const code = '123456';
    setOtpValue(code);
    toast.success('Simulated OTP auto-fill applied!', {
      description: 'Handshake token "123456" successfully loaded.',
    });
    // Trigger auto verification
    setTimeout(() => {
      handleVerify(code);
    }, 400);
  };

  // Automatically trigger verification once 6 digits are fully typed
  useEffect(() => {
    if (otpValue.length === 6) {
      handleVerify();
    }
  }, [otpValue]);

  // Countdown circle specs
  const radius = 14;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (countdown / 30) * circumference;

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-2">
        <Link
          to={flowType === 'forgot' ? '/forgot-password' : '/login'}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {t.otpTitle}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
          {t.otpDescription}
        </p>
      </div>

      {/* Target summary badge */}
      <div className="p-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 flex justify-between items-center gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          {flowType === 'phone' ? (
            <>
              <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-200">
                +91 {tempPhone || 'XXXXX XXXXX'}
              </span>
            </>
          ) : (
            <>
              <Mail className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-200 truncate">
                {queryEmail}
              </span>
            </>
          )}
        </div>

        {/* Dynamic Countdown Circle */}
        <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="18"
              cy="18"
              r={radius}
              className="text-slate-200 dark:text-slate-800"
              strokeWidth={strokeWidth}
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="18"
              cy="18"
              r={radius}
              className="text-indigo-600 dark:text-indigo-400 transition-all duration-1000"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <span className="absolute text-[10px] font-bold font-mono text-slate-600 dark:text-slate-300">
            {countdown}
          </span>
        </div>
      </div>

      {/* Main interactive state container */}
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="otp-form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            {/* OTP 6-Digit input grids wrapped with shake error */}
            <motion.div animate={controls}>
              <OTPInput value={otpValue} onChange={setOtpValue} error={error} />
            </motion.div>

            {/* Sandbox OTP Suggestion Info */}
            <Card variant="info" className="text-xs p-3.5 flex flex-col gap-2 border-blue-100 dark:border-blue-950/40">
              <div className="flex gap-2.5">
                <Info className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-indigo-900 dark:text-indigo-350">Quick OTP Handshake</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Enter any 6 digits (e.g. <span className="font-bold font-mono text-slate-700 dark:text-slate-200">123456</span>) to bypass, or enter <span className="font-bold font-mono text-red-500">000000</span> to test error handling & shake feedback.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAutoPaste}
                className="w-full mt-1 px-3 py-2 text-center bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-900/40 rounded-xl text-[11px] font-bold text-indigo-700 dark:text-indigo-300 cursor-pointer transition-all duration-300"
              >
                ⚡ Simulated Auto-Paste Code ("123456")
              </button>
            </Card>

            {/* Timer or Resend Row */}
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5" />
                {countdown > 0 ? (
                  <span>Resend in {countdown}s</span>
                ) : (
                  <span className="text-emerald-500 font-semibold">Resend available</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleVoiceCallOtp}
                  className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-slate-400" /> Voice Call
                </button>
                <span className="text-slate-200 dark:text-slate-800">|</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend}
                  className={`font-semibold transition-colors duration-200
                    ${canResend 
                      ? 'text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer' 
                      : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'}`}
                >
                  {t.resend}
                </button>
              </div>
            </div>

            {/* Action Verify button */}
            <Button
              onClick={() => handleVerify()}
              isLoading={isLoading}
              className="w-full"
            >
              Verify OTP Code
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="otp-success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-10 flex flex-col items-center justify-center text-center space-y-4"
          >
            {/* Animated Success Check SVG */}
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
                    stroke="currentColor"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping pointer-events-none" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Handshake Complete</h3>
              <p className="text-xs text-slate-400 font-light">Secure token verified successfully. Access authorized.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
