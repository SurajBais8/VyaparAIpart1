import React, { useState } from 'react';
import { motion } from 'motion/react';
import { QrCode, Download, Printer } from 'lucide-react';
import { toast } from 'sonner';

interface QRPreviewProps {
  sku: string;
  name: string;
  value: string;
}

export const QRPreview: React.FC<QRPreviewProps> = ({ sku, name, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success('QR content copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    toast.success(`Printing QR Label for SKU: ${sku}`);
  };

  const handleDownload = () => {
    toast.success(`Downloading qr_label_${sku}.png`);
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 space-y-4 text-left select-none max-w-sm mx-auto shadow-xs">
      <div className="space-y-1">
        <span className="text-[9px] font-black uppercase text-slate-400 font-mono tracking-wider block">
          Dynamic QR Label
        </span>
        <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide truncate">
          {name}
        </h4>
        <p className="text-[10px] text-slate-400 font-mono">SKU: {sku}</p>
      </div>

      {/* Visual QR representation */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={handleCopy}
        className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl flex flex-col items-center justify-center space-y-3 cursor-pointer group relative overflow-hidden"
      >
        <QrCode className="w-20 h-20 text-slate-800 dark:text-slate-100 group-hover:text-indigo-500 transition-colors" />
        <div className="text-center">
          <span className="block text-[8px] font-mono text-slate-500 truncate max-w-44">
            {value}
          </span>
          <span className="text-[8px] text-slate-400 font-mono mt-0.5 inline-block group-hover:text-indigo-400 transition-colors">
            {copied ? 'Copied!' : 'Click to copy QR Payload'}
          </span>
        </div>
      </motion.div>

      {/* QR Actions */}
      <div className="flex gap-2.5">
        <button
          onClick={handlePrint}
          className="flex-1 py-2 border border-slate-150 dark:border-slate-800 hover:border-indigo-500/30 text-slate-650 dark:text-slate-330 hover:bg-indigo-50/10 dark:hover:bg-indigo-950/20 rounded-xl text-[10px] font-black uppercase font-mono tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-indigo-500" /> Print QR
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase font-mono tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" /> Download QR
        </button>
      </div>
    </div>
  );
};
