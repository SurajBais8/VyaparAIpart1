/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { AuthState, User, ThemeType, LanguageType } from '../types';

interface AuthStoreActions {
  login: (email: string, firstName?: string, lastName?: string) => void;
  logout: () => void;
  setTheme: (theme: ThemeType) => void;
  setLanguage: (lang: LanguageType) => void;
  setRememberMe: (remember: boolean) => void;
  setTempEmail: (email: string | null) => void;
  setTempPhone: (phone: string | null) => void;
  completeOnboarding: () => void;
  updateOnboardingStep: (step: number) => void;
}

const getInitialTheme = (): ThemeType => {
  const saved = localStorage.getItem('saas-theme') as ThemeType;
  if (saved) return saved;
  return 'system';
};

const getInitialLanguage = (): LanguageType => {
  const saved = localStorage.getItem('saas-lang') as LanguageType;
  if (saved) return saved;
  return 'en';
};

const getInitialUser = (): User | null => {
  const saved = localStorage.getItem('saas-user');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
};

export const useAuthStore = create<AuthState & AuthStoreActions>((set) => ({
  user: getInitialUser(),
  token: localStorage.getItem('saas-token') || null,
  refreshToken: localStorage.getItem('saas-refresh-token') || null,
  isAuthenticated: !!localStorage.getItem('saas-token'),
  theme: getInitialTheme(),
  language: getInitialLanguage(),
  rememberMe: localStorage.getItem('saas-remember') === 'true',
  tempEmail: null,
  tempPhone: null,

  login: (email, firstName = 'John', lastName = 'Doe') => {
    const mockUser: User = {
      id: 'usr_1',
      email,
      firstName,
      lastName,
      onboardingCompleted: false,
      onboardingStep: 1,
    };
    const mockToken = 'mock-jwt-token-xyz';
    const mockRefresh = 'mock-refresh-token-abc';

    localStorage.setItem('saas-user', JSON.stringify(mockUser));
    localStorage.setItem('saas-token', mockToken);
    localStorage.setItem('saas-refresh-token', mockRefresh);

    set({
      user: mockUser,
      token: mockToken,
      refreshToken: mockRefresh,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('saas-user');
    localStorage.removeItem('saas-token');
    localStorage.removeItem('saas-refresh-token');
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  setTheme: (theme) => {
    localStorage.setItem('saas-theme', theme);
    // Apply theme to document
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    set({ theme });
  },

  setLanguage: (language) => {
    localStorage.setItem('saas-lang', language);
    set({ language });
  },

  setRememberMe: (rememberMe) => {
    localStorage.setItem('saas-remember', rememberMe ? 'true' : 'false');
    set({ rememberMe });
  },

  setTempEmail: (tempEmail) => set({ tempEmail }),
  setTempPhone: (tempPhone) => set({ tempPhone }),

  completeOnboarding: () => {
    set((state) => {
      if (!state.user) return {};
      const updatedUser = { ...state.user, onboardingCompleted: true };
      localStorage.setItem('saas-user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },

  updateOnboardingStep: (step) => {
    set((state) => {
      if (!state.user) return {};
      const updatedUser = { ...state.user, onboardingStep: step };
      localStorage.setItem('saas-user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },
}));
