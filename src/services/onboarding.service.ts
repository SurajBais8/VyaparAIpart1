/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { onboardingApi, MockBusinessData } from '../mock/onboardingApi';
import { storageService } from './storage.service';

export const onboardingService = {
  saveDraft: async (data: Partial<MockBusinessData>) => {
    const res = await onboardingApi.saveDraft(data);
    storageService.set('saas-draft-onboarding', res.data);
    return res;
  },

  getDraft: () => {
    return storageService.get<MockBusinessData>('saas-draft-onboarding');
  },

  validateTaxID: async (gstNumber: string) => {
    return onboardingApi.validateTaxID(gstNumber);
  },

  validateEmail: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
};
