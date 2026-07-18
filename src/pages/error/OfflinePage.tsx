/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MinimalLayout } from '../../components/layouts/Layouts';
import { Button } from '../../components/ui';
import { WifiOff, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export const OfflinePage: React.FC = () => {
  const [checking, setChecking] = useState(false);

  const handleRetry = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      if (navigator.onLine) {
        toast.success('Connection restored!');
        window.history.back();
      } else {
        toast.error('Network still offline. Please check your physical connection.');
      }
    }, 1000);
  };

  return (
    <MinimalLayout>
      <div className="space-y-6 text-center max-w-sm px-4">
        <motion.div
          animate={{ scale: [1, 0.95, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-150/25 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400"
        >
          <WifiOff className="w-8 h-8" />
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">You are Offline</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
            Your connection to the gateway was interrupted. Local database cache is active and holding your values securely.
          </p>
        </div>

        <Button
          variant="primary"
          isLoading={checking}
          leftIcon={<RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />}
          onClick={handleRetry}
          className="w-full"
        >
          Check Connectivity
        </Button>
      </div>
    </MinimalLayout>
  );
};
