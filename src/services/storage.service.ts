/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const storageService = {
  get: <T>(key: string): T | null => {
    const data = localStorage.getItem(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof value === 'string') {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  clearSession: (): void => {
    localStorage.removeItem('saas-user');
    localStorage.removeItem('saas-token');
    localStorage.removeItem('saas-refresh-token');
  }
};
