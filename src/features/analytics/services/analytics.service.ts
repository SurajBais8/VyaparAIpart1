import { AnalyticsData } from '../../../types/analytics';
import analyticsMock from '../../../mock/analytics.json';

const STORAGE_KEY = 'crm_v3_analytics_data';

export const analyticsService = {
  getAnalyticsData: async (): Promise<AnalyticsData> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(analyticsMock));
    return analyticsMock as AnalyticsData;
  },

  updateAnalyticsData: async (data: AnalyticsData): Promise<AnalyticsData> => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }
};
