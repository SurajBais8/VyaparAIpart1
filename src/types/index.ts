/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  businessName?: string;
  businessType?: string;
  onboardingCompleted: boolean;
  onboardingStep: number;
}

export type ThemeType = 'light' | 'dark' | 'system';
export type LanguageType = 'en' | 'es' | 'hi' | 'zh';

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  theme: ThemeType;
  language: LanguageType;
  rememberMe: boolean;
  tempEmail: string | null; // For Forgot Password & Registration OTP flows
  tempPhone: string | null;
}

export interface BusinessInfo {
  businessName: string;
  gstNumber: string;
  panNumber?: string;
  businessType: string;
}

export interface CompanyInfo {
  address: string;
  state: string;
  city: string;
  pincode: string;
}

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  ifsc: string;
  upiId: string;
}

export interface TeamInvite {
  email: string;
  role: 'Admin' | 'Member' | 'Manager' | 'Billing';
}

export interface OnboardingState {
  businessInfo: BusinessInfo;
  companyInfo: CompanyInfo;
  logoUrl: string | null;
  bankDetails: BankDetails;
  teamInvites: TeamInvite[];
  currentStep: number;
}
