import { BusinessScore, ExecutiveDashboardData } from '../../../types/analytics';
import businessScoreMock from '../../../mock/businessScore.json';
import executiveDashboardMock from '../../../mock/executiveDashboard.json';

const BI_SCORE_KEY = 'crm_v3_bi_score';
const EXEC_DASHBOARD_KEY = 'crm_v3_exec_dashboard';

export const businessIntelligenceService = {
  getBusinessScore: async (): Promise<BusinessScore> => {
    const stored = localStorage.getItem(BI_SCORE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(BI_SCORE_KEY, JSON.stringify(businessScoreMock));
    return businessScoreMock as BusinessScore;
  },

  getExecutiveDashboard: async (): Promise<ExecutiveDashboardData> => {
    const stored = localStorage.getItem(EXEC_DASHBOARD_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(EXEC_DASHBOARD_KEY, JSON.stringify(executiveDashboardMock));
    return executiveDashboardMock as ExecutiveDashboardData;
  }
};
