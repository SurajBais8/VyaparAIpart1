/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { ThemeType } from '../types';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useAuthStore();

  const toggleTheme = () => {
    const themes: ThemeType[] = ['light', 'dark', 'system'];
    const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'dark':
        return <Moon className="w-5 h-5 text-indigo-400" />;
      default:
        return <Laptop className="w-5 h-5 text-slate-500 dark:text-slate-400" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      default:
        return 'System';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 p-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-300 shadow-xs"
      title="Toggle visual theme"
    >
      <span className="flex items-center justify-center">{getIcon()}</span>
      <span className="hidden sm:inline">{getLabel()}</span>
    </button>
  );
};
