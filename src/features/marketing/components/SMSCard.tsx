/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SMSMessage } from '../../../types/marketing';
import { MessageSquare, Check, X, AlertCircle, Clock } from 'lucide-react';

interface SMSCardProps {
  sms: SMSMessage;
  onDelete?: (e: React.MouseEvent) => void;
}

export function SMSCard({ sms, onDelete }: SMSCardProps) {
  const getStatusColor = () => {
    switch (sms.status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Sent':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Failed':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getStatusIcon = () => {
    switch (sms.status) {
      case 'Delivered':
        return <Check className="w-3 h-3 mr-1" />;
      case 'Sent':
        return <Check className="w-3 h-3 mr-1" />;
      case 'Failed':
        return <X className="w-3 h-3 mr-1" />;
      case 'Pending':
        return <Clock className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <div className="p-4 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1 bg-amber-50 text-amber-600 rounded">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-700 font-mono">
            {sms.recipient}
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          {new Date(sms.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <p className="text-xs text-slate-600 font-normal bg-slate-50 p-2.5 rounded-lg mb-3 border border-slate-100">
        {sms.message}
      </p>

      <div className="flex items-center justify-between text-xs">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border flex items-center ${getStatusColor()}`}>
          {getStatusIcon()}
          {sms.status}
        </span>
        <span className="text-[11px] font-mono text-slate-500">
          Billing: <span className="font-semibold text-slate-700">₹{sms.cost.toFixed(2)}</span>
        </span>
      </div>
    </div>
  );
}
