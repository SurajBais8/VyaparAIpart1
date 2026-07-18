import { GSTData } from '../../../types/accounting';
import gstMock from '../../../mock/gst.json';

const STORAGE_KEY = 'crm_v3_gst_data';

export const gstService = {
  getGstData: async (): Promise<GSTData> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gstMock));
    return gstMock as GSTData;
  },

  updateGstData: async (data: GSTData): Promise<GSTData> => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }
};
