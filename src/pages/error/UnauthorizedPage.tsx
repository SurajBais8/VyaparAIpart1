/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MinimalLayout } from '../../components/layouts/Layouts';
import { Button } from '../../components/ui';
import { Lock, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MinimalLayout>
      <div className="space-y-6 text-center max-w-sm px-4">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-150/25 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400"
        >
          <Lock className="w-8 h-8" />
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white font-mono">401</h1>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Session Expired</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
            You must authenticate with a valid enterprise token before requesting access to this directory.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/login')}
          className="w-full"
        >
          Secure Login
        </Button>
      </div>
    </MinimalLayout>
  );
};
