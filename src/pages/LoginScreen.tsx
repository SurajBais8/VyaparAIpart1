/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button, Input, Card } from '../components/ui';
import { Mail, Lock, Phone, ArrowLeft, ShieldAlert, ShieldCheck, Cpu, History, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { TRANSLATIONS } from '../constants/languages';
import { toast } from 'sonner';
import { motion, useAnimation, AnimatePresence } from 'motion/react';
import { authService } from '../services/auth.service';
import { helpers } from '../utils/helpers';
import { dateUtils } from '../utils/date';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language, login, rememberMe, setRememberMe, setTempEmail, setTempPhone } = useAuthStore();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const initialMode = searchParams.get('mode') === 'phone' ? 'phone' : 'email';
  const [loginMode, setLoginMode] = useState<'email' | 'phone'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // Advanced features states
  const [isCapsLockActive, setIsCapsLockActive] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: 'Enter a password' });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [trustedBrowser, setTrustedBrowser] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [deviceInfo, setDeviceInfo] = useState({ os: 'Detecting...', browser: 'Detecting...' });

  const [errors, setErrors] = useState<{ email?: string; password?: string; phone?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Animation controller for error shake
  const controls = useAnimation();

  useEffect(() => {
    setDeviceInfo(helpers.getDeviceDetails());
    authService.getLoginHistory().then((data) => setLoginHistory(data));
    
    const modeParam = searchParams.get('mode');
    if (modeParam === 'phone') {
      setLoginMode('phone');
    } else {
      setLoginMode('email');
    }
  }, [searchParams]);

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    setPasswordStrength(authService.calculatePasswordStrength(val));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    setIsCapsLockActive(authService.checkCapsLock(e));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (loginMode === 'email') {
      if (!email) {
        newErrors.email = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    } else {
      if (!phone) {
        newErrors.phone = 'Mobile number is required';
      } else if (phone.length < 10) {
        newErrors.phone = 'Please enter a valid 10-digit mobile number';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const shakeError = async () => {
    await controls.start({
      x: [-10, 10, -10, 10, -5, 5, 0],
      transition: { duration: 0.4, ease: 'easeInOut' },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      shakeError();
      return;
    }

    setIsLoading(true);
    // Simulate API request delay
    setTimeout(() => {
      setIsLoading(false);
      
      if (loginMode === 'email') {
        // Mock valid credential credentials
        if (email.toLowerCase() === 'admin@coresaas.com' && password === 'admin123') {
          login(email, 'Enterprise', 'Admin');
          toast.success('Successfully logged in!', {
            description: `Welcome back, Enterprise Admin`,
          });
          navigate('/onboarding');
        } else {
          // Allow any login for demo
          login(email, 'John', 'Doe');
          toast.success('Demo login authorized successfully!', {
            description: `Session initiated for ${email}`,
          });
          navigate('/onboarding');
        }
      } else {
        // Phone login flow: Redirect to OTP screen
        setTempPhone(phone);
        toast.success('Simulated verification code sent to mobile!', {
          description: `A 6-digit OTP code has been broadcasted to +91 ${phone}`,
        });
        navigate('/otp?type=phone');
      }
    }, 1200);
  };

  const handleGoogleLogin = () => {
    login('google.user@enterprise.com', 'Google', 'User');
    toast.success('Successfully authenticated via Google Sandbox!', {
      description: 'Session initiated for google.user@enterprise.com',
    });
    navigate('/onboarding');
  };

  return (
    <motion.div animate={controls} className="space-y-7 text-left">
      {/* Header */}
      <div className="space-y-2">
        <Link
          to="/welcome"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Welcome
        </Link>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {loginMode === 'email' ? 'Secure Credential Login' : 'Login via Mobile'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-light">
          {loginMode === 'email' 
            ? 'Access your corporate workspace with security.' 
            : 'Enter your registered mobile to request secure access OTP.'}
        </p>
      </div>

      {/* Last Login Info Badge */}
      <div className="flex items-center gap-2 p-2 px-3 bg-slate-100 dark:bg-slate-900 rounded-lg text-[11px] text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-slate-800/40">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Last Login: <b>Today, 10:00 AM</b> from Chrome (macOS)</span>
      </div>

      {/* Demo Credentials Alert Card */}
      {loginMode === 'email' && (
        <Card variant="info" className="text-xs flex gap-2.5 p-3.5 border-blue-100 dark:border-blue-950/40">
          <ShieldAlert className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-indigo-900 dark:text-indigo-350">Quick Sandbox Credentials:</p>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
              Email: <span className="font-semibold text-slate-700 dark:text-slate-200">admin@coresaas.com</span><br/>
              Pass: <span className="font-semibold text-slate-700 dark:text-slate-200">admin123</span>
            </p>
          </div>
        </Card>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {loginMode === 'email' ? (
          <>
            <Input
              label={t.email}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<Mail className="w-4 h-4" />}
            />
            
            <div className="relative">
              <Input
                label={t.password}
                type="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                error={errors.password}
                icon={<Lock className="w-4 h-4" />}
              />
              
              {/* Caps Lock Alert */}
              <AnimatePresence>
                {isCapsLockActive && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-3 top-1 flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-100 dark:border-amber-900/30"
                  >
                    <AlertTriangle className="w-3 h-3 animate-pulse" /> Caps Lock On
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password Strength and Policy tooltip */}
              {isPasswordFocused && (
                <div className="mt-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400 uppercase tracking-wider">Strength Indicator:</span>
                    <span className={
                      passwordStrength.score <= 1 ? 'text-red-500' :
                      passwordStrength.score <= 3 ? 'text-amber-500' : 'text-emerald-500'
                    }>
                      {passwordStrength.feedback}
                    </span>
                  </div>
                  
                  {/* Strength Bar */}
                  <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        passwordStrength.score <= 1 ? 'bg-red-500' :
                        passwordStrength.score <= 3 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                    />
                  </div>

                  <p className="text-[10px] text-slate-400 leading-relaxed text-left font-light">
                    <b>Policy rules:</b> Minimum 8 characters, containing uppercase, numbers, and special symbols.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <Input
            label={t.mobile}
            type="tel"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            error={errors.phone}
            icon={<Phone className="w-4 h-4" />}
          />
        )}

        {/* Options Row */}
        {loginMode === 'email' && (
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 accent-indigo-600 focus:ring-indigo-500/20"
                />
                <span>{t.rememberMe}</span>
              </label>

              <Link
                to="/forgot-password"
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {t.forgotPassword}
              </Link>
            </div>

            {/* Remember Device and Trusted Browser */}
            <div className="flex flex-col gap-2 p-3 bg-slate-100/30 dark:bg-slate-900/40 rounded-xl border border-slate-200/40 dark:border-slate-800/40 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer select-none text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 accent-indigo-600 focus:ring-indigo-500/10"
                />
                <span>Remember Device (Bypass future 2FA validations)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer select-none text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={trustedBrowser}
                  onChange={(e) => setTrustedBrowser(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 accent-indigo-600 focus:ring-indigo-500/10"
                />
                <span>Mark as Trusted Browser (Keep me logged in for 30 days)</span>
              </label>
            </div>
          </div>
        )}

        {/* Action button */}
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          {loginMode === 'email' ? t.login : t.getOtp}
        </Button>
      </form>

      {/* Device Information Card */}
      <div className="flex items-center gap-3 p-3 bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-100/30 dark:border-indigo-900/30 rounded-xl text-xs text-slate-500 dark:text-slate-400">
        <Cpu className="w-4 h-4 text-indigo-500 flex-shrink-0" />
        <p className="text-[11px] leading-relaxed">
          Detected: <b>{deviceInfo.os}</b> using <b>{deviceInfo.browser}</b>. Secure session keys will bind to this physical client signature.
        </p>
      </div>

      {/* View Login Activity Logs */}
      <div className="border-t border-slate-100 dark:border-slate-900 pt-3">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
        >
          <History className="w-3.5 h-3.5" />
          <span>{showHistory ? 'Hide Access Logs' : 'View Access Logs'}</span>
        </button>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-2 space-y-2 max-h-40 overflow-y-auto pr-1"
            >
              {loginHistory.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-[10px] border border-slate-200/20 dark:border-slate-800/20">
                  <div className="space-y-0.5 text-left">
                    <p className="font-bold text-slate-700 dark:text-slate-300">{item.device}</p>
                    <p className="text-slate-400 font-mono">{item.ip} • {item.location}</p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className={`px-1.5 py-0.5 font-bold rounded ${item.status === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-450' : 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-450'}`}>
                      {item.status.toUpperCase()}
                    </span>
                    <p className="text-slate-400 font-light mt-0.5">{dateUtils.formatRelative(item.timestamp)}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mode Switcher Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
        </div>
        <span className="relative px-3 bg-slate-50 dark:bg-slate-950 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">
          Alternative Methods
        </span>
      </div>

      {/* Alternative Login Actions */}
      <div className="space-y-3">
        {loginMode === 'email' ? (
          <Button
            variant="outline"
            onClick={() => setLoginMode('phone')}
            className="w-full"
            leftIcon={<Phone className="w-4 h-4 text-emerald-500" />}
          >
            Login via Mobile Number
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => setLoginMode('email')}
            className="w-full"
            leftIcon={<Mail className="w-4 h-4 text-indigo-500" />}
          >
            Login via Email & Password
          </Button>
        )}

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer transition-all duration-300 shadow-xs"
        >
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
          Continue with Google Security
        </button>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-6">
        {t.dontHaveAccount}{' '}
        <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          {t.register}
        </Link>
      </p>
    </motion.div>
  );
};
