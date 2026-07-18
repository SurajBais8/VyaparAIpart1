/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WhatsAppChat } from '../../../types/marketing';
import { Phone, Check, CheckCheck, Archive, Trash2 } from 'lucide-react';

interface WhatsAppCardProps {
  chat: WhatsAppChat;
  isActive?: boolean;
  onClick?: () => void;
  onArchive?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export function WhatsAppCard({ chat, isActive, onClick, onArchive, onDelete }: WhatsAppCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-slate-100 cursor-pointer flex justify-between items-start transition-all ${
        isActive ? 'bg-indigo-50/50 border-l-4 border-l-indigo-600' : 'bg-white hover:bg-slate-50'
      }`}
    >
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-sans font-medium text-slate-800 text-sm truncate">
            {chat.contactName}
          </h4>
          <span className="text-[10px] font-mono text-slate-400">
            {new Date(chat.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <p className="text-xs text-slate-400 font-mono mb-1 truncate">{chat.phone}</p>
        
        <div className="flex items-center space-x-1">
          <CheckCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <p className="text-xs text-slate-500 truncate font-normal">{chat.lastMessage}</p>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between h-full space-y-3 shrink-0">
        {chat.unread > 0 ? (
          <span className="bg-indigo-600 text-white text-[10px] font-semibold h-4 w-4 rounded-full flex items-center justify-center font-mono">
            {chat.unread}
          </span>
        ) : (
          <span className="w-4 h-4" />
        )}

        <div className="flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity">
          {onArchive && (
            <button
              onClick={(e) => { e.stopPropagation(); onArchive(e); }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100"
              title="Archive Chat"
            >
              <Archive className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(e); }}
              className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100"
              title="Delete Chat"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
