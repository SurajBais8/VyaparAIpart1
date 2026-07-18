/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Box } from 'lucide-react';
import { Button } from '../ui';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No results discovered",
  description = "Refine your filters, search terms, or try adding a new entry manually.",
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/10">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4 shadow-sm">
        <Box className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-250">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-450 mt-1.5 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="outline" className="mt-5 py-2 px-4 text-xs font-bold" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
