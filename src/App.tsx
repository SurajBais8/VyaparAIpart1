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

// Pages
import { SplashScreen } from './pages/SplashScreen';
import { WelcomeScreen } from './pages/WelcomeScreen';
import { LoginScreen } from './pages/LoginScreen';
import { RegisterScreen } from './pages/RegisterScreen';
import { OTPVerificationScreen } from './pages/OTPVerificationScreen';
import { ForgotPasswordScreen } from './pages/ForgotPasswordScreen';
import { ResetPasswordScreen } from './pages/ResetPasswordScreen';
import { OnboardingScreen } from './pages/OnboardingScreen';
import { DashboardPlaceholder } from './pages/DashboardPlaceholder';

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

          {/* Dashboard Frame: Placeholder of onboarded values */}
          <Route path="/dashboard" element={<DashboardPlaceholder />} />

          {/* Catch-all Redirect to Entry Splash */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      {/* Global Toast Provider */}
      <Toaster position="top-right" richColors closeButton theme={theme === 'system' ? 'light' : theme} />
    </div>
  );
}
