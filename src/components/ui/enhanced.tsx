/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Check, AlertCircle, CheckCircle, Info, HelpCircle } from 'lucide-react';

// ==========================================
// CARDS VARIETIES
// ==========================================

export const GlassCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({
  children,
  className = '',
  onClick
}) => (
  <motion.div
    whileHover={onClick ? { y: -4, transition: { duration: 0.2 } } : undefined}
    onClick={onClick}
    className={`bg-white/70 dark:bg-slate-950/75 backdrop-blur-lg border border-slate-200/50 dark:border-slate-800/60 shadow-xl rounded-2xl p-6 ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </motion.div>
);

interface StatisticsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: { value: string; positive: boolean };
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({ title, value, description, icon, trend }) => (
  <GlassCard className="flex items-center justify-between">
    <div className="space-y-1.5 text-left">
      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{title}</span>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
      {description && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
      {trend && (
        <span className={`inline-flex items-center text-xs font-bold ${trend.positive ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend.value}
        </span>
      )}
    </div>
    {icon && <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl text-slate-600 dark:text-slate-400">{icon}</div>}
  </GlassCard>
);

export const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactNode; badge?: string }> = ({
  title,
  description,
  icon,
  badge
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 p-6 rounded-2xl shadow-md flex gap-4 text-left relative overflow-hidden"
  >
    {badge && (
      <span className="absolute top-3 right-3 text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">
        {badge}
      </span>
    )}
    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/30 dark:border-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
      {icon}
    </div>
    <div className="space-y-1">
      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">{description}</p>
    </div>
  </motion.div>
);

export const InformationCard: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode }> = ({
  title,
  children,
  icon
}) => (
  <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/40 dark:border-slate-800/40 rounded-xl p-5 text-left space-y-3">
    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
      {icon && <span className="text-slate-400">{icon}</span>}
      <span>{title}</span>
    </div>
    <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
      {children}
    </div>
  </div>
);

// ==========================================
// NAVIGATION (Breadcrumb, Tabs, Stepper)
// ==========================================

export const Breadcrumb: React.FC<{ items: { label: string; active?: boolean; onClick?: () => void }[] }> = ({ items }) => (
  <nav className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-medium select-none">
    {items.map((item, idx) => (
      <React.Fragment key={idx}>
        {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />}
        <span
          onClick={item.onClick}
          className={`transition-colors ${item.onClick ? 'cursor-pointer hover:text-slate-800 dark:hover:text-slate-200' : ''} ${item.active ? 'text-slate-900 dark:text-white font-bold' : ''}`}
        >
          {item.label}
        </span>
      </React.Fragment>
    ))}
  </nav>
);

export const Tabs: React.FC<{
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
}> = ({ tabs, activeTab, onChange }) => (
  <div className="flex border-b border-slate-200 dark:border-slate-800/80 gap-6 select-none">
    {tabs.map((tab) => {
      const isActive = tab.id === activeTab;
      return (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative py-3.5 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${isActive ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
        >
          {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
          <span>{tab.label}</span>
          {isActive && (
            <motion.div
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 dark:bg-indigo-400"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      );
    })}
  </div>
);

export const Stepper: React.FC<{
  steps: string[];
  currentStep: number;
  className?: string;
}> = ({ steps, currentStep, className = '' }) => (
  <div className={`flex items-center justify-between w-full gap-4 select-none ${className}`}>
    {steps.map((step, idx) => {
      const stepNum = idx + 1;
      const isCompleted = stepNum < currentStep;
      const isActive = stepNum === currentStep;

      return (
        <React.Fragment key={idx}>
          {idx > 0 && (
            <div className={`flex-1 h-0.5 transition-colors duration-300 ${stepNum <= currentStep ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
          )}
          <div className="flex flex-col items-center gap-1.5 relative">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-300
                ${isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' : isActive ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' : 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'}`}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
            </div>
            <span className={`text-[10px] font-bold tracking-tight absolute -bottom-5 whitespace-nowrap hidden md:inline transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'}`}>
              {step}
            </span>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

// ==========================================
// FEEDBACK & STATUS STATES
// ==========================================

export const FeedbackState: React.FC<{
  type: 'empty' | 'error' | 'success' | 'info';
  title: string;
  description: string;
  actionButton?: React.ReactNode;
}> = ({ type, title, description, actionButton }) => {
  const iconMap = {
    empty: <HelpCircle className="w-12 h-12 text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-full" />,
    error: <AlertCircle className="w-12 h-12 text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-full animate-bounce" />,
    success: <CheckCircle className="w-12 h-12 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-full" />,
    info: <Info className="w-12 h-12 text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 p-3 rounded-full" />,
  };

  return (
    <div className="flex flex-col items-center text-center p-8 max-w-sm mx-auto space-y-4">
      {iconMap[type]}
      <div className="space-y-1 text-center">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">{description}</p>
      </div>
      {actionButton && <div className="pt-2">{actionButton}</div>}
    </div>
  );
};
