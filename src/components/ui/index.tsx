/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, Info, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ==========================================
// BUTTONS
// ==========================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const [coords, setCoords] = useState({ x: -1, y: -1 });
  const [isRippling, setIsRippling] = useState(false);

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
    setIsRippling(true);
    if (props.onClick) {
      props.onClick(e);
    }
  };

  useEffect(() => {
    if (isRippling) {
      const timer = setTimeout(() => setIsRippling(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isRippling]);

  const baseStyles = "relative overflow-hidden inline-flex items-center justify-center font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl text-sm px-5 py-3.5 cursor-pointer select-none active:scale-[0.98]";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 focus:ring-indigo-500 border border-transparent",
    secondary: "bg-white hover:bg-slate-50 text-slate-600 dark:bg-slate-900 dark:hover:bg-slate-850 dark:text-slate-350 border border-slate-200 dark:border-slate-800 focus:ring-slate-500",
    outline: "bg-transparent border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 focus:ring-indigo-500",
    ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 focus:ring-indigo-500",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/15 focus:ring-red-500 border border-transparent",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/15 focus:ring-emerald-500 border border-transparent",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed active:scale-100' : ''} ${className}`}
      disabled={disabled || isLoading}
      onClick={handleRipple}
      {...props}
    >
      {/* Ripple element */}
      {isRippling && !disabled && !isLoading && (
        <span
          className="absolute bg-white/25 rounded-full pointer-events-none animate-ripple"
          style={{
            left: coords.x,
            top: coords.y,
            transform: 'translate(-50%, -50%)',
            width: '150px',
            height: '150px',
          }}
        />
      )}
      
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : leftIcon ? (
        <span className="mr-2 inline-flex">{leftIcon}</span>
      ) : null}
      
      <span className="relative z-10">{children}</span>
      
      {!isLoading && rightIcon && (
        <span className="ml-2 inline-flex">{rightIcon}</span>
      )}
    </button>
  );
};


// ==========================================
// INPUTS
// ==========================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  type = 'text',
  className = '',
  id,
  value,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPass = type === 'password';
  const resolvedType = isPass ? (showPassword ? 'text' : 'password') : type;
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="relative w-full mb-5">
      <div className={`relative flex items-center border rounded-xl transition-all duration-300 bg-white dark:bg-slate-900
        ${error ? 'border-red-500 ring-1 ring-red-500' : isFocused ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}>
        
        {icon && (
          <div className="pl-4 text-slate-400 dark:text-slate-500 select-none">
            {icon}
          </div>
        )}

        <div className="relative flex-grow">
          <input
            id={inputId}
            type={resolvedType}
            className={`w-full px-4 pt-6 pb-2 text-slate-900 dark:text-slate-50 outline-none text-sm bg-transparent rounded-xl peer placeholder-transparent`}
            placeholder={label}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false);
              if (props.onBlur) props.onBlur(e);
            }}
            value={value}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={`absolute left-4 select-none pointer-events-none transition-all duration-200 text-xs text-slate-400 dark:text-slate-500
              peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-slate-400 dark:peer-placeholder-shown:text-slate-500
              peer-focus:text-xs peer-focus:top-1.5 peer-focus:text-indigo-500
              ${value || isFocused ? 'top-1.5 text-xs' : 'top-4'}`}
          >
            {label}
          </label>
        </div>

        {isPass && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="pr-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 mt-1.5 ml-1 flex items-center gap-1"
        >
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </motion.p>
      )}
    </div>
  );
};


// ==========================================
// OTP INPUT (6-DIGITS)
// ==========================================
interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({ value, onChange, error }) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (isNaN(Number(val))) return;

    // Split or assign
    const otpArray = value.split('');
    // Put only the last digit entered
    otpArray[index] = val.slice(-1);
    const newOtp = otpArray.join('');
    onChange(newOtp);

    // Auto focus next input
    if (val && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const otpArray = value.split('');
      if (!otpArray[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
        otpArray[index - 1] = '';
        onChange(otpArray.join(''));
      } else {
        otpArray[index] = '';
        onChange(otpArray.join(''));
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (pasteData.length === 6 && !isNaN(Number(pasteData))) {
      onChange(pasteData);
      inputsRef.current[5]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2.5 sm:gap-4 justify-center">
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el; }}
            type="text"
            maxLength={1}
            value={value[i] || ''}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            className={`w-11 h-12 sm:w-14 sm:h-16 text-center text-xl font-bold rounded-xl border transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs focus:outline-none focus:ring-4
              ${error ? 'border-red-500 focus:ring-red-500/10 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:ring-indigo-500/15 focus:border-indigo-500 text-slate-800 dark:text-slate-100'}`}
          />
        ))}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-3 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}
    </div>
  );
};


// ==========================================
// CARDS (Glass, Info, Success, Warning, Error)
// ==========================================
interface CardProps {
  children: React.ReactNode;
  variant?: 'glass' | 'info' | 'success' | 'warning' | 'error';
  className?: string;
  id?: string;
}

export const Card: React.FC<CardProps> = ({ children, variant = 'glass', className = '', id }) => {
  const styles = {
    glass: "bg-white/70 dark:bg-slate-950/75 backdrop-blur-lg border border-slate-200/50 dark:border-slate-800/60 shadow-xl rounded-2xl",
    info: "bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl p-4 text-blue-800 dark:text-blue-300",
    success: "bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-4 text-emerald-800 dark:text-emerald-300",
    warning: "bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl p-4 text-amber-800 dark:text-amber-300",
    error: "bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-xl p-4 text-red-800 dark:text-red-300",
  };

  return (
    <div id={id} className={`${styles[variant]} ${className}`}>
      {children}
    </div>
  );
};


// ==========================================
// DIALOGS / MODALS
// ==========================================
interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  type?: 'confirm' | 'delete' | 'success' | 'warning';
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  type = 'confirm',
  onConfirm,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}) => {
  if (!isOpen) return null;

  const iconMap = {
    confirm: <Info className="w-10 h-10 text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 p-2 rounded-full" />,
    delete: <Trash2 className="w-10 h-10 text-red-500 bg-red-50 dark:bg-red-950/30 p-2 rounded-full" />,
    success: <CheckCircle2 className="w-10 h-10 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-full" />,
    warning: <AlertCircle className="w-10 h-10 text-amber-500 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-full" />,
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
        />

        {/* Dialog Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex gap-4 items-start mb-4">
            {iconMap[type]}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-550">
                {title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <Button variant="outline" onClick={onClose} className="py-2.5">
              {cancelLabel}
            </Button>
            {onConfirm && (
              <Button
                variant={type === 'delete' ? 'danger' : type === 'success' ? 'success' : 'primary'}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="py-2.5"
              >
                {confirmLabel}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


// ==========================================
// LOADERS (Progress bar, spinner, skeleton)
// ==========================================
export const Spinner: React.FC<{ className?: string }> = ({ className = 'w-8 h-8 text-indigo-600' }) => (
  <Loader2 className={`${className} animate-spin`} />
);

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse ${className}`} />
);

export const ProgressBar: React.FC<{ progress: number; className?: string }> = ({ progress, className = '' }) => (
  <div className={`w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${className}`}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
    />
  </div>
);
