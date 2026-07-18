/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import countriesJson from './countries.json';
import industriesJson from './industries.json';
import usersJson from './users.json';
import authConfigJson from './auth.json';

export interface MockUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  businessName?: string;
  businessType?: string;
  onboardingCompleted: boolean;
  onboardingStep: number;
}

export interface LoginHistoryItem {
  timestamp: string;
  device: string;
  ip: string;
  location: string;
  status: 'success' | 'failed';
}

const loginHistory: LoginHistoryItem[] = [
  { timestamp: '2026-07-18T10:00:00-07:00', device: 'Chrome - macOS Catalina', ip: '192.168.1.52', location: 'San Francisco, CA', status: 'success' },
  { timestamp: '2026-07-17T18:22:15-07:00', device: 'Safari - iOS 17', ip: '172.56.21.99', location: 'Los Angeles, CA', status: 'success' },
  { timestamp: '2026-07-15T09:14:02-07:00', device: 'Firefox - Windows 11', ip: '198.51.100.4', location: 'Seattle, WA', status: 'failed' }
];

export const authApi = {
  getCountries: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return countriesJson;
  },

  getIndustries: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return industriesJson;
  },

  getAuthConfig: async () => {
    return authConfigJson;
  },

  login: async (email: string, password?: string): Promise<{ success: boolean; user?: MockUser; token?: string; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // loading delay
    
    if (!email) {
      return { success: false, error: 'Email address is required' };
    }

    const found = usersJson.find((u) => u.email.toLowerCase() === email.toLowerCase()) || {
      id: 'usr_new',
      email,
      firstName: email.split('@')[0],
      lastName: 'SaaS User',
      mobile: '',
      onboardingCompleted: false,
      onboardingStep: 1
    };

    return {
      success: true,
      user: found,
      token: 'jwt_mock_token_' + Math.random().toString(36).substring(7)
    };
  },

  getLoginHistory: async (): Promise<LoginHistoryItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return loginHistory;
  },

  addLoginHistoryItem: (item: LoginHistoryItem) => {
    loginHistory.unshift(item);
  }
};
