/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface DateRangePickerProps {
  onRangeSelect: (range: { start: string; end: string; label: string }) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ onRangeSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [label, setLabel] = useState('Last 30 Days');

  const presets = [
    { label: 'Today', days: 0 },
    { label: 'Yesterday', days: 1 },
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'This Month', days: 30 } // generic shortcut
  ];

  const handleSelectPreset = (preset: typeof presets[0]) => {
    setLabel(preset.label);
    setIsOpen(false);

    const end = new Date().toISOString().split('T')[0];
    const startDateObj = new Date();
    startDateObj.setDate(startDateObj.getDate() - preset.days);
    const start = startDateObj.toISOString().split('T')[0];

    onRangeSelect({ start, end, label: preset.label });
  };

  return (
    <div className="relative inline-block text-left z-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/75 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-all duration-300 shadow-2xs"
      >
        <Calendar className="w-3.5 h-3.5 text-slate-400" />
        <span>{label}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl py-1.5 z-40 text-left text-xs font-bold text-slate-600 dark:text-slate-350">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handleSelectPreset(preset)}
                className="w-full px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-left cursor-pointer transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
