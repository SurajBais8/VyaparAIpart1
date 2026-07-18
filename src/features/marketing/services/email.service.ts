/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import emailsJson from '../../../mock/emails.json';
import { EmailMessage } from '../../../types/marketing';

const STORAGE_KEY = 'saas-marketing-emails';

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emailsJson));
  }
};

export const emailService = {
  getEmails: async (): Promise<EmailMessage[]> => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 80));
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  sendEmail: async (email: Partial<EmailMessage>): Promise<EmailMessage> => {
    initLocalStorage();
    const list = await emailService.getEmails();
    const newEmail: EmailMessage = {
      id: `EM-${String(list.length + 1).padStart(3, '0')}`,
      from: email.from || 'SaaS Marketing Core <marketing@enterprise.io>',
      to: email.to || '',
      subject: email.subject || 'No Subject',
      body: email.body || '',
      timestamp: new Date().toISOString(),
      status: email.status || 'Outbox', // Outbox means sent
      sentTime: email.status === 'Draft' ? null : new Date().toISOString(),
      read: true
    };
    list.unshift(newEmail);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newEmail;
  },

  updateEmail: async (id: string, data: Partial<EmailMessage>): Promise<EmailMessage> => {
    initLocalStorage();
    const list = await emailService.getEmails();
    const idx = list.findIndex((e) => e.id === id);
    if (idx < 0) throw new Error('Email not found');
    list[idx] = { ...list[idx], ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list[idx];
  },

  deleteEmail: async (id: string): Promise<void> => {
    initLocalStorage();
    const list = await emailService.getEmails();
    const filtered = list.filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
