/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, MoveRight, ArrowRight, CheckCircle2, DollarSign, Award, ArrowLeftRight } from 'lucide-react';
import { Card } from '../ui';

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  items: any[];
  onItemClick?: (item: any) => void;
  onStageChange: (itemId: string, newStage: string) => void;
  onAddItemClick?: (stageId: string) => void;
  itemRender: (item: any) => React.ReactNode;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  items,
  onItemClick,
  onStageChange,
  onAddItemClick,
  itemRender
}) => {
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeStageMenuId, setActiveStageMenuId] = useState<string | null>(null);

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

  const getStageSum = (stageId: string) => {
    return items
      .filter((it) => it.stage?.toLowerCase() === stageId.toLowerCase() || it.stage === stageId)
      .reduce((sum, current) => sum + (Number(current.value) || 0), 0);
  };

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-[1100px] items-start">
        {columns.map((col) => {
          const colItems = items.filter(
            (it) => it.stage?.toLowerCase() === col.id.toLowerCase() || it.stage === col.id
          );
          const colSum = getStageSum(col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col.id)}
              className="w-72 bg-slate-100/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-850/60 rounded-2xl flex-shrink-0 flex flex-col max-h-[640px]"
            >
              {/* Column Header */}
              <div className="p-3.5 flex justify-between items-center border-b border-slate-200/50 dark:border-slate-850/60 bg-white/40 dark:bg-slate-900/20 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <h4 className="text-xs font-black text-slate-700 dark:text-slate-200 tracking-wide uppercase font-mono">
                    {col.title}
                  </h4>
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {colItems.length}
                  </span>
                </div>

                {onAddItemClick && (
                  <button
                    onClick={() => onAddItemClick(col.id)}
                    className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Column Sum Value */}
              {colSum > 0 && (
                <div className="px-3.5 py-1.5 text-left bg-emerald-50/20 dark:bg-emerald-950/5 border-b border-slate-200/30 dark:border-slate-850/30 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <DollarSign className="w-3 h-3" /> Sum: ₹{colSum.toLocaleString()}
                </div>
              )}

              {/* Scrollable Cards Container */}
              <div className="p-3 space-y-3 overflow-y-auto max-h-[520px] flex-grow min-h-[150px]">
                <AnimatePresence initial={false}>
                  {colItems.length > 0 ? (
                    colItems.map((item) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={() => handleDragStart(item.id)}
                        className="relative group cursor-grab active:cursor-grabbing"
                      >
                        {itemRender(item)}

                        {/* Interactive Move-Stage Overlay on Hover */}
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                          <button
                            onClick={() => {
                              setActiveStageMenuId(activeStageMenuId === item.id ? null : item.id);
                            }}
                            className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-md cursor-pointer transition-colors"
                            title="Promote / Move Stage"
                          >
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                          </button>

                          {activeStageMenuId === item.id && (
                            <>
                              <div className="fixed inset-0 z-30" onClick={() => setActiveStageMenuId(null)} />
                              <div className="absolute right-0 top-7 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 w-44 z-40 text-[11px] font-bold text-left">
                                {columns
                                  .filter((c) => c.id !== col.id)
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
                                      <span className={`w-2 h-2 rounded-full ${c.color}`} />
                                    </button>
                                  ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/20 text-slate-400">
                      <span className="text-[10px] font-medium font-mono">Column Empty</span>
                      <span className="text-[9px] text-slate-400 font-light mt-0.5">Drag cards here</span>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
