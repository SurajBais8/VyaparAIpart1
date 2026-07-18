/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Campaign } from '../../../types/marketing';
import { Mail, MessageSquare, Phone, TrendingUp, DollarSign, Calendar } from 'lucide-react';

interface CampaignCardProps {
  campaign: Campaign;
  onClick?: () => void;
}

export function CampaignCard({ campaign, onClick }: CampaignCardProps) {
  const getIcon = () => {
    switch (campaign.type) {
      case 'Email':
        return <Mail className="w-5 h-5 text-indigo-500" />;
      case 'WhatsApp':
        return <MessageSquare className="w-5 h-5 text-emerald-500" />;
      case 'SMS':
        return <Phone className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusStyle = () => {
    switch (campaign.status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Draft':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Completed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Archived':
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)' }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="p-5 bg-white border border-slate-100 rounded-xl cursor-pointer hover:border-slate-200 flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-slate-50 rounded-lg">
            {getIcon()}
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getStatusStyle()}`}>
            {campaign.status}
          </span>
        </div>

        <h3 className="font-sans font-medium text-slate-800 text-base mb-1 hover:text-indigo-600 transition-colors">
          {campaign.name}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 font-normal">
          {campaign.description}
        </p>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-50">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center text-slate-500 font-mono">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            <span>{campaign.startDate}</span>
          </div>
          <div className="flex items-center justify-end text-slate-700 font-medium">
            <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
            <span>{campaign.conversion}% Conv</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 bg-slate-50 p-2.5 rounded-lg text-center">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Sent</p>
            <p className="text-xs font-semibold text-slate-700 font-mono">
              {campaign.sentCount >= 1000 ? `${(campaign.sentCount/1000).toFixed(1)}k` : campaign.sentCount}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Leads</p>
            <p className="text-xs font-semibold text-slate-700 font-mono">{campaign.leadsCount}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Budget</p>
            <p className="text-xs font-semibold text-slate-700 font-mono">
              ₹{campaign.budget >= 1000 ? `${campaign.budget/1000}k` : campaign.budget}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
