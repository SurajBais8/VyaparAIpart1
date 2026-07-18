/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Target, Award, ShieldAlert, Sparkles } from 'lucide-react';

interface ConversionCardProps {
  totalLeads: number;
  conversionRate: number;
  activeCampaigns: number;
}

export function ConversionCard({ totalLeads, conversionRate, activeCampaigns }: ConversionCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-5 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-xl shadow-sm relative overflow-hidden">
        <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
          <Target className="w-32 h-32" />
        </div>
        <p className="text-xs font-mono uppercase tracking-wider text-indigo-100">Total Leads Captured</p>
        <h3 className="text-2xl font-bold font-mono mt-1">{(totalLeads || 0).toLocaleString()}</h3>
        <p className="text-xs text-indigo-100 mt-2 flex items-center font-normal">
          <Sparkles className="w-3.5 h-3.5 mr-1" />
          Organic Growth Index: +14.2%
        </p>
      </div>

      <div className="p-5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl shadow-sm relative overflow-hidden">
        <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
          <Award className="w-32 h-32" />
        </div>
        <p className="text-xs font-mono uppercase tracking-wider text-emerald-100">Average Conversion Rate</p>
        <h3 className="text-2xl font-bold font-mono mt-1">{conversionRate || 16.8}%</h3>
        <p className="text-xs text-emerald-100 mt-2 flex items-center font-normal">
          <ShieldAlert className="w-3.5 h-3.5 mr-1" />
          Sector Benchmark: 12.1%
        </p>
      </div>

      <div className="p-5 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl shadow-sm relative overflow-hidden">
        <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
          <Target className="w-32 h-32" />
        </div>
        <p className="text-xs font-mono uppercase tracking-wider text-amber-100">Active Campaign Pipelines</p>
        <h3 className="text-2xl font-bold font-mono mt-1">{activeCampaigns || 4} Running</h3>
        <p className="text-xs text-amber-100 mt-2 flex items-center font-normal">
          <ClockIcon className="w-3.5 h-3.5 mr-1" />
          Scheduled Releases: 3
        </p>
      </div>
    </div>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
