/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button, Input, Card } from '../components/ui';
import { Mail, Lock, Phone, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { TRANSLATIONS } from '../constants/languages';
import { toast } from 'sonner';
import { motion, useAnimation } from 'motion/react';

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
  
  const [errors, setErrors] = useState<{ email?: string; password?: string; phone?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Animation controller for error shake
  const controls = useAnimation();

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'phone') {
      setLoginMode('phone');
    } else {
      setLoginMode('email');
    }
  }, [searchParams]);

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
          // Allow any login for demo but warn user if they typed something else, or let any login pass to make exploration super smooth!
          // Let's allow any email/password to log in for smooth previewing, but notify them of default credentials just in case.
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
            <Input
              label={t.password}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={<Lock className="w-4 h-4" />}
            />
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
