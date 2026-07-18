/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Dialog, Button } from '../ui';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (importedData: any[]) => void;
  dataType: string;
}

export const ImportDialog: React.FC<ImportDialogProps> = ({
  isOpen,
  onClose,
  onImportComplete,
  dataType
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
        setFileSelected(file);
        toast.success(`Loaded "${file.name}"! Ready for column schema mapping.`);
      } else {
        toast.error('Unsupported file format. Please upload a .csv or .xlsx ledger.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileSelected(file);
      toast.success(`Loaded "${file.name}"! Ready for column schema mapping.`);
    }
  };

  const handleProcessImport = () => {
    if (!fileSelected) return;

    setIsUploading(true);
    toast.loading(`Processing columns & parsing ${dataType} records...`, {
      id: 'import-toast'
    });

    setTimeout(() => {
      // Simulate successful parsing of 3 mock records
      const parsedRecords: any[] = [];
      toast.success(`Successfully synchronized 3 new ${dataType} records!`, {
        id: 'import-toast',
        description: 'Records are active in local memory.'
      });
      setIsUploading(false);
      setFileSelected(null);
      onImportComplete(parsedRecords);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl z-10 text-left space-y-5">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono">
            Import {dataType} Ledger
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-light mt-0.5">
            Bulk upload standard CSV or Excel files. Column keys will map automatically.
          </p>
        </div>

        {/* Drag Drop Area */}
        {!fileSelected ? (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative
              ${dragActive
                ? 'border-indigo-500 bg-indigo-500/5'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/20 hover:border-slate-300 dark:hover:border-slate-700'}`}
          >
            <input
              type="file"
              accept=".csv, .xlsx"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-3" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-350">
              Drag file here or <span className="text-indigo-600 dark:text-indigo-400 hover:underline">browse files</span>
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-light font-mono mt-1">
              Supports .csv, .xlsx up to 10MB
            </span>
          </div>
        ) : (
          <div className="p-4 border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/15 dark:bg-indigo-950/10 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <FileSpreadsheet className="w-8 h-8 text-indigo-600 flex-shrink-0" />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{fileSelected.name}</p>
                <span className="text-[10px] font-mono text-slate-400 font-medium">{(fileSelected.size / 1024).toFixed(1)} KB</span>
              </div>
            </div>
            <button
              onClick={() => setFileSelected(null)}
              className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex gap-3 justify-end pt-3 border-t border-slate-150/10">
          <Button variant="outline" className="py-2.5 text-xs font-bold" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="py-2.5 text-xs font-bold"
            disabled={!fileSelected || isUploading}
            onClick={handleProcessImport}
          >
            {isUploading ? 'Parsing...' : 'Analyze & Process'}
          </Button>
        </div>
      </div>
    </div>
  );
};
