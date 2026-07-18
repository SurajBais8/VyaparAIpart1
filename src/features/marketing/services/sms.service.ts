/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import smsJson from '../../../mock/sms.json';
import { SMSMessage } from '../../../types/marketing';

const STORAGE_KEY = 'saas-marketing-sms';

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(smsJson));
  }
};

export const smsService = {
  getSMSMessages: async (): Promise<SMSMessage[]> => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 80));
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  sendSMS: async (recipient: string, message: string, status: SMSMessage['status'] = 'Pending'): Promise<SMSMessage> => {
    initLocalStorage();
    const list = await smsService.getSMSMessages();
    const newSMS: SMSMessage = {
      id: `SMS-${String(list.length + 1).padStart(3, '0')}`,
      recipient,
      message,
      status,
      timestamp: new Date().toISOString(),
      cost: status === 'Failed' ? 0.0 : 0.15
    };
    list.unshift(newSMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newSMS;
  },

  bulkSendSMS: async (recipients: string[], message: string): Promise<SMSMessage[]> => {
    initLocalStorage();
    const list = await smsService.getSMSMessages();
    const results: SMSMessage[] = [];

    recipients.forEach((recip, i) => {
      const newSMS: SMSMessage = {
        id: `SMS-${String(list.length + i + 1).padStart(3, '0')}`,
        recipient: recip,
        message,
        status: 'Delivered',
        timestamp: new Date().toISOString(),
        cost: 0.15
      };
      results.push(newSMS);
      list.unshift(newSMS);
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return results;
  },

  deleteSMS: async (id: string): Promise<void> => {
    initLocalStorage();
    const list = await smsService.getSMSMessages();
    const filtered = list.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
