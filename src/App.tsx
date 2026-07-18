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
import { ContactProfile } from './pages/crm/ContactProfile';
import { DealsWorkspace } from './pages/crm/DealsWorkspace';
import { DealProfile } from './pages/crm/DealProfile';
import { ActivitiesWorkspace } from './pages/crm/ActivitiesWorkspace';
import { AnalyticsWorkspace } from './pages/crm/AnalyticsWorkspace';
import { ReportsWorkspace } from './pages/crm/ReportsWorkspace';

// Inventory & Supply Workspaces
import { InventoryWorkspace } from './pages/inventory/InventoryWorkspace';
import { WarehousesWorkspace } from './pages/inventory/WarehousesWorkspace';
import { TransfersWorkspace } from './pages/inventory/TransfersWorkspace';
import { PurchaseWorkspace } from './pages/inventory/PurchaseWorkspace';
import { SuppliersWorkspace } from './pages/inventory/SuppliersWorkspace';
import { InventoryAnalytics } from './pages/inventory/InventoryAnalytics';

// Financial & Business Intelligence Workspaces
import AccountingWorkspace from './features/accounting/pages/AccountingWorkspace';
import AnalyticsWorkspaceBI from './features/analytics/pages/AnalyticsWorkspace';

// HRMS Module 6 Workspaces
import HRWorkspace from './features/hr/pages/HRWorkspace';
import EmployeeWorkspace from './features/hr/pages/EmployeeWorkspace';
import AttendanceWorkspace from './features/hr/pages/AttendanceWorkspace';
import LeaveWorkspace from './features/hr/pages/LeaveWorkspace';
import PayrollWorkspace from './features/hr/pages/PayrollWorkspace';
import RecruitmentWorkspace from './features/hr/pages/RecruitmentWorkspace';
import PerformanceWorkspace from './features/hr/pages/PerformanceWorkspace';
import DepartmentWorkspace from './features/hr/pages/DepartmentWorkspace';
import HRReports from './features/hr/pages/HRReports';

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
            <Route path="/crm/contacts/:id" element={<ContactProfile />} />
            <Route path="/crm/deals" element={<DealsWorkspace />} />
            <Route path="/crm/deals/:id" element={<DealProfile />} />
            <Route path="/crm/activities" element={<ActivitiesWorkspace />} />
            <Route path="/crm/analytics" element={<AnalyticsWorkspace />} />
            <Route path="/crm/reports" element={<ReportsWorkspace />} />

            {/* Inventory & Supply Routes */}
            <Route path="/inventory/items" element={<InventoryWorkspace />} />
            <Route path="/inventory/warehouses" element={<WarehousesWorkspace />} />
            <Route path="/inventory/transfers" element={<TransfersWorkspace />} />
            <Route path="/inventory/purchase" element={<PurchaseWorkspace />} />
            <Route path="/inventory/suppliers" element={<SuppliersWorkspace />} />
            <Route path="/inventory/analytics" element={<InventoryAnalytics />} />

            {/* Financials & Business Intelligence */}
            <Route path="/accounting" element={<AccountingWorkspace />} />
            <Route path="/analytics" element={<AnalyticsWorkspaceBI />} />

            {/* HRMS Module 6 Routes */}
            <Route path="/hr" element={<HRWorkspace />} />
            <Route path="/hr/employees" element={<EmployeeWorkspace />} />
            <Route path="/hr/attendance" element={<AttendanceWorkspace />} />
            <Route path="/hr/leave" element={<LeaveWorkspace />} />
            <Route path="/hr/payroll" element={<PayrollWorkspace />} />
            <Route path="/hr/recruitment" element={<RecruitmentWorkspace />} />
            <Route path="/hr/performance" element={<PerformanceWorkspace />} />
            <Route path="/hr/departments" element={<DepartmentWorkspace />} />
            <Route path="/hr/reports" element={<HRReports />} />
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
