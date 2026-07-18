/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { OnboardingState, BusinessInfo, CompanyInfo, BankDetails, TeamInvite } from '../types';

interface OnboardingStoreActions {
  setBusinessInfo: (info: Partial<BusinessInfo>) => void;
  setCompanyInfo: (info: Partial<CompanyInfo>) => void;
  setLogoUrl: (url: string | null) => void;
  setBankDetails: (details: Partial<BankDetails>) => void;
  addTeamInvite: (invite: TeamInvite) => void;
  removeTeamInvite: (email: string) => void;
  setStep: (step: number) => void;
  resetOnboarding: () => void;
}

const initialBusinessInfo: BusinessInfo = {
  businessName: '',
  gstNumber: '',
  panNumber: '',
  businessType: 'SaaS',
};

const initialCompanyInfo: CompanyInfo = {
  address: '',
  state: '',
  city: '',
  pincode: '',
};

const initialBankDetails: BankDetails = {
  accountName: '',
  accountNumber: '',
  ifsc: '',
  upiId: '',
};

export const useOnboardingStore = create<OnboardingState & OnboardingStoreActions>((set) => ({
  businessInfo: initialBusinessInfo,
  companyInfo: initialCompanyInfo,
  logoUrl: null,
  bankDetails: initialBankDetails,
  teamInvites: [],
  currentStep: 1,

  setBusinessInfo: (info) =>
    set((state) => ({ businessInfo: { ...state.businessInfo, ...info } })),

  setCompanyInfo: (info) =>
    set((state) => ({ companyInfo: { ...state.companyInfo, ...info } })),

  setLogoUrl: (logoUrl) => set({ logoUrl }),

  setBankDetails: (details) =>
    set((state) => ({ bankDetails: { ...state.bankDetails, ...details } })),

  addTeamInvite: (invite) =>
    set((state) => {
      // Prevent duplicate emails
      if (state.teamInvites.some((t) => t.email.toLowerCase() === invite.email.toLowerCase())) {
        return {};
      }
      return { teamInvites: [...state.teamInvites, invite] };
    }),

  removeTeamInvite: (email) =>
    set((state) => ({
      teamInvites: state.teamInvites.filter((t) => t.email !== email),
    })),

  setStep: (currentStep) => set({ currentStep }),

  resetOnboarding: () =>
    set({
      businessInfo: initialBusinessInfo,
      companyInfo: initialCompanyInfo,
      logoUrl: null,
      bankDetails: initialBankDetails,
      teamInvites: [],
      currentStep: 1,
    }),
}));
