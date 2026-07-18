/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ThemeType } from '../types';

export interface ThemeConfig {
  theme: ThemeType;
  accentColor: 'indigo' | 'violet' | 'blue' | 'emerald';
  compactMode: boolean;
  sidebarStyle: 'glass' | 'solid' | 'gradient';
  borderRadius: 'rounded-md' | 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl';
}

const defaultThemeConfig: ThemeConfig = {
  theme: 'system',
  accentColor: 'indigo',
  compactMode: false,
  sidebarStyle: 'gradient',
  borderRadius: 'rounded-xl',
};

export const themeService = {
  getThemeConfig: (): ThemeConfig => {
    const saved = localStorage.getItem('saas-theme-config');
    if (saved) {
      try {
        return { ...defaultThemeConfig, ...JSON.parse(saved) };
      } catch {
        return defaultThemeConfig;
      }
    }
    return defaultThemeConfig;
  },

  saveThemeConfig: (config: Partial<ThemeConfig>): ThemeConfig => {
    const current = themeService.getThemeConfig();
    const updated = { ...current, ...config };
    localStorage.setItem('saas-theme-config', JSON.stringify(updated));
    themeService.applyThemeClasses(updated);
    return updated;
  },

  applyThemeClasses: (config: ThemeConfig): void => {
    const root = window.document.documentElement;
    
    // Apply Light/Dark Class
    root.classList.remove('light', 'dark');
    if (config.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(config.theme);
    }

    // Apply Compact Mode attributes
    if (config.compactMode) {
      root.setAttribute('data-compact', 'true');
    } else {
      root.removeAttribute('data-compact');
    }
  }
};
