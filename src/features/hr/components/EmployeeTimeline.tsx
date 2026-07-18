/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Award, Briefcase, Calendar, Star, ShieldCheck, Heart } from 'lucide-react';
import { Employee } from '../../../types/hr';

interface TimelineEvent {
  title: string;
  date: string;
  description: string;
  icon: React.ReactNode;
  type: 'achievement' | 'onboarding' | 'review' | 'milestone';
}

interface EmployeeTimelineProps {
  employee: Employee;
  id?: string;
}

export const EmployeeTimeline: React.FC<EmployeeTimelineProps> = ({
  employee,
  id
}) => {
  // Construct events dynamically from employee data
  const events: TimelineEvent[] = [
    {
      title: 'Integrated to Corporate Squad',
      date: employee.joiningDate,
      description: `Officially on-boarded as ${employee.designation} under the ${employee.department} cluster. Started probation loops.`,
      icon: <Briefcase className="w-3.5 h-3.5 text-indigo-500" />,
      type: 'onboarding'
    }
  ];

  if (employee.notes && employee.notes.length > 0) {
    employee.notes.forEach((note) => {
      events.push({
        title: `Manager Assessment Log`,
        date: note.date,
        description: note.text,
        icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />,
        type: 'review'
      });
    });
  }

  // Add a general milestone based on rating
  if (employee.performanceRating >= 4.5) {
    events.push({
      title: 'Top Performance Evaluation Rank',
      date: '2026-06-30',
      description: `Recognized as high-indexing contributor (Rating: ${employee.performanceRating}/5.0). Outstanding system architecture metrics.`,
      icon: <Award className="w-3.5 h-3.5 text-amber-500" />,
      type: 'achievement'
    });
  }

  // Sort by date descending
  const sortedEvents = events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div id={id || `timeline-${employee.id}`} className="space-y-6 text-left relative pl-5 border-l border-slate-100 dark:border-slate-850">
      {sortedEvents.map((event, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
          className="relative space-y-1 pb-4 last:pb-0"
        >
          {/* Bullet node */}
          <div className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-slate-950 border-2 border-indigo-500 flex items-center justify-center shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider bg-indigo-50/50 dark:bg-slate-950 px-2 py-0.5 rounded-lg border border-indigo-100/10 flex items-center gap-1">
              {event.icon} {event.title}
            </span>
            <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 font-bold">
              {event.date}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans max-w-xl pl-1">
            {event.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
};
