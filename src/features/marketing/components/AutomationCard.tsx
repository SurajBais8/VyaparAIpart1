/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AutomationWorkflow } from '../../../types/marketing';
import { GitPullRequest, ToggleLeft, ToggleRight, Sparkles, AlertCircle } from 'lucide-react';

interface AutomationCardProps {
  workflow: AutomationWorkflow;
  onToggleStatus?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function AutomationCard({ workflow, onToggleStatus, onEdit, onDelete }: AutomationCardProps) {
  const isActive = workflow.status === 'Active';

  return (
    <div className="p-5 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <GitPullRequest className="w-5 h-5" />
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleStatus?.(); }}
            className={`flex items-center space-x-1 text-xs font-semibold focus:outline-none transition-colors ${
              isActive ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            {isActive ? (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-1" />
                <span>Active</span>
                <ToggleRight className="w-5 h-5 ml-1" />
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-slate-300 mr-1" />
                <span>Inactive</span>
                <ToggleLeft className="w-5 h-5 ml-1" />
              </>
            )}
          </button>
        </div>

        <h3 className="font-sans font-medium text-slate-800 text-base mb-1 hover:text-indigo-600 cursor-pointer transition-colors" onClick={onEdit}>
          {workflow.name}
        </h3>
        
        <div className="space-y-2 mt-4">
          <div className="flex items-start text-xs">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider w-20 shrink-0 pt-0.5">Trigger:</span>
            <span className="font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{workflow.trigger}</span>
          </div>

          <div className="flex items-start text-xs">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider w-20 shrink-0 pt-0.5">Condition:</span>
            <span className="text-slate-600 font-medium">{workflow.conditions}</span>
          </div>

          <div className="flex items-start text-xs">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider w-20 shrink-0 pt-0.5">Steps:</span>
            <span className="text-indigo-600 font-semibold font-mono bg-indigo-50 px-2.5 py-0.5 rounded-full">{workflow.steps.length} Nodes</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between text-xs">
        <button
          onClick={onEdit}
          className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
        >
          Configure Builder →
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-slate-400 hover:text-rose-600 transition-colors font-medium"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
