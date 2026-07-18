import { Recommendation } from '../../../types/analytics';
import recommendationsMock from '../../../mock/recommendations.json';

const STORAGE_KEY = 'crm_v3_recommendations';

export const recommendationService = {
  getRecommendations: async (): Promise<Recommendation[]> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recommendationsMock));
    return recommendationsMock as Recommendation[];
  },

  updateRecommendations: async (list: Recommendation[]): Promise<Recommendation[]> => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list;
  },

  dismissRecommendation: async (id: string): Promise<void> => {
    const list = await recommendationService.getRecommendations();
    const filtered = list.filter(item => item.id !== id);
    await recommendationService.updateRecommendations(filtered);
  }
};
