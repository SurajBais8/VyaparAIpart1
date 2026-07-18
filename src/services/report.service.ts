/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import reportsJson from '../mock/reports.json';

export const reportService = {
  getReportData: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return reportsJson;
  },

  exportToFormat: async (reportType: string, format: 'PDF' | 'Excel' | 'CSV') => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Simulate export file payload
    const dummyBlob = new Blob([JSON.stringify({ reportType, exportedAt: new Date().toISOString(), format })], { type: 'text/plain' });
    const url = URL.createObjectURL(dummyBlob);
    return {
      success: true,
      fileName: `${reportType.replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`,
      downloadUrl: url
    };
  }
};
