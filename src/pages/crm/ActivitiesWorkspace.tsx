/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ActivityItem } from '../../components/crm/ActivityItem';
import { Button } from '../../components/ui';
import { Activity, Phone, Calendar, Mail, MessageSquare, CheckSquare, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import activitiesJson from '../../mock/activities.json';

export const ActivitiesWorkspace: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [activeType, setActiveType] = useState<string>('all');

  useEffect(() => {
    // Simulated load delay
    setTimeout(() => {
      setList(activitiesJson);
      setFiltered(activitiesJson);
      setLoading(false);
    }, 200);
  }, []);

  const handleTypeSelect = (type: string) => {
    setActiveType(type);
    if (type === 'all') {
      setFiltered(list);
    } else {
      setFiltered(list.filter((act) => act.type === type));
    }
  };

  const types = [
    { id: 'all', label: 'All Activities', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'call', label: 'Phone Calls', icon: <Phone className="w-3.5 h-3.5" /> },
    { id: 'meeting', label: 'Video Meetings', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'email', label: 'Emails Sent', icon: <Mail className="w-3.5 h-3.5" /> },
    { id: 'whatsapp', label: 'WhatsApp Logs', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'task', label: 'Support Tasks', icon: <CheckSquare className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="space-y-5 text-left">
      
      {/* Title block row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" /> Activities Stream
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-light mt-0.5">
            Log, filter, and track chronological touchpoints from calls, WhatsApp, and customer emails.
          </p>
        </div>

        <button
          onClick={() => toast.success('Initializing activity export ledger...')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-indigo-600/10 transition-colors uppercase font-mono tracking-wide"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Sync Outlook Feed</span>
        </button>
      </div>

      {/* Categories select row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
        {types.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTypeSelect(t.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-all shrink-0
              ${activeType === t.id
                ? 'bg-indigo-600 border-indigo-600 text-white font-extrabold shadow-sm'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-650'}`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Analytical list */}
      {loading ? (
        <div className="py-12 flex justify-center text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3 max-w-4xl">
          {filtered.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border rounded-2xl">
          <span className="text-xs text-slate-400">No logs found matching selection.</span>
        </div>
      )}

    </div>
  );
};
