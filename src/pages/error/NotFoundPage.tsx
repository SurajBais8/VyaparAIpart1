/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MinimalLayout } from '../../components/layouts/Layouts';
import { Button } from '../../components/ui';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MinimalLayout>
      <div className="space-y-6 text-center max-w-sm px-4">
        <motion.div
          animate={{ scale: [0.95, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-150/25 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400"
        >
          <ShieldAlert className="w-8 h-8" />
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white font-mono">404</h1>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Page Not Found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
            The workspace coordinates you specified do not map to any active environment.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/')}
          className="w-full"
        >
          Return to Portal
        </Button>
      </div>
    </MinimalLayout>
  );
};
