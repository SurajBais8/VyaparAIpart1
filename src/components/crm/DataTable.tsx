/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Trash2,
  Share2,
  Printer,
  Archive,
  Star,
  Copy,
  Mail,
  MessageSquare,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Tag,
  UserCheck,
  Edit2,
  Eye
} from 'lucide-react';
import { Button } from '../ui'; // wait, let's verify if ui/index.tsx has checkbox. If not, we can implement custom HTML checkbox styled beautifully.

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  actions?: {
    label: string;
    icon?: React.ReactNode;
    onClick: (row: any) => void;
    variant?: 'danger' | 'default';
  }[];
  bulkActions?: {
    label: string;
    icon?: React.ReactNode;
    onClick: (rows: any[]) => void;
  }[];
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  onRowClick,
  actions = [],
  bulkActions = []
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const toggleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map((row) => row.id));
    }
  };

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const getSortedData = () => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  };

  const sortedData = getSortedData();

  const handleActionClick = (e: React.MouseEvent, actionFn: (row: any) => void, row: any) => {
    e.stopPropagation();
    actionFn(row);
    setActiveMenuId(null);
  };

  return (
    <div className="w-full space-y-4">
      {/* Bulk Action Panel */}
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-950/40 shadow-xs"
        >
          <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300 font-mono">
            ⚡ {selectedIds.length} records selected
          </div>
          <div className="flex flex-wrap gap-2">
            {bulkActions.map((act) => (
              <button
                key={act.label}
                onClick={() => {
                  const selectedRows = data.filter((row) => selectedIds.includes(row.id));
                  act.onClick(selectedRows);
                  setSelectedIds([]);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 cursor-pointer transition-all duration-300 shadow-xs"
              >
                {act.icon}
                <span>{act.label}</span>
              </button>
            ))}
            <button
              onClick={() => setSelectedIds([])}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 px-3 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Grid Canvas */}
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/50 dark:border-slate-850 bg-white/70 dark:bg-slate-950/75 backdrop-blur-md shadow-xs">
        <table className="w-full border-collapse text-left text-xs text-slate-600 dark:text-slate-300">
          <thead>
            <tr className="border-b border-slate-200/50 dark:border-slate-850/60 bg-slate-50/50 dark:bg-slate-900/40 select-none">
              <th className="p-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={data.length > 0 && selectedIds.length === data.length}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer accent-indigo-600"
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`p-4 font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono text-[10px] ${col.sortable ? 'cursor-pointer hover:text-slate-700 dark:hover:text-slate-300' : ''}`}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.label}</span>
                    {col.sortable && sortKey === col.key && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
              ))}
              {(actions.length > 0) && <th className="p-4 w-12 text-right"></th>}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {sortedData.map((row, index) => {
                const isSelected = selectedIds.includes(row.id);
                return (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.04 }}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`border-b border-slate-100 dark:border-slate-850/40 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors duration-200 ${onRowClick ? 'cursor-pointer' : ''} ${isSelected ? 'bg-indigo-50/20 dark:bg-indigo-950/10' : ''}`}
                  >
                    <td className="p-4 w-10 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e: any) => toggleSelectRow(row.id, e)}
                        className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer accent-indigo-600"
                      />
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className="p-4 font-medium text-slate-700 dark:text-slate-200 align-middle">
                        {col.render ? col.render(row) : (row[col.key] || '—')}
                      </td>
                    ))}

                    {actions.length > 0 && (
                      <td className="p-4 w-12 text-right align-middle relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === row.id ? null : row.id)}
                          className="p-1.5 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-white dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Action Dropdown Menu */}
                        {activeMenuId === row.id && (
                          <>
                            <div
                              className="fixed inset-0 z-30"
                              onClick={() => setActiveMenuId(null)}
                            />
                            <div className="absolute right-4 mt-1 w-44 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl py-1.5 z-40 text-left">
                              {actions.map((act) => (
                                <button
                                  key={act.label}
                                  onClick={(e) => handleActionClick(e, act.onClick, row)}
                                  className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-left cursor-pointer transition-colors
                                    ${act.variant === 'danger'
                                      ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20'
                                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                                >
                                  {act.icon}
                                  <span>{act.label}</span>
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </td>
                    )}
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};
