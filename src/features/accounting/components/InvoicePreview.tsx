import React from 'react';
import { Invoice } from '../../../types/accounting';
import { Download, Printer, Share2, Coins, Receipt, Layers } from 'lucide-react';
import { toast } from 'sonner';

interface InvoicePreviewProps {
  invoice: Invoice;
  onClose?: () => void;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success(`Downloading high-fidelity Invoice ${invoice.id} PDF...`);
  };

  const handleShare = () => {
    toast.success(`Share link generated for Invoice ${invoice.id}`);
  };

  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
      {/* Header Controls */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-850 flex justify-between items-center bg-slate-50 dark:bg-slate-900 select-none">
        <div>
          <span className="text-xs font-black uppercase font-mono text-slate-500">Invoice Document Buffer</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrint}
            className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 font-bold uppercase font-mono tracking-wider flex items-center gap-1 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button
            onClick={handleShare}
            className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 font-bold uppercase font-mono tracking-wider flex items-center gap-1 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button
            onClick={handleDownload}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase font-mono tracking-wider flex items-center gap-1 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download PDF
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 border border-slate-200 dark:border-slate-850 hover:bg-rose-50 text-rose-500 rounded-xl text-xs font-black uppercase font-mono cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Main Invoice Layout Container */}
      <div id="printable-invoice" className="p-8 space-y-8 overflow-y-auto text-left select-text bg-white text-slate-800">
        
        {/* Banner header split */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold flex items-center justify-center shadow-lg">
              S
            </div>
            <h2 className="text-lg font-black uppercase font-mono tracking-wider mt-2 text-slate-900">SaaS Enterprise</h2>
            <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
              256 Tech Boulevard, Suite 5B<br />
              Bandra Kurla Complex, Mumbai, MH - 400051<br />
              GSTIN: 27AAACS1092S1Z9
            </p>
          </div>

          <div className="text-right space-y-1.5 sm:min-w-[150px]">
            <h1 className="text-xl font-black uppercase tracking-wider font-mono text-indigo-600">INVOICE</h1>
            <div className="text-[10px] font-mono text-slate-450 space-y-0.5">
              <div><span className="font-bold">INVOICE ID:</span> <span className="font-black text-slate-800">{invoice.id}</span></div>
              <div><span className="font-bold">DATE:</span> {invoice.invoiceDate}</div>
              <div><span className="font-bold">DUE DATE:</span> {invoice.dueDate}</div>
              <div><span className="font-bold">GST TREATMENT:</span> Interstate (IGST)</div>
            </div>
          </div>
        </div>

        {/* Client & Billing Details Block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-b border-slate-100 py-6">
          <div className="space-y-1 text-xs">
            <span className="text-[9px] font-black uppercase font-mono text-slate-400 block tracking-wider">BILLED TO</span>
            <h3 className="font-bold text-slate-900 text-sm">{invoice.customerName}</h3>
            <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
              Email: {invoice.customerEmail}<br />
              GSTIN: {invoice.gstNumber || 'Not Registered'}
            </p>
          </div>

          <div className="space-y-1 text-xs sm:text-right select-none">
            <span className="text-[9px] font-black uppercase font-mono text-slate-400 block tracking-wider">PAYMENT DETAILS</span>
            <div className="text-[10px] text-slate-500 font-mono space-y-0.5">
              <div><span className="font-bold">Status:</span> {invoice.status}</div>
              <div><span className="font-bold">Method:</span> {invoice.paymentMethod || 'None'}</div>
              <div><span className="font-bold">Amount Due:</span> ₹{invoice.status === 'Paid' ? 0 : invoice.totalAmount.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Invoice Itemized table */}
        <div className="space-y-3">
          <span className="text-[9px] font-black uppercase font-mono text-slate-400 block tracking-wider">ITEMIZED LINE MATERIAL</span>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] text-left">
              <thead>
                <tr className="border-b-2 border-slate-100 text-[9px] font-black uppercase font-mono text-slate-400">
                  <th className="py-2.5">Item Description</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Rate</th>
                  <th className="py-2.5 text-center">GST %</th>
                  <th className="py-2.5 text-right">Net Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 font-bold text-slate-800">{item.description}</td>
                    <td className="py-3 text-center text-slate-500">{item.quantity}</td>
                    <td className="py-3 text-right text-slate-600">₹{item.rate.toLocaleString()}</td>
                    <td className="py-3 text-center text-slate-500">{item.gstRate}%</td>
                    <td className="py-3 text-right font-bold text-slate-800">₹{item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculations Block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 font-mono leading-relaxed space-y-2">
            <div>
              <span className="font-black text-slate-400 block text-[8px] uppercase">Notes & Disclaimers</span>
              <p className="text-[9px]">{invoice.notes || "All payments are bound by standard 14 days credit terms. Please specify Invoice ID in transfer receipts."}</p>
            </div>
            <div>
              <span className="font-black text-slate-400 block text-[8px] uppercase">E-WAY BILL CODES</span>
              <p className="text-[9px] font-mono">NOT_APPLICABLE_SERVICE_TREATMENT</p>
            </div>
          </div>

          <div className="space-y-2 text-xs font-mono select-none sm:text-right sm:ml-auto sm:w-[250px]">
            <div className="flex justify-between border-b pb-1">
              <span className="text-slate-450">Subtotal:</span>
              <span className="font-bold text-slate-800">₹{invoice.subTotal.toLocaleString()}</span>
            </div>
            {invoice.cgst > 0 && (
              <div className="flex justify-between border-b pb-1 text-[11px]">
                <span className="text-slate-450">CGST (9%):</span>
                <span className="font-bold text-slate-800">₹{invoice.cgst.toLocaleString()}</span>
              </div>
            )}
            {invoice.sgst > 0 && (
              <div className="flex justify-between border-b pb-1 text-[11px]">
                <span className="text-slate-450">SGST (9%):</span>
                <span className="font-bold text-slate-800">₹{invoice.sgst.toLocaleString()}</span>
              </div>
            )}
            {invoice.igst > 0 && (
              <div className="flex justify-between border-b pb-1 text-[11px]">
                <span className="text-slate-450">IGST (18%):</span>
                <span className="font-bold text-slate-800">₹{invoice.igst.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-b-2 py-1.5 text-sm">
              <span className="font-black text-slate-900 uppercase">Gross Total:</span>
              <span className="font-black text-indigo-600">₹{invoice.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Regulatory footer */}
        <div className="pt-6 border-t border-dashed border-slate-200 text-center select-none">
          <p className="text-[8px] font-mono text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            THIS IS A DIGITAL COMPUTED MATERIAL ACCOUNT REGISTRY COMPLIANT INVOICE.<br />
            NO PHYSICAL SIGNATURE IS REQUIRED UNDER Indian CGST Rules 2017.
          </p>
        </div>

      </div>
    </div>
  );
};
