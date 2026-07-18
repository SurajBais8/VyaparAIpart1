import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { purchaseService, PurchaseOrder } from '../../services/purchase.service';
import { supplierService, Supplier } from '../../services/supplier.service';
import { 
  ArrowLeft, 
  FileText, 
  Building2, 
  Calendar, 
  User, 
  CheckCircle, 
  FileSpreadsheet, 
  Download,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

export const PurchaseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [po, setPO] = useState<PurchaseOrder | null>(null);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const loadDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const order = await purchaseService.getPurchaseDetails(id);
      if (order) {
        setPO(order);
        const sup = await supplierService.getSupplierProfile(order.supplierId);
        setSupplier(sup || null);
      } else {
        toast.error('Purchase Order not found.');
      }
    } catch {
      toast.error('Failed to parse details directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
      </div>
    );
  }

  if (!po) {
    return (
      <div className="p-10 text-center bg-white border rounded-2xl select-none">
        <span className="text-sm text-slate-400">Purchase Order not found.</span>
        <button onClick={() => navigate('/inventory/purchase')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs uppercase font-mono">Back to PO Register</button>
      </div>
    );
  }

  const tabItems = [
    { id: 'overview', title: 'Overview' },
    { id: 'products', title: 'Products' },
    { id: 'supplier', title: 'Supplier' },
    { id: 'timeline', title: 'Timeline' },
    { id: 'documents', title: 'Documents' },
    { id: 'payments', title: 'Payments' },
    { id: 'approval', title: 'Approval History' }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex items-center gap-3 select-none">
        <button
          onClick={() => navigate('/inventory/purchase')}
          className="p-2 border border-slate-150 hover:bg-slate-100 rounded-xl cursor-pointer text-slate-500"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400">
            PO Number: {po.id}
          </span>
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide font-mono">
            {po.supplierName} - Sourcing Sheet
          </h2>
        </div>
      </div>

      {/* Tabs list */}
      <div className="border-b border-slate-200 overflow-x-auto select-none">
        <div className="flex gap-6 pb-px">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 text-xs font-bold font-mono uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors border-b-2
                ${activeTab === tab.id 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-650'}`}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Card Content */}
      <div className="bg-white border p-6 rounded-2xl shadow-2xs">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6 select-none">
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-400 font-mono">Overview Details</h3>
                <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed font-light">
                  <p className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-slate-400" /> <strong>Silo Warehouse Hub:</strong> {po.warehouseName}</p>
                  <p className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> <strong>Expected Delivery:</strong> {po.expectedDate}</p>
                  <p className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-slate-400" /> <strong>Contract Status:</strong> {po.status}</p>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="p-4 bg-slate-50 border rounded-xl space-y-4 text-xs select-none">
              <span className="block text-[10px] font-mono font-black uppercase tracking-wider text-slate-400">Financial Summary</span>
              <div className="space-y-3 font-mono font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400">Quantity</span>
                  <span>{po.quantity} Units</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-150">
                  <span className="text-slate-400">Total Valuation</span>
                  <span className="font-bold text-indigo-600">₹{po.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono">Associated Products</h3>
            <div className="border rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-mono font-black text-slate-400 uppercase">
                    <th className="p-3">Product SKU</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {po.products.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-indigo-600">{p.productId}</td>
                      <td className="p-3 font-mono font-semibold">{p.quantity} units</td>
                      <td className="p-3 text-right font-mono">₹{p.unitPrice.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono font-bold">₹{p.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'supplier' && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono">Supplier Partner profile</h3>
            {supplier ? (
              <div className="space-y-3 text-xs leading-relaxed font-light">
                <p><strong>Corporate Name:</strong> {supplier.name}</p>
                <p><strong>Primary Contact:</strong> {supplier.contactPerson}</p>
                <p><strong>Support Email:</strong> {supplier.email}</p>
                <p><strong>Support Tel:</strong> {supplier.phone}</p>
              </div>
            ) : (
              <span className="text-xs text-slate-400 italic">No supplier data.</span>
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-4 select-none">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono">Procurement Timeline</h3>
            <div className="relative pl-4 border-l border-slate-150 space-y-4 text-xs">
              {po.timeline.map((item, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-[9px] font-mono font-bold text-slate-400">{item.date}</span>
                  <p className="font-bold text-slate-700">{item.title}</p>
                  <p className="text-[11px] text-slate-450 mt-0.5">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono">Accredited documents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl text-xs">
              {(po.documents || ["Invoice_Standard_DRAFT.pdf"]).map((doc, idx) => (
                <div key={idx} className="p-3 border rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
                    <span className="font-bold">{doc}</span>
                  </div>
                  <button onClick={() => toast.success('Downloaded PO document.')} className="px-2 py-1 text-[9px] font-mono font-black bg-indigo-600 text-white rounded">Get</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-4 select-none text-xs">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono">Procurement Invoice Payments</h3>
            <div className="p-4 border rounded-xl bg-slate-50 max-w-md space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1 font-bold"><DollarSign className="w-4 h-4" /> Contract Payment terms</span>
                <span className="font-bold text-indigo-600 font-mono">NET-30 Standard</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold">Instalment Status</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-600 font-mono">AWAITING CFO CLEARANCE</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'approval' && (
          <div className="space-y-4 select-none">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono">Approval Audit History</h3>
            <div className="relative pl-4 border-l border-slate-150 space-y-4 text-xs">
              {po.approvalHistory.map((ap, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-[9px] font-mono text-slate-400 font-bold">{ap.date.split('T')[0]}</span>
                  <p className="font-bold text-slate-700">{ap.step}</p>
                  <p className="text-[11px] text-slate-450 mt-0.5">Approved by: {ap.by} • Status: {ap.status}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
