/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import whatsappJson from '../../../mock/whatsapp.json';
import { WhatsAppChat, WhatsAppMessage } from '../../../types/marketing';

const STORAGE_KEY = 'saas-marketing-whatsapp';

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(whatsappJson));
  }
};

export const whatsappService = {
  getChats: async (): Promise<WhatsAppChat[]> => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 80));
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  getChatById: async (id: string): Promise<WhatsAppChat | null> => {
    const list = await whatsappService.getChats();
    return list.find((c) => c.id === id) || null;
  },

  sendMessage: async (chatId: string, text: string, mediaUrl: string | null = null, mediaType: string | null = null): Promise<WhatsAppMessage> => {
    initLocalStorage();
    const list = await whatsappService.getChats();
    const chatIdx = list.findIndex((c) => c.id === chatId);
    if (chatIdx < 0) throw new Error('Chat thread not found');

    const newMessage: WhatsAppMessage = {
      id: `msg-${Date.now()}`,
      text,
      sender: 'agent',
      timestamp: new Date().toISOString(),
      mediaUrl,
      mediaType
    };

    list[chatIdx].messages.push(newMessage);
    list[chatIdx].lastMessage = text;
    list[chatIdx].lastUpdated = new Date().toISOString();
    list[chatIdx].unread = 0; // cleared on agent message

    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newMessage;
  },

  createChat: async (contactName: string, phone: string): Promise<WhatsAppChat> => {
    initLocalStorage();
    const list = await whatsappService.getChats();
    const newChat: WhatsAppChat = {
      id: `WA-CH-${String(list.length + 1).padStart(3, '0')}`,
      contactName,
      phone,
      unread: 0,
      lastMessage: 'Chat initialized.',
      lastUpdated: new Date().toISOString(),
      status: 'Active',
      messages: [
        {
          id: `msg-init-${Date.now()}`,
          text: 'Welcome to WhatsApp communication portal!',
          sender: 'agent',
          timestamp: new Date().toISOString(),
          mediaUrl: null,
          mediaType: null
        }
      ]
    };
    list.unshift(newChat);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newChat;
  },

  archiveChat: async (id: string): Promise<void> => {
    initLocalStorage();
    const list = await whatsappService.getChats();
    const chatIdx = list.findIndex((c) => c.id === id);
    if (chatIdx >= 0) {
      list[chatIdx].status = 'Archived';
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  },

  deleteChat: async (id: string): Promise<void> => {
    initLocalStorage();
    const list = await whatsappService.getChats();
    const filtered = list.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
