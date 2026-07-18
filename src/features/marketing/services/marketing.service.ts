/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import analyticsJson from '../../../mock/marketingAnalytics.json';
import { MarketingAnalytics } from '../../../types/marketing';

const STORAGE_KEY = 'saas-marketing-analytics';

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(analyticsJson));
  }
};

export const marketingService = {
  getAnalytics: async (): Promise<MarketingAnalytics> => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 80));
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : (analyticsJson as any);
  },

  updateAnalytics: async (data: Partial<MarketingAnalytics>): Promise<MarketingAnalytics> => {
    initLocalStorage();
    const current = await marketingService.getAnalytics();
    const updated = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
};
