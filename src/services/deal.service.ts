/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import dealsJson from '../mock/deals.json';

const STORAGE_KEY = 'saas-crm-deals';

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dealsJson));
  }
};

export const dealService = {
  getDeals: async () => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 150));
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  getDealById: async (id: string) => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return list.find((d: any) => d.id === id) || null;
  },

  createDeal: async (deal: any) => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 200));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newDeal = {
      ...deal,
      id: deal.id || `DL-${String(list.length + 501).padStart(3, '0')}`,
      status: deal.status || 'active',
      probability: deal.probability || 50,
      expectedClosing: deal.expectedClosing || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      products: deal.products || ["Standard SaaS Subscription"],
      timeline: deal.timeline || [{ "date": new Date().toISOString().split('T')[0], "event": "Deal identified", "author": "John Doe" }]
    };
    list.unshift(newDeal);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newDeal;
  },

  updateDeal: async (id: string, data: any) => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 150));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const idx = list.findIndex((d: any) => d.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return list[idx];
    }
    return null;
  },

  deleteDeal: async (id: string) => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 150));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = list.filter((d: any) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
};
