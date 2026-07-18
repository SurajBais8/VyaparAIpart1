import { ForecastItem } from '../../../types/analytics';
import forecastMock from '../../../mock/forecast.json';

const STORAGE_KEY = 'crm_v3_forecast_data';

export const forecastService = {
  getForecasts: async (): Promise<ForecastItem[]> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(forecastMock));
    return forecastMock as ForecastItem[];
  },

  updateForecasts: async (data: ForecastItem[]): Promise<ForecastItem[]> => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }
};
