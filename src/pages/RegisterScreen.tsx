/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card } from '../components/ui';
import { Mail, Lock, Phone, User, Building, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useOnboardingStore } from '../store/onboardingStore';
import { TRANSLATIONS } from '../constants/languages';
import { toast } from 'sonner';
import { motion, useAnimation } from 'motion/react';

export const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const { language, setTempEmail } = useAuthStore();
  const { setBusinessInfo } = useOnboardingStore();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Tabs: Personal vs Business
  const [activeSection, setActiveSection] = useState<'personal' | 'business'>('personal');

  // Personal Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Business Fields
  const [businessName, setBusinessNameText] = useState('');
  const [businessType, setBusinessType] = useState('SaaS');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Password strength state
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

  const validateSection = (section: 'personal' | 'business') => {
    const newErrors: Record<string, string> = {};

    if (section === 'personal') {
      if (!firstName) newErrors.firstName = 'First name is required';
      if (!lastName) newErrors.lastName = 'Last name is required';
      if (!email) {
        newErrors.email = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!mobile) {
        newErrors.mobile = 'Mobile number is required';
      } else if (mobile.length < 10) {
        newErrors.mobile = 'Mobile number must be at least 10 digits';
      }
      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else {
      if (!businessName) newErrors.businessName = 'Business name is required';
      if (!acceptTerms) newErrors.acceptTerms = 'You must accept the terms & conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const controls = useAnimation();

  const handleNextSection = () => {
    if (validateSection('personal')) {
      setActiveSection('business');
    } else {
      controls.start({
        x: [-10, 10, -10, 10, -5, 5, 0],
        transition: { duration: 0.4 },
      });
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSection('business')) {
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Store temporary email & business info in stores
      setTempEmail(email);
      setBusinessInfo({ businessName, businessType });

      // Trigger simulated registration OTP delivery
      toast.success('Registration code transmitted!', {
        description: `A 6-digit verification pin has been broadcasted to ${email}`,
      });
      // Redirect to OTP flow with metadata
      navigate(`/otp?type=register&email=${encodeURIComponent(email)}&first=${encodeURIComponent(firstName)}&last=${encodeURIComponent(lastName)}`);
    }, 1300);
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
    <motion.div animate={controls} className="space-y-6 text-left">
      {/* Header */}
      <div className="space-y-2">
        <Link
          to="/welcome"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Welcome
        </Link>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Create Corporate Account
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-light">
          Set up secure federated identity and complete setup.
        </p>
      </div>

      {/* Progress Tabs */}
      <div className="grid grid-cols-2 gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveSection('personal')}
          className={`pb-1 text-xs font-bold text-center border-b-2 transition-all duration-300 cursor-pointer
            ${activeSection === 'personal'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-500'}`}
        >
          1. Representative Info
        </button>
        <button
          onClick={() => {
            if (validateSection('personal')) {
              setActiveSection('business');
            }
          }}
          className={`pb-1 text-xs font-bold text-center border-b-2 transition-all duration-300 cursor-pointer
            ${activeSection === 'business'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-500'}`}
        >
          2. Business Profile
        </button>
      </div>

      {/* Section 1: Personal Representative Information */}
      {activeSection === 'personal' && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t.firstName}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={errors.firstName}
              icon={<User className="w-4 h-4" />}
            />
            <Input
              label={t.lastName}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={errors.lastName}
              icon={<User className="w-4 h-4" />}
            />
          </div>

          <Input
            label={t.email}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            icon={<Mail className="w-4 h-4" />}
          />

          <Input
            label={t.mobile}
            type="tel"
            maxLength={10}
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
            error={errors.mobile}
            icon={<Phone className="w-4 h-4" />}
          />

          <Input
            label={t.password}
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
                <span className="text-slate-500 dark:text-slate-400">Password Strength:</span>
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
            label={t.confirmPassword}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            icon={<Lock className="w-4 h-4" />}
          />

          <Button type="button" onClick={handleNextSection} className="w-full">
            Proceed to Business Info
          </Button>
        </motion.div>
      )}

      {/* Section 2: Business Profile Information */}
      {activeSection === 'business' && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-5"
        >
          <Input
            label={t.businessName}
            value={businessName}
            onChange={(e) => setBusinessNameText(e.target.value)}
            error={errors.businessName}
            icon={<Building className="w-4 h-4" />}
          />

          <div className="relative mb-5 text-left">
            <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 select-none ml-1">
              {t.businessType}
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full mt-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs text-sm outline-none text-slate-800 dark:text-slate-100"
            >
              <option value="SaaS">SaaS Platform</option>
              <option value="E-commerce">E-commerce Enterprise</option>
              <option value="Healthcare">Healthcare Operations</option>
              <option value="Fintech">Fintech Organization</option>
              <option value="Consulting">Consultancy Agency</option>
            </select>
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-slate-300 dark:border-slate-700 accent-indigo-600"
            />
            <span>{t.acceptTerms}</span>
          </label>
          {errors.acceptTerms && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.acceptTerms}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveSection('personal')}
              className="w-1/3"
            >
              Back
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleRegisterSubmit}
              isLoading={isLoading}
              className="w-2/3"
            >
              Send OTP Code
            </Button>
          </div>
        </motion.div>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-6">
        {t.alreadyHaveAccount}{' '}
        <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          {t.login}
        </Link>
      </p>
    </motion.div>
  );
};
