/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import leadsJson from '../mock/leads.json';

const STORAGE_KEY = 'saas-crm-leads';

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leadsJson));
  }
};

export const leadService = {
  getLeads: async () => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 150));
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  getLeadById: async (id: string) => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return list.find((l: any) => l.id === id) || null;
  },

  createLead: async (lead: any) => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 200));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newLead = {
      ...lead,
      id: lead.id || `LD-${String(list.length + 201).padStart(3, '0')}`,
      status: lead.status || 'New',
      stage: lead.stage || 'New',
      score: lead.score || Math.floor(Math.random() * 40 + 40),
      lastContact: new Date().toISOString().split('T')[0],
      nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      profile: lead.profile || {
        overview: `Lead captured manually on ${new Date().toLocaleDateString()}`,
        activities: [],
        documents: [],
        aiSuggestions: ["Verify basic operational compliance", "Schedule introductory feature walkthrough"]
      }
    };
    list.unshift(newLead);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newLead;
  },

  updateLead: async (id: string, data: any) => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 150));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const idx = list.findIndex((l: any) => l.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return list[idx];
    }
    return null;
  },

  deleteLead: async (id: string) => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 150));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = list.filter((l: any) => l.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
};
