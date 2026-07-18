/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MarketingTemplate } from '../../../types/marketing';
import { FileText, Copy, Mail, MessageSquare, Phone, Sparkles } from 'lucide-react';

interface TemplateCardProps {
  template: MarketingTemplate;
  onPreview?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export function TemplateCard({ template, onPreview, onDuplicate, onDelete }: TemplateCardProps) {
  const getIcon = () => {
    switch (template.type) {
      case 'Email':
        return <Mail className="w-5 h-5 text-indigo-500" />;
      case 'WhatsApp':
        return <MessageSquare className="w-5 h-5 text-emerald-500" />;
      case 'SMS':
        return <Phone className="w-5 h-5 text-amber-500" />;
    }
  };

  const getCategoryStyle = () => {
    switch (template.category) {
      case 'Transactional':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Marketing':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'Engagement':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="p-5 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-slate-50 rounded-lg">
            {getIcon()}
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getCategoryStyle()}`}>
            {template.category}
          </span>
        </div>

        <h3 className="font-sans font-medium text-slate-800 text-sm mb-1 truncate" title={template.name}>
          {template.name}
        </h3>
        
        {template.subject && (
          <p className="text-xs font-semibold text-slate-700 mb-2 truncate">
            Sub: {template.subject}
          </p>
        )}

        <p className="text-xs text-slate-400 font-mono line-clamp-3 mb-4 bg-slate-50/50 p-2 rounded-lg border border-slate-100 font-normal">
          {template.content}
        </p>

        {template.variables && template.variables.length > 0 && (
          <div className="mb-4">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-mono mb-1 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Dynamic Variables
            </p>
            <div className="flex flex-wrap gap-1">
              {template.variables.map((v, i) => (
                <span key={i} className="text-[10px] font-mono bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">
                  {"{{" + v + "}}"}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-slate-50 pt-3 text-xs">
        <div className="flex space-x-2">
          <button
            onClick={onPreview}
            className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
          >
            Preview
          </button>
          <button
            onClick={onDuplicate}
            className="text-slate-500 hover:text-slate-700 font-medium flex items-center"
            title="Duplicate Template"
          >
            <Copy className="w-3.5 h-3.5 mr-1" />
            Duplicate
          </button>
        </div>
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-slate-400 hover:text-rose-600 font-medium transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
