/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import customersJson from '../mock/customers.json';

const STORAGE_KEY = 'saas-crm-customers';

// Ensure localStorage is populated
const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customersJson));
  }
};

export const customerService = {
  getCustomers: async () => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 200));
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  getCustomerById: async (id: string) => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 150));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return list.find((c: any) => c.id === id) || null;
  },

  createCustomer: async (customer: any) => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newCustomer = {
      ...customer,
      id: customer.id || `CST-${String(list.length + 1).padStart(3, '0')}`,
      avatar: customer.avatar || (customer.name ? customer.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'CST'),
      totalOrders: customer.totalOrders || 0,
      totalPurchase: customer.totalPurchase || 0,
      outstandingAmount: customer.outstandingAmount || 0,
      status: customer.status || 'Active',
      createdDate: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString(),
      profile: customer.profile || {
        overview: `Customer created manually on ${new Date().toLocaleDateString()}`,
        aiSummary: "No AI insights compiled for this customer record yet.",
        orders: [],
        invoices: [],
        payments: [],
        documents: [],
        notes: []
      }
    };
    list.unshift(newCustomer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newCustomer;
  },

  updateCustomer: async (id: string, data: any) => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 200));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const idx = list.findIndex((c: any) => c.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data, lastActivity: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return list[idx];
    }
    return null;
  },

  deleteCustomer: async (id: string) => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 200));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = list.filter((c: any) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  bulkDelete: async (ids: string[]) => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 200));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = list.filter((c: any) => !ids.includes(c.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
};
