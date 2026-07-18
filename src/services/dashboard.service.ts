/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import dashboardJson from '../mock/dashboard.json';

export const dashboardService = {
  getDashboardData: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return dashboardJson;
  },

  getAIRecommendation: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return dashboardJson.aiRecommendation;
  }
};
