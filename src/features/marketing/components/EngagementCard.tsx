/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, MessageSquare, Phone } from 'lucide-react';

interface EngagementCardProps {
  emailSent: number;
  whatsAppSent: number;
  smsSent: number;
}

export function EngagementCard({ emailSent, whatsAppSent, smsSent }: EngagementCardProps) {
  const items = [
    {
      name: 'Email Packets Sent',
      count: emailSent,
      percentage: '99.3% Delivery',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      icon: <Mail className="w-5 h-5" />
    },
    {
      name: 'WhatsApp Promos Sent',
      count: whatsAppSent,
      percentage: '99.8% Read Index',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      name: 'SMS Transactionals',
      count: smsSent,
      percentage: '96.7% Network Ingress',
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      icon: <Phone className="w-5 h-5" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item, idx) => (
        <div key={idx} className="p-5 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-colors flex items-center space-x-4">
          <div className={`p-3 rounded-lg border ${item.color}`}>
            {item.icon}
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">{item.name}</p>
            <h3 className="text-xl font-bold text-slate-800 font-mono mt-0.5">{item.count.toLocaleString()}</h3>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 mt-1 inline-block">
              {item.percentage}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
