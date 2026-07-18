/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui';
import { 
  GitBranch, 
  Coins, 
  TrendingUp, 
  Percent, 
  Flame, 
  Briefcase, 
  ArrowLeftRight,
  ArrowRight,
  Plus
} from 'lucide-react';
import { LeadCard } from './LeadCard';

interface LeadPipelineProps {
  leads: any[];
  onStageChange: (itemId: string, newStage: string) => void;
  onItemClick: (item: any) => void;
  onAddLeadClick?: (stageId: string) => void;
}

const STAGE_PROBABILITIES: Record<string, number> = {
  'New': 0.1,
  'Contacted': 0.25,
  'Qualified': 0.5,
  'Proposal': 0.7,
  'Negotiation': 0.85,
  'Won': 1.0,
};

const STAGE_COLORS: Record<string, string> = {
  'New': 'bg-indigo-500',
  'Contacted': 'bg-amber-500',
  'Qualified': 'bg-rose-500',
  'Proposal': 'bg-violet-500',
  'Negotiation': 'bg-teal-500',
  'Won': 'bg-emerald-500',
};

export const LeadPipeline: React.FC<LeadPipelineProps> = ({
  leads,
  onStageChange,
  onItemClick,
  onAddLeadClick
}) => {
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeStageMenuId, setActiveStageMenuId] = useState<string | null>(null);

  // Helper to calculate lead value
  const getLeadValue = (lead: any) => {
    return Number(lead.value) || (Number(lead.score) || 50) * 1000;
  };

  // Compute Overall Statistics
  const totalLeads = leads.length;
  const totalValue = leads.reduce((sum, l) => sum + getLeadValue(l), 0);
  const expectedRevenue = leads.reduce((sum, l) => {
    const prob = STAGE_PROBABILITIES[l.stage] || 0.1;
    return sum + (getLeadValue(l) * prob);
  }, 0);
  const wonLeads = leads.filter(l => l.stage === 'Won').length;
  const averageConversion = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  // Pipeline stages
  const stages = [
    { id: 'New', title: 'New Capture' },
    { id: 'Contacted', title: 'Contacted' },
    { id: 'Qualified', title: 'Qualified' },
    { id: 'Proposal', title: 'Proposal Sent' },
    { id: 'Negotiation', title: 'Negotiation' },
    { id: 'Won', title: 'Deals Won' }
  ];

  const handleDragStart = (id: string) => {
    setActiveDragId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stageId: string) => {
    if (activeDragId) {
      onStageChange(activeDragId, stageId);
      setActiveDragId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Pipeline Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="glass" className="p-4 border-slate-200/50 dark:border-slate-850 bg-white/50 dark:bg-slate-950/30 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-black uppercase text-slate-400 font-mono">Active Pipelines</span>
            <span className="text-lg font-black text-slate-800 dark:text-slate-100 font-mono mt-0.5 block">{totalLeads} Leads</span>
          </div>
        </Card>

        <Card variant="glass" className="p-4 border-slate-200/50 dark:border-slate-850 bg-white/50 dark:bg-slate-950/30 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-black uppercase text-slate-400 font-mono">Total Pipeline Value</span>
            <span className="text-lg font-black text-slate-800 dark:text-slate-100 font-mono mt-0.5 block">₹{totalValue.toLocaleString()}</span>
          </div>
        </Card>

        <Card variant="glass" className="p-4 border-slate-200/50 dark:border-slate-850 bg-white/50 dark:bg-slate-950/30 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-black uppercase text-slate-400 font-mono">Expected Revenue (Weighted)</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">₹{Math.round(expectedRevenue).toLocaleString()}</span>
          </div>
        </Card>

        <Card variant="glass" className="p-4 border-slate-200/50 dark:border-slate-850 bg-white/50 dark:bg-slate-950/30 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-black uppercase text-slate-400 font-mono">Win Conversion %</span>
            <span className="text-lg font-black text-slate-800 dark:text-slate-100 font-mono mt-0.5 block">{averageConversion}% Rate</span>
          </div>
        </Card>
      </div>

      {/* 2. Drag & Drop Pipeline Columns */}
      <div className="w-full overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1100px] items-start">
          {stages.map((stage) => {
            const stageLeads = leads.filter(
              (l) => l.stage?.toLowerCase() === stage.id.toLowerCase() || l.stage === stage.id
            );
            
            // Expected value calculations
            const stageTotalValue = stageLeads.reduce((sum, l) => sum + getLeadValue(l), 0);
            const prob = STAGE_PROBABILITIES[stage.id] || 0.1;
            const stageExpected = stageTotalValue * prob;

            return (
              <div
                key={stage.id}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage.id)}
                className="w-72 bg-slate-100/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-850/60 rounded-2xl flex-shrink-0 flex flex-col max-h-[640px]"
              >
                {/* Column Header */}
                <div className="p-3 border-b border-slate-200/50 dark:border-slate-850/60 bg-white/40 dark:bg-slate-900/20 rounded-t-2xl space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${STAGE_COLORS[stage.id]}`} />
                      <h4 className="text-xs font-black text-slate-700 dark:text-slate-200 tracking-wide uppercase font-mono">
                        {stage.title}
                      </h4>
                      <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {stageLeads.length}
                      </span>
                    </div>

                    {onAddLeadClick && (
                      <button
                        onClick={() => onAddLeadClick(stage.id)}
                        className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Stage Revenue Stats */}
                  <div className="flex justify-between items-center text-[9px] font-mono font-bold text-slate-400 pt-1 border-t border-slate-150/50 dark:border-slate-850/30">
                    <div>Value: <span className="text-slate-600 dark:text-slate-300">₹{stageTotalValue.toLocaleString()}</span></div>
                    <div>Prob: <span className="text-indigo-500">{(prob * 100)}%</span></div>
                  </div>
                  <div className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                    Exp: ₹{Math.round(stageExpected).toLocaleString()}
                  </div>
                </div>

                {/* Cards Container */}
                <div className="p-3 space-y-3 overflow-y-auto max-h-[500px] flex-grow min-h-[150px]">
                  <AnimatePresence initial={false}>
                    {stageLeads.length > 0 ? (
                      stageLeads.map((item) => {
                        const itemVal = getLeadValue(item);
                        return (
                          <div
                            key={item.id}
                            draggable
                            onDragStart={() => handleDragStart(item.id)}
                            className="relative group cursor-grab active:cursor-grabbing"
                          >
                            <LeadCard 
                              lead={{ ...item, value: itemVal }} 
                              onClick={() => onItemClick(item)} 
                            />

                            {/* Move stage panel */}
                            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                              <button
                                onClick={() => {
                                  setActiveStageMenuId(activeStageMenuId === item.id ? null : item.id);
                                }}
                                className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-md cursor-pointer transition-colors"
                              >
                                <ArrowLeftRight className="w-3.5 h-3.5" />
                              </button>

                              {activeStageMenuId === item.id && (
                                <>
                                  <div className="fixed inset-0 z-30" onClick={() => setActiveStageMenuId(null)} />
                                  <div className="absolute right-0 top-7 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 w-44 z-40 text-[11px] font-bold text-left">
                                    {stages
                                      .filter((c) => c.id !== stage.id)
                                      .map((c) => (
                                        <button
                                          key={c.id}
                                          onClick={() => {
                                            onStageChange(item.id, c.id);
                                            setActiveStageMenuId(null);
                                          }}
                                          className="w-full px-3 py-2 text-slate-700 dark:text-slate-350 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-left flex items-center justify-between cursor-pointer"
                                        >
                                          <span>Move to {c.title}</span>
                                          <span className={`w-2 h-2 rounded-full ${STAGE_COLORS[c.id]}`} />
                                        </button>
                                      ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 border border-dashed border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50/20 text-slate-400">
                        <span className="text-[10px] font-medium font-mono">Stage Empty</span>
                        <span className="text-[9px] text-slate-400 font-light mt-0.5">Drag leads here</span>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
