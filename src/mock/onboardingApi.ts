/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import businessJson from './business.json';

export interface MockBusinessData {
  businessName: string;
  gstNumber: string;
  panNumber?: string;
  businessType: string;
  industry: string;
  currency: string;
  timezone: string;
  country: string;
  employees: string;
}

export const onboardingApi = {
  saveDraft: async (data: Partial<MockBusinessData>): Promise<{ success: boolean; data: any }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Simulate updating backend DB
    const updated = { ...businessJson[0], ...data };
    return { success: true, data: updated };
  },

  validateTaxID: async (gstNumber: string): Promise<{ isValid: boolean; companyName?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    // Simulated GSTIN validation regex: 2 digits + 5 letters + 4 digits + 1 letter + 1 char + Z + 1 char
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (gstRegex.test(gstNumber.toUpperCase())) {
      return { isValid: true, companyName: 'ACME GLOBAL SOLUTIONS (GST VERIFIED)' };
    }
    return { isValid: false };
  }
};
