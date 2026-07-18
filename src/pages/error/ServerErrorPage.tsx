/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MinimalLayout } from '../../components/layouts/Layouts';
import { Button } from '../../components/ui';
import { ServerCrash, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

export const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MinimalLayout>
      <div className="space-y-6 text-center max-w-sm px-4">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
          className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-150/25 flex items-center justify-center mx-auto text-red-600 dark:text-red-450"
        >
          <ServerCrash className="w-8 h-8" />
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white font-mono">500</h1>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Server Exception</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
            The clearing service experienced an internal anomaly. Our operations matrix is actively resolving it.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<RotateCcw className="w-4 h-4" />}
          onClick={() => window.location.reload()}
          className="w-full"
        >
          Reload Session
        </Button>
      </div>
    </MinimalLayout>
  );
};
