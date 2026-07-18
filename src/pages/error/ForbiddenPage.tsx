/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MinimalLayout } from '../../components/layouts/Layouts';
import { Button } from '../../components/ui';
import { ShieldX, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MinimalLayout>
      <div className="space-y-6 text-center max-w-sm px-4">
        <motion.div
          animate={{ scale: [1, 0.9, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-150/25 flex items-center justify-center mx-auto text-red-600 dark:text-red-450"
        >
          <ShieldX className="w-8 h-8" />
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white font-mono">403</h1>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Access Forbidden</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
            Your role does not possess the credentials to execute operations within this secure partition.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/dashboard')}
          className="w-full"
        >
          Back to Workspace
        </Button>
      </div>
    </MinimalLayout>
  );
};
