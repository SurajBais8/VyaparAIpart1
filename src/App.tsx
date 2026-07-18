/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

// Store & Layouts
import { useAuthStore } from './store/authStore';
import { AuthLayout } from './components/AuthLayout';
import { CrmLayout } from './components/layout/CrmLayout';

// Pages
import { SplashScreen } from './pages/SplashScreen';
import { WelcomeScreen } from './pages/WelcomeScreen';
import { LoginScreen } from './pages/LoginScreen';
import { RegisterScreen } from './pages/RegisterScreen';
import { OTPVerificationScreen } from './pages/OTPVerificationScreen';
import { ForgotPasswordScreen } from './pages/ForgotPasswordScreen';
import { ResetPasswordScreen } from './pages/ResetPasswordScreen';
import { OnboardingScreen } from './pages/OnboardingScreen';

// Workspaces
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { DashboardReports } from './pages/dashboard/DashboardReports';
import { DashboardRevenue } from './pages/dashboard/DashboardRevenue';
import { DashboardOrders } from './pages/dashboard/DashboardOrders';
import { DashboardCustomers } from './pages/dashboard/DashboardCustomers';
import { DashboardLeads } from './pages/dashboard/DashboardLeads';
import { CustomersWorkspace } from './pages/crm/CustomersWorkspace';
import { CustomerProfile } from './pages/crm/CustomerProfile';
import { LeadsWorkspace } from './pages/crm/LeadsWorkspace';
import { LeadProfile } from './pages/crm/LeadProfile';
import { LeadAnalytics } from './pages/crm/LeadAnalytics';
import { CompaniesWorkspace } from './pages/crm/CompaniesWorkspace';
import { CompanyProfile } from './pages/crm/CompanyProfile';
import { ContactsWorkspace } from './pages/crm/ContactsWorkspace';
import { DealsWorkspace } from './pages/crm/DealsWorkspace';
import { ActivitiesWorkspace } from './pages/crm/ActivitiesWorkspace';
import { AnalyticsWorkspace } from './pages/crm/AnalyticsWorkspace';
import { ReportsWorkspace } from './pages/crm/ReportsWorkspace';

// Router Wrapper for AuthLayout pages
const AuthLayoutWrapper: React.FC = () => {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
};

export default function App() {
  const { theme, setTheme } = useAuthStore();

  // On mount, apply saved or system theme to the HTML tag
  useEffect(() => {
    setTheme(theme);
  }, []);

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <BrowserRouter>
        <Routes>
          {/* Main Entry: Splash Screen with animated loader */}
          <Route path="/" element={<SplashScreen />} />

          {/* Core Auth Flow with Side Banner Layout */}
          <Route element={<AuthLayoutWrapper />}>
            <Route path="/welcome" element={<WelcomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
            <Route path="/reset-password" element={<ResetPasswordScreen />} />
            <Route path="/otp" element={<OTPVerificationScreen />} />
          </Route>

          {/* Onboarding Flow: Step roadmap rail */}
          <Route path="/onboarding" element={<OnboardingScreen />} />

          {/* Consolidated Platform: Dashboard & CRM */}
          <Route element={<CrmLayout />}>
            <Route path="/dashboard" element={<Navigate to="/dashboard/overview" replace />} />
            <Route path="/dashboard/overview" element={<DashboardOverview />} />
            <Route path="/dashboard/reports" element={<DashboardReports />} />
            <Route path="/dashboard/revenue" element={<DashboardRevenue />} />
            <Route path="/dashboard/orders" element={<DashboardOrders />} />
            <Route path="/dashboard/customers" element={<DashboardCustomers />} />
            <Route path="/dashboard/leads" element={<DashboardLeads />} />

            <Route path="/crm" element={<Navigate to="/crm/customers" replace />} />
            <Route path="/crm/customers" element={<CustomersWorkspace />} />
            <Route path="/crm/customers/:id" element={<CustomerProfile />} />
            <Route path="/crm/leads" element={<LeadsWorkspace />} />
            <Route path="/crm/leads/analytics" element={<LeadAnalytics />} />
            <Route path="/crm/leads/:id" element={<LeadProfile />} />
            <Route path="/crm/companies" element={<CompaniesWorkspace />} />
            <Route path="/crm/companies/:id" element={<CompanyProfile />} />
            <Route path="/crm/contacts" element={<ContactsWorkspace />} />
            <Route path="/crm/deals" element={<DealsWorkspace />} />
            <Route path="/crm/activities" element={<ActivitiesWorkspace />} />
            <Route path="/crm/analytics" element={<AnalyticsWorkspace />} />
            <Route path="/crm/reports" element={<ReportsWorkspace />} />
          </Route>

          {/* Catch-all Redirect to Entry Splash */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      {/* Global Toast Provider */}
      <Toaster position="top-right" richColors closeButton theme={theme === 'system' ? 'light' : theme} />
    </div>
  );
}
