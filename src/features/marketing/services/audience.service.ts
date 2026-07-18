/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import audiencesJson from '../../../mock/audiences.json';
import { Audience } from '../../../types/marketing';

const STORAGE_KEY = 'saas-marketing-audiences';

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(audiencesJson));
  }
};

export const audienceService = {
  getAudiences: async (): Promise<Audience[]> => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 80));
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  getAudienceById: async (id: string): Promise<Audience | null> => {
    const list = await audienceService.getAudiences();
    return list.find((a) => a.id === id) || null;
  },

  createAudience: async (audience: Partial<Audience>): Promise<Audience> => {
    initLocalStorage();
    const list = await audienceService.getAudiences();
    const newId = `AUD-${String(list.length + 1).padStart(3, '0')}`;
    const newAudience: Audience = {
      id: newId,
      name: audience.name || 'Untitled Segment',
      type: audience.type || 'Customer Segment',
      count: audience.count || 0,
      description: audience.description || '',
      filters: audience.filters || {},
      aiSuggestions: audience.aiSuggestions || [
        'Optimal engagement time is between 2:00 PM and 4:00 PM.',
        'Use WhatsApp or Email channel for high conversion ratios.'
      ]
    };
    list.push(newAudience);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newAudience;
  },

  updateAudience: async (id: string, data: Partial<Audience>): Promise<Audience> => {
    initLocalStorage();
    const list = await audienceService.getAudiences();
    const idx = list.findIndex((a) => a.id === id);
    if (idx < 0) throw new Error('Audience not found');
    list[idx] = { ...list[idx], ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list[idx];
  },

  deleteAudience: async (id: string): Promise<void> => {
    initLocalStorage();
    const list = await audienceService.getAudiences();
    const filtered = list.filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
