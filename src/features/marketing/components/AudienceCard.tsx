/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Audience } from '../../../types/marketing';
import { Users, Filter, Sparkles, Plus } from 'lucide-react';

interface AudienceCardProps {
  audience: Audience;
  onSelect?: () => void;
}

export function AudienceCard({ audience, onSelect }: AudienceCardProps) {
  return (
    <div className="p-5 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-mono bg-slate-50 text-slate-600 px-2 py-0.5 rounded border">
            {audience.type}
          </span>
        </div>

        <h3 className="font-sans font-medium text-slate-800 text-base mb-1">
          {audience.name}
        </h3>
        <p className="text-xs text-slate-500 mb-4 font-normal">
          {audience.description}
        </p>

        <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 mb-4 bg-indigo-50/50 p-2.5 rounded-lg w-fit">
          <Users className="w-4 h-4" />
          <span>{audience.count.toLocaleString()} Contacts</span>
        </div>

        {audience.filters && Object.keys(audience.filters).length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono mb-1.5 flex items-center">
              <Filter className="w-3 h-3 mr-1" />
              Active Filters
            </p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(audience.filters).map(([key, val]) => (
                <span key={key} className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {key}: {val}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {audience.aiSuggestions && audience.aiSuggestions.length > 0 && (
        <div className="mt-2 pt-3 border-t border-slate-100 bg-violet-50/30 p-2.5 rounded-lg border border-violet-100/50">
          <p className="text-[10px] text-violet-600 uppercase tracking-wider font-mono font-semibold flex items-center mb-1">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            AI Suggestion
          </p>
          <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
            {audience.aiSuggestions.map((sug, i) => (
              <li key={i}>{sug}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
