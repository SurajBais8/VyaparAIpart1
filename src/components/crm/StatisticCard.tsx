/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Skeleton } from '../ui';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'motion/react';

interface StatisticCardProps {
  title: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  growth?: number;
  growthDirection?: 'up' | 'down' | 'stable' | 'danger';
  isLoading?: boolean;
  isEmpty?: boolean;
  linkTo?: string;
  icon?: React.ReactNode;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  prefix = '',
  suffix = '',
  growth = 0,
  growthDirection = 'up',
  isLoading = false,
  isEmpty = false,
  linkTo,
  icon
}) => {
  const navigate = useNavigate();
  const [displayValue, setDisplayValue] = useState<number | string>(typeof value === 'number' ? 0 : value);

  // Simple count-up effect
  useEffect(() => {
    if (isLoading || isEmpty || typeof value !== 'number') {
      setDisplayValue(value);
      return;
    }

    const start = 0;
    const end = value;
    const duration = 800; // ms
    const incrementTime = 16; // approx 60fps
    const totalSteps = Math.round(duration / incrementTime);
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentVal = start + ((end - start) * currentStep) / totalSteps;
      setDisplayValue(Math.floor(currentVal));

      if (currentStep >= totalSteps) {
        setDisplayValue(end);
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, isLoading, isEmpty]);

  const formatDisplay = (val: number | string) => {
    if (typeof val === 'number') {
      return prefix + val.toLocaleString() + suffix;
    }
    return prefix + val + suffix;
  };

  const handleCardClick = () => {
    if (linkTo) {
      navigate(linkTo);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/70 dark:bg-slate-950/75 p-5 border border-slate-200/50 dark:border-slate-800/60 shadow-md rounded-2xl space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-6 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-3.5 w-16" />
      </div>
    );
  }

  const growthColors = {
    up: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10",
    down: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/10",
    stable: "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/10",
    danger: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20"
  };

  const growthIcons = {
    up: <TrendingUp className="w-3.5 h-3.5" />,
    down: <TrendingDown className="w-3.5 h-3.5" />,
    stable: <Minus className="w-3.5 h-3.5" />,
    danger: <TrendingDown className="w-3.5 h-3.5 animate-bounce" />
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={handleCardClick}
      className={`group bg-white/75 dark:bg-slate-950/75 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/60 p-5 rounded-2xl shadow-sm hover:shadow-lg hover:border-indigo-500/30 dark:hover:border-indigo-500/20 transition-all duration-300 select-none ${linkTo ? 'cursor-pointer' : ''}`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
            {title}
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
            {isEmpty ? '—' : formatDisplay(displayValue)}
          </div>
        </div>

        {icon && (
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
            {icon}
          </div>
        )}
      </div>

      {!isEmpty && growth !== 0 && (
        <div className="flex items-center gap-1.5 mt-3">
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-bold ${growthColors[growthDirection]}`}>
            {growthIcons[growthDirection]}
            {growth > 0 ? `+${growth}%` : `${growth}%`}
          </span>
          <span className="text-[10px] text-slate-400 font-light">vs previous cycle</span>
        </div>
      )}
    </motion.div>
  );
};
