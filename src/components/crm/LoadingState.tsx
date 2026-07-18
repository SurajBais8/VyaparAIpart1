/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Skeleton } from '../ui';

interface LoadingStateProps {
  rows?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ rows = 5 }) => {
  return (
    <div className="space-y-4 p-4 w-full">
      <div className="flex gap-4 mb-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-10 w-12" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-900 last:border-0">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-grow">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
};
