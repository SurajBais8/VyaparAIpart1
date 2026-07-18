/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, FileText, Table, FileCode } from 'lucide-react';
import { toast } from 'sonner';
import { reportService } from '../../services/report.service';

interface ExportMenuProps {
  reportType: string;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ reportType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'PDF' | 'Excel' | 'CSV') => {
    setIsOpen(false);
    setIsExporting(true);
    const toastId = toast.loading(`Compiling ${reportType} data into ${format} ledger...`, {
      description: 'Running schema alignments.'
    });

    try {
      const res = await reportService.exportToFormat(reportType, format);
      if (res.success) {
        toast.success(`Export ready: ${res.fileName}`, {
          id: toastId,
          description: 'Document signed and formatted successfully.',
          action: {
            label: 'Download',
            onClick: () => {
              window.open(res.downloadUrl, '_blank');
            }
          }
        });
      }
    } catch (e) {
      toast.error('Failed to compile data stream.', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative inline-block text-left z-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/75 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-all duration-300 shadow-2xs"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{isExporting ? 'Exporting...' : 'Export'}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1.5 w-40 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl py-1.5 z-40 text-left text-xs font-bold text-slate-600 dark:text-slate-350">
            <button
              onClick={() => handleExport('PDF')}
              className="w-full px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-rose-500" />
              <span>Export as PDF</span>
            </button>
            <button
              onClick={() => handleExport('Excel')}
              className="w-full px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2 cursor-pointer"
            >
              <Table className="w-4 h-4 text-emerald-500" />
              <span>Export as Excel</span>
            </button>
            <button
              onClick={() => handleExport('CSV')}
              className="w-full px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2 cursor-pointer"
            >
              <FileCode className="w-4 h-4 text-indigo-500" />
              <span>Export as CSV</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
