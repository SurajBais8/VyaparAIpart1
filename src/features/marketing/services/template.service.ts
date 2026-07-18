/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import templatesJson from '../../../mock/templates.json';
import { MarketingTemplate } from '../../../types/marketing';

const STORAGE_KEY = 'saas-marketing-templates';

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templatesJson));
  }
};

export const templateService = {
  getTemplates: async (): Promise<MarketingTemplate[]> => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 80));
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  getTemplateById: async (id: string): Promise<MarketingTemplate | null> => {
    const list = await templateService.getTemplates();
    return list.find((t) => t.id === id) || null;
  },

  createTemplate: async (template: Partial<MarketingTemplate>): Promise<MarketingTemplate> => {
    initLocalStorage();
    const list = await templateService.getTemplates();
    const newId = `TEMP-${template.type === 'Email' ? 'EM' : template.type === 'WhatsApp' ? 'WA' : 'SMS'}-${String(list.length + 1).padStart(3, '0')}`;
    const newTemplate: MarketingTemplate = {
      id: newId,
      name: template.name || 'Untitled Template',
      type: template.type || 'Email',
      category: template.category || 'Marketing',
      content: template.content || '',
      variables: template.variables || [],
      subject: template.subject
    };
    list.unshift(newTemplate);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newTemplate;
  },

  updateTemplate: async (id: string, data: Partial<MarketingTemplate>): Promise<MarketingTemplate> => {
    initLocalStorage();
    const list = await templateService.getTemplates();
    const idx = list.findIndex((t) => t.id === id);
    if (idx < 0) throw new Error('Template not found');
    list[idx] = { ...list[idx], ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list[idx];
  },

  deleteTemplate: async (id: string): Promise<void> => {
    initLocalStorage();
    const list = await templateService.getTemplates();
    const filtered = list.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
