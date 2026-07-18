/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { themeService, ThemeConfig } from '../../services/theme.service';
import { Spinner } from '../ui';
import { Dialog } from '../ui';

// ==========================================
// THEME PROVIDER
// ==========================================
interface ThemeContextType {
  config: ThemeConfig;
  updateConfig: (config: Partial<ThemeConfig>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ThemeConfig>(themeService.getThemeConfig());

  useEffect(() => {
    themeService.applyThemeClasses(config);
  }, [config]);

  const updateConfig = (newConfig: Partial<ThemeConfig>) => {
    const updated = themeService.saveThemeConfig(newConfig);
    setConfig(updated);
  };

  return (
    <ThemeContext.Provider value={{ config, updateConfig }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme must be used within ThemeProvider');
  return context;
};

// ==========================================
// LOADING PROVIDER
// ==========================================
interface LoadingContextType {
  isLoading: boolean;
  showLoading: (text?: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');

  const showLoading = (text = 'Processing transaction...') => {
    setLoadingText(text);
    setIsLoading(true);
  };

  const hideLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md flex flex-col items-center justify-center z-[100] select-none">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xl flex flex-col items-center gap-4 max-w-[200px]">
            <Spinner className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-350 tracking-tight text-center">
              {loadingText}
            </p>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useGlobalLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) throw new Error('useGlobalLoading must be used within LoadingProvider');
  return context;
};

// ==========================================
// DIALOG PROVIDER
// ==========================================
interface DialogOptions {
  title: string;
  description: string;
  type?: 'confirm' | 'delete' | 'success' | 'warning';
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
}

interface DialogContextType {
  showDialog: (options: DialogOptions) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialogState, setDialogState] = useState<DialogOptions & { isOpen: boolean }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'confirm',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
  });

  const showDialog = (options: DialogOptions) => {
    setDialogState({
      ...options,
      isOpen: true,
    });
  };

  const handleClose = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <DialogContext.Provider value={{ showDialog }}>
      {children}
      <Dialog
        isOpen={dialogState.isOpen}
        onClose={handleClose}
        title={dialogState.title}
        description={dialogState.description}
        type={dialogState.type}
        confirmLabel={dialogState.confirmLabel}
        cancelLabel={dialogState.cancelLabel}
        onConfirm={dialogState.onConfirm}
      />
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) throw new Error('useDialog must be used within DialogProvider');
  return context;
};

// ==========================================
// ALL-IN-ONE PROVIDER WRAPPER
// ==========================================
export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <DialogProvider>
          {children}
        </DialogProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
};
