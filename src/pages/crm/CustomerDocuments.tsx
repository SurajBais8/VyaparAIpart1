/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Card } from '../../components/ui';
import { FileText, Upload, Download, Trash2, Eye, FileUp, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface CustomerDocumentsProps {
  customerId: string;
  documents?: any[];
}

export const CustomerDocuments: React.FC<CustomerDocumentsProps> = ({ customerId, documents = [] }) => {
  const [list, setList] = useState<any[]>([
    ...(documents.length > 0 ? documents : [
      { id: 'DOC-911', name: 'Master_Service_Agreement_v3_Signed.pdf', size: '1.4 MB', date: '2026-07-15' },
      { id: 'DOC-821', name: 'Financial_Statements_Q2.xlsx', size: '420 KB', date: '2026-06-12' },
      { id: 'DOC-112', name: 'GSTIN_Verification_Response.json', size: '12 KB', date: '2026-05-10' }
    ])
  ]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const addFileToList = (fileName: string, fileSize: number) => {
    const sizeStr = fileSize > 1024 * 1024 
      ? `${(fileSize / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(fileSize / 1024)} KB`;

    const newDoc = {
      id: `DOC-${Math.floor(Math.random() * 900 + 100)}`,
      name: fileName,
      size: sizeStr,
      date: new Date().toISOString().split('T')[0]
    };

    setList(prev => [newDoc, ...prev]);
    toast.success(`Uploaded "${fileName}" successfully!`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      addFileToList(file.name, file.size);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      addFileToList(file.name, file.size);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      setList(prev => prev.filter(doc => doc.id !== id));
      toast.success(`Removed document: ${name}`);
    }
  };

  const handlePreview = (name: string) => {
    toast.info(`Opening preview for ${name}...`, {
      description: 'Document renders inside secure iframe viewer context.'
    });
  };

  return (
    <div className="space-y-5 text-left">
      <div>
        <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
          Shared Document Registry
        </h3>
        <p className="text-[10px] text-slate-400 font-light mt-0.5">
          Store contract agreements, technical requirements papers, and onboarding dossiers.
        </p>
      </div>

      {/* Drag & Drop File Upload Box */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center
          ${dragActive 
            ? 'border-indigo-500 bg-indigo-500/5 text-indigo-600' 
            : 'border-slate-250 dark:border-slate-800 bg-slate-50/10 hover:border-slate-400'}`}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          onChange={handleFileInputChange} 
        />
        
        <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-lg">
          <FileUp className="w-5 h-5" />
        </div>
        
        <div className="text-xs space-y-0.5">
          <p className="font-bold text-slate-750 dark:text-slate-200">Drag & drop files here, or <span className="text-indigo-500 hover:underline">browse</span></p>
          <p className="text-[9px] text-slate-400 font-mono">PDF, XLSX, DOCX or JSON up to 15MB</p>
        </div>
      </div>

      {/* Shared Documents List */}
      <div className="space-y-2.5 pt-2">
        {list.map((doc) => (
          <div 
            key={doc.id} 
            className="p-3 bg-white dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850/60 rounded-xl flex justify-between items-center text-xs text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <FileText className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 truncate max-w-[180px] md:max-w-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">{doc.name}</span>
                <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-mono">
                  <span>Size: {doc.size}</span>
                  <span>•</span>
                  <span>{doc.date}</span>
                </div>
              </div>
            </div>

            {/* Document Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePreview(doc.name)}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-450 hover:text-indigo-500 transition-colors cursor-pointer"
                title="Preview"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => toast.success(`Commencing secure download for "${doc.name}"`)}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-450 hover:text-indigo-500 transition-colors cursor-pointer"
                title="Download"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(doc.id, doc.name)}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-450 hover:text-rose-500 transition-colors cursor-pointer"
                title="Delete File"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <p className="text-xs text-slate-400 italic text-center py-6">Registry contains no active document files.</p>
        )}
      </div>
    </div>
  );
};
