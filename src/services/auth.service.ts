/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { authApi } from '../mock/authApi';
import { storageService } from './storage.service';

export const authService = {
  login: async (email: string, password?: string) => {
    const res = await authApi.login(email, password);
    if (res.success && res.user && res.token) {
      storageService.set('saas-user', res.user);
      storageService.set('saas-token', res.token);
      
      // Log login activity to mock history log
      authApi.addLoginHistoryItem({
        timestamp: new Date().toISOString(),
        device: 'Chrome / ' + (navigator.userAgent.includes('Mac') ? 'macOS' : 'Windows'),
        ip: '192.168.1.' + Math.floor(Math.random() * 254 + 1),
        location: 'Local Session Gateway',
        status: 'success'
      });
    }
    return res;
  },

  logout: () => {
    storageService.clearSession();
  },

  getLoginHistory: async () => {
    return authApi.getLoginHistory();
  },

  checkCapsLock: (e: KeyboardEvent | React.KeyboardEvent): boolean => {
    return e.getModifierState && e.getModifierState('CapsLock');
  },

  calculatePasswordStrength: (password: string): { score: number; feedback: string } => {
    if (!password) return { score: 0, feedback: 'Enter a password' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const feedbackOptions = [
      'Very Weak',
      'Weak - add capitals/numbers',
      'Fair - add special symbols',
      'Strong',
      'Very Secure'
    ];

    return {
      score,
      feedback: feedbackOptions[score]
    };
  }
};
