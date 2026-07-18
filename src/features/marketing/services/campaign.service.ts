/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import campaignsJson from '../../../mock/campaigns.json';
import { Campaign } from '../../../types/marketing';

const STORAGE_KEY = 'saas-marketing-campaigns';

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaignsJson));
  }
};

export const campaignService = {
  getCampaigns: async (): Promise<Campaign[]> => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  getCampaignById: async (id: string): Promise<Campaign | null> => {
    const list = await campaignService.getCampaigns();
    return list.find((c) => c.id === id) || null;
  },

  createCampaign: async (campaign: Partial<Campaign>): Promise<Campaign> => {
    initLocalStorage();
    const list = await campaignService.getCampaigns();
    const newId = `CAMP-${String(list.length + 1).padStart(3, '0')}`;
    const newCampaign: Campaign = {
      id: newId,
      name: campaign.name || 'Untitled Campaign',
      type: campaign.type || 'Email',
      audience: campaign.audience || 'All Subscribers',
      channel: campaign.channel || 'Email',
      status: campaign.status || 'Draft',
      startDate: campaign.startDate || new Date().toISOString().split('T')[0],
      endDate: campaign.endDate || new Date().toISOString().split('T')[0],
      budget: campaign.budget || 0,
      conversion: campaign.conversion || 0,
      description: campaign.description || '',
      subject: campaign.subject || '',
      body: campaign.body || '',
      sentCount: campaign.sentCount || 0,
      openedCount: campaign.openedCount || 0,
      clickedCount: campaign.clickedCount || 0,
      leadsCount: campaign.leadsCount || 0,
      revenue: campaign.revenue || 0
    };
    list.unshift(newCampaign);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newCampaign;
  },

  updateCampaign: async (id: string, data: Partial<Campaign>): Promise<Campaign> => {
    const list = await campaignService.getCampaigns();
    const idx = list.findIndex((c) => c.id === id);
    if (idx < 0) throw new Error('Campaign not found');
    list[idx] = { ...list[idx], ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list[idx];
  },

  deleteCampaign: async (id: string): Promise<void> => {
    const list = await campaignService.getCampaigns();
    const filtered = list.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  bulkUpdateStatus: async (ids: string[], status: Campaign['status']): Promise<void> => {
    const list = await campaignService.getCampaigns();
    const updated = list.map((c) => (ids.includes(c.id) ? { ...c, status } : c));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  bulkDelete: async (ids: string[]): Promise<void> => {
    const list = await campaignService.getCampaigns();
    const filtered = list.filter((c) => !ids.includes(c.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
