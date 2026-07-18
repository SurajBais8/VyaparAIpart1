/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EmailMessage } from '../../../types/marketing';
import { Mail, Send, FileText, Clock, Trash2, CheckCircle } from 'lucide-react';

interface EmailCardProps {
  email: EmailMessage;
  onSelect?: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export function EmailCard({ email, onSelect, onDelete }: EmailCardProps) {
  const getBadgeStyle = () => {
    switch (email.status) {
      case 'Inbox':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Outbox':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Draft':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Scheduled':
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getIcon = () => {
    switch (email.status) {
      case 'Inbox':
        return <Mail className="w-4 h-4 text-blue-500" />;
      case 'Outbox':
        return <Send className="w-4 h-4 text-emerald-500" />;
      case 'Draft':
        return <FileText className="w-4 h-4 text-slate-500" />;
      case 'Scheduled':
        return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`p-4 bg-white border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-sm transition-all cursor-pointer flex justify-between items-start ${
        email.status === 'Inbox' && !email.read ? 'border-l-4 border-l-indigo-600 bg-indigo-50/10' : ''
      }`}
    >
      <div className="flex-1 min-w-0 pr-3">
        <div className="flex items-center space-x-2 mb-1.5">
          <div className="p-1 bg-slate-50 rounded">
            {getIcon()}
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getBadgeStyle()}`}>
            {email.status}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {new Date(email.timestamp).toLocaleDateString()} {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 mb-1">
          <span className="text-xs font-semibold text-slate-500 shrink-0">
            {email.status === 'Inbox' ? 'From:' : 'To:'}
          </span>
          <span className="text-xs text-slate-700 truncate font-mono">
            {email.status === 'Inbox' ? email.from : email.to}
          </span>
        </div>

        <h4 className={`font-sans text-sm mb-1 truncate ${email.status === 'Inbox' && !email.read ? 'font-semibold text-slate-900' : 'font-medium text-slate-800'}`}>
          {email.subject}
        </h4>
        <p className="text-xs text-slate-500 line-clamp-2 font-normal">
          {email.body}
        </p>
      </div>

      <div className="shrink-0 pt-1">
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(e); }}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Message"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
