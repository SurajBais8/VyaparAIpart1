/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import contactsJson from '../mock/contacts.json';

const STORAGE_KEY = 'saas-crm-contacts';

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contactsJson));
  }
};

export const contactService = {
  getContacts: async () => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 150));
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  getContactById: async (id: string) => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return list.find((c: any) => c.id === id) || null;
  },

  createContact: async (contact: any) => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 200));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newContact = {
      ...contact,
      id: contact.id || `CON-${String(list.length + 1).padStart(3, '0')}`,
      status: contact.status || 'Active',
      dateAdded: new Date().toISOString().split('T')[0],
      activities: contact.activities || []
    };
    list.unshift(newContact);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newContact;
  },

  updateContact: async (id: string, data: any) => {
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

  deleteContact: async (id: string) => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 150));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = list.filter((c: any) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
};
