/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input } from '../components/ui';
import { Mail, Phone, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { TRANSLATIONS } from '../constants/languages';
import { toast } from 'sonner';
import { motion, useAnimation } from 'motion/react';

export const ForgotPasswordScreen: React.FC = () => {
  const navigate = useNavigate();
  const { language, setTempEmail, setTempPhone } = useAuthStore();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const controls = useAnimation();

  const validate = () => {
    if (method === 'email') {
      if (!email) {
        setError('Email address is required');
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Please enter a valid email address');
        return false;
      }
    } else {
      if (!phone) {
        setError('Mobile number is required');
        return false;
      }
      if (phone.length < 10) {
        setError('Please enter a valid 10-digit mobile number');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
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

      if (method === 'email') {
        setTempEmail(email);
        toast.success('Reset link dispatched!', {
          description: `Temporary verification code sent to ${email}`,
        });
        navigate(`/otp?type=forgot&email=${encodeURIComponent(email)}`);
      } else {
        setTempPhone(phone);
        toast.success('Reset code dispatched!', {
          description: `Temporary verification code sent to +91 ${phone}`,
        });
        navigate(`/otp?type=forgot&type_method=phone`);
      }
    }, 1200);
  };

  return (
    <motion.div animate={controls} className="space-y-6 text-left">
      <div className="space-y-2">
        <Link
          to="/login"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
        </Link>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Recover Account Password
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
          Provide your corporate details to dispatch a verified recovery token.
        </p>
      </div>

      {/* Toggles: Email vs Phone */}
      <div className="grid grid-cols-2 gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => {
            setMethod('email');
            setError('');
          }}
          className={`pb-1 text-xs font-bold text-center border-b-2 transition-all duration-300 cursor-pointer
            ${method === 'email'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-500'}`}
        >
          Email recovery
        </button>
        <button
          type="button"
          onClick={() => {
            setMethod('phone');
            setError('');
          }}
          className={`pb-1 text-xs font-bold text-center border-b-2 transition-all duration-300 cursor-pointer
            ${method === 'phone'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-500'}`}
        >
          Mobile recovery
        </button>
      </div>

      <form onSubmit={handleSendOTP} className="space-y-5">
        {method === 'email' ? (
          <Input
            label="Recovery Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            icon={<Mail className="w-4 h-4" />}
          />
        ) : (
          <Input
            label="Recovery Mobile"
            type="tel"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            error={error}
            icon={<Phone className="w-4 h-4" />}
          />
        )}

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          Transmit Recovery Code
        </Button>
      </form>
    </motion.div>
  );
};
