/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import companiesJson from '../mock/companies.json';

const STORAGE_KEY = 'saas-crm-companies';

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companiesJson));
  }
};

export const companyService = {
  getCompanies: async () => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 150));
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  getCompanyById: async (id: string) => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return list.find((c: any) => c.id === id) || null;
  },

  createCompany: async (company: any) => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 200));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newCompany = {
      ...company,
      id: company.id || `COM-${String(list.length + 1).padStart(3, '0')}`,
      logo: company.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&h=80&fit=crop&q=60",
      status: company.status || 'Active',
      profile: company.profile || {
        overview: `Company added on ${new Date().toLocaleDateString()}`,
        contactsList: [],
        deals: [],
        documents: []
      }
    };
    list.unshift(newCompany);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newCompany;
  },

  updateCompany: async (id: string, data: any) => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 150));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const idx = list.findIndex((c: any) => c.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return list[idx];
    }
    return null;
  },

  deleteCompany: async (id: string) => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 150));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = list.filter((c: any) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
};
