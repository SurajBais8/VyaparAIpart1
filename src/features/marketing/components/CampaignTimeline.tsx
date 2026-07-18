/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Clock, Send, BarChart2, Star, CheckCircle } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  time: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  type: 'draft' | 'dispatch' | 'analyze' | 'finalize';
}

interface CampaignTimelineProps {
  events?: TimelineEvent[];
}

export function CampaignTimeline({ events }: CampaignTimelineProps) {
  const defaultEvents: TimelineEvent[] = [
    {
      id: 'e1',
      title: 'Campaign Parameters Formulated',
      time: 'July 10, 2026 - 09:00 AM',
      description: 'Defined primary messaging guidelines and budget ceilings.',
      status: 'completed',
      type: 'draft'
    },
    {
      id: 'e2',
      title: 'Target Audience Segment Synthesized',
      time: 'July 10, 2026 - 11:30 AM',
      description: 'Configured active filters mapping VIP tier subscription logs.',
      status: 'completed',
      type: 'draft'
    },
    {
      id: 'e3',
      title: 'Initial Template Dispatch Blasts',
      time: 'July 15, 2026 - 10:00 AM',
      description: 'Broadcasted packets to first 10k audience slots via central mail gateways.',
      status: 'completed',
      type: 'dispatch'
    },
    {
      id: 'e4',
      title: 'Active Performance Monitoring',
      time: 'Ongoing Tracker Stream',
      description: 'Listening for real-time customer CTR links and newsletter conversions.',
      status: 'current',
      type: 'analyze'
    },
    {
      id: 'e5',
      title: 'ROI Calculations & Archival Logs',
      time: 'July 25, 2026 (Scheduled)',
      description: 'Lock conversion metrics and disburse comprehensive reporting logs to financial desks.',
      status: 'upcoming',
      type: 'finalize'
    }
  ];

  const activeEvents = events || defaultEvents;

  const getIcon = (type: TimelineEvent['type'], status: TimelineEvent['status']) => {
    switch (type) {
      case 'draft':
        return <Clock className={`w-4 h-4 ${status === 'completed' ? 'text-white' : 'text-slate-400'}`} />;
      case 'dispatch':
        return <Send className={`w-4 h-4 ${status === 'completed' ? 'text-white' : 'text-slate-400'}`} />;
      case 'analyze':
        return <BarChart2 className={`w-4 h-4 ${status === 'current' ? 'text-white' : 'text-slate-400'}`} />;
      case 'finalize':
        return <CheckCircle className={`w-4 h-4 ${status === 'upcoming' ? 'text-slate-400' : 'text-white'}`} />;
    }
  };

  const getCircleStyle = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500 border-emerald-600 ring-4 ring-emerald-100';
      case 'current':
        return 'bg-indigo-600 border-indigo-700 ring-4 ring-indigo-100 animate-pulse';
      case 'upcoming':
        return 'bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activeEvents.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== activeEvents.length - 1 ? (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full border flex items-center justify-center ${getCircleStyle(event.status)}`}>
                    {getIcon(event.type, event.status)}
                  </span>
                </div>
                <div className="flex-1 min-w-0 pt-1.5">
                  <div className="flex items-center justify-between mb-1">
                    <p className={`text-sm ${event.status === 'completed' ? 'font-medium text-slate-800' : event.status === 'current' ? 'font-semibold text-indigo-600' : 'text-slate-400 font-normal'}`}>
                      {event.title}
                    </p>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">{event.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-normal">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
