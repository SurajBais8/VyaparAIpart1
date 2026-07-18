import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supplierService, Supplier } from '../../services/supplier.service';
import { productService } from '../../services/product.service';
import { purchaseService, PurchaseOrder } from '../../services/purchase.service';
import { Product } from '../../services/inventory.service';
import { 
  ArrowLeft, 
  Users2, 
  Star, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  FileText, 
  Sparkles,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

export const SupplierProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const loadProfile = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const sup = await supplierService.getSupplierProfile(id);
      if (sup) {
        setSupplier(sup);
        const [allProds, allPOs] = await Promise.all([
          productService.getProducts(),
          purchaseService.getPurchaseOrders()
        ]);
        setProducts(allProds.filter(p => p.supplierId === sup.id));
        setPurchaseOrders(allPOs.filter(po => po.supplierId === sup.id));
      } else {
        toast.error('Supplier not found in directory.');
      }
    } catch {
      toast.error('Failed to parse supplier profiles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="p-10 text-center bg-white border rounded-2xl select-none">
        <span className="text-sm text-slate-400">Supplier not found.</span>
        <button onClick={() => navigate('/inventory/suppliers')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs uppercase font-mono">Back to Suppliers</button>
      </div>
    );
  }

  const tabItems = [
    { id: 'overview', title: 'Overview' },
    { id: 'products', title: 'Products' },
    { id: 'pos', title: 'Purchase Orders' },
    { id: 'payments', title: 'Payments' },
    { id: 'documents', title: 'Documents' },
    { id: 'timeline', title: 'Timeline' },
    { id: 'notes', title: 'Notes' },
    { id: 'analytics', title: 'Analytics' },
    { id: 'ai-summary', title: 'AI Summary' }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex items-center gap-3 select-none">
        <button
          onClick={() => navigate('/inventory/suppliers')}
          className="p-2 border border-slate-150 hover:bg-slate-100 rounded-xl cursor-pointer text-slate-500"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400">
            Supplier ID: {supplier.id}
          </span>
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide font-mono">
            {supplier.name} - Profile Directory
          </h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 overflow-x-auto select-none">
        <div className="flex gap-6 pb-px">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-xs font-bold font-mono uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors border-b-2
                ${activeTab === tab.id 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-650'}`}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>

      {/* Content card */}
      <div className="bg-white border p-6 rounded-2xl shadow-2xs">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6 select-none text-left">
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-400 font-mono">Corporate Coordinates</h3>
                <div className="space-y-2 text-xs text-slate-600 font-light leading-relaxed">
                  <p><strong>Code:</strong> {supplier.code}</p>
                  <p><strong>Assigned Manager:</strong> {supplier.contactPerson}</p>
                  <p><strong>Support Tel:</strong> {supplier.phone}</p>
                  <p><strong>Support Email:</strong> {supplier.email}</p>
                  <p><strong>Office Address:</strong> {supplier.address}</p>
                </div>
              </div>
            </div>

            {/* Quick Rating stats */}
            <div className="p-4 bg-slate-50 border rounded-xl space-y-4 text-xs select-none">
              <span className="block text-[10px] font-mono font-black uppercase tracking-wider text-slate-400">Partner Metrics</span>
              <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-lg text-xs font-mono font-bold w-fit">
                <Star className="w-4 h-4 fill-amber-500" />
                <span>Rating: {supplier.rating} / 5</span>
              </div>
              <div className="pt-2 border-t border-slate-150 space-y-2.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Catalog SKU</span>
                  <span className="font-bold text-slate-700">{products.length} Products</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active PO count</span>
                  <span className="font-bold text-slate-700">{purchaseOrders.length} POs</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono">Supplier Catalog Products</h3>
            {products.length > 0 ? (
              <div className="border rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-mono font-black text-slate-400 uppercase">
                      <th className="p-3">SKU</th>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Warehouse Placement</th>
                      <th className="p-3 text-right">Selling Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-indigo-600">{p.sku}</td>
                        <td className="p-3 font-semibold">{p.name}</td>
                        <td className="p-3 text-slate-500">{p.warehouseName}</td>
                        <td className="p-3 text-right font-mono font-bold">₹{p.sellingPrice.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 border border-dashed rounded-xl text-center">
                <span className="text-xs text-slate-400 italic font-light">No products mapped to this vendor.</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'pos' && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono">Assigned Purchase Orders</h3>
            {purchaseOrders.length > 0 ? (
              <div className="border rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-mono font-black text-slate-400 uppercase">
                      <th className="p-3">PO Code</th>
                      <th className="p-3">Warehouse</th>
                      <th className="p-3 text-right">Qty</th>
                      <th className="p-3 text-right">Amount</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {purchaseOrders.map(po => (
                      <tr key={po.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-indigo-600">{po.id}</td>
                        <td className="p-3">{po.warehouseName}</td>
                        <td className="p-3 font-mono text-right">{po.quantity} units</td>
                        <td className="p-3 text-right font-mono font-bold">₹{po.amount.toLocaleString()}</td>
                        <td className="p-3 font-bold text-slate-650">{po.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 border border-dashed rounded-xl text-center">
                <span className="text-xs text-slate-400 italic">No purchase orders drafted for this vendor yet.</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-4 select-none">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono font-bold">Procurement Payments Ledger</h3>
            <div className="border rounded-xl overflow-hidden text-xs max-w-xl text-left">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-mono font-black text-slate-400 uppercase">
                    <th className="p-3">Payment ID</th>
                    <th className="p-3">Settlement Date</th>
                    <th className="p-3 text-right">Amount Settled</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(supplier.payments || []).map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-indigo-600">{pay.id}</td>
                      <td className="p-3 font-mono text-slate-500">{pay.date}</td>
                      <td className="p-3 text-right font-mono font-bold">₹{pay.amount.toLocaleString()}</td>
                      <td className="p-3 text-emerald-600 font-bold">{pay.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4 select-none">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono font-bold">Compliance Contracts & Certs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl text-xs text-left">
              {(supplier.documents || []).map((doc, idx) => (
                <div key={idx} className="p-3 border rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <span className="font-bold">{doc}</span>
                  </div>
                  <button onClick={() => toast.success(`Downloading ${doc}...`)} className="px-2 py-1 text-[9px] font-mono font-black bg-indigo-600 text-white rounded">Get</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-4 select-none">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono font-bold">Sourcing Milestones</h3>
            <div className="relative pl-4 border-l border-slate-150 space-y-4 text-xs text-left">
              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-mono text-slate-400 font-bold">2026-07-05</span>
                <p className="font-bold text-slate-700">Contract Agreement Renewed</p>
                <p className="text-[11px] text-slate-450 mt-0.5">Renewed annual telecom material pricing agreements for fiscal 2026-27.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4 text-left select-none max-w-xl">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono font-bold">Internal Procurement Memo</h3>
            <div className="p-4 bg-slate-50 border rounded-xl text-xs leading-relaxed font-light text-slate-650">
              {supplier.notes || "No custom procurement memos logged. Standard credit terms Net-30 apply."}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-4 select-none text-left">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono font-bold">Reliability statistics</h3>
            <div className="grid grid-cols-2 gap-4 max-w-sm text-xs">
              <div className="p-3 border rounded-xl">
                <span className="block text-slate-400 font-bold">ON-TIME DELIVERY</span>
                <span className="text-sm font-black text-emerald-600 font-mono mt-1">98.5%</span>
              </div>
              <div className="p-3 border rounded-xl">
                <span className="block text-slate-400 font-bold">LEAD TIME SPREAD</span>
                <span className="text-sm font-black text-slate-700 font-mono mt-1">4.2 days avg</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai-summary' && (
          <div className="space-y-4 select-none text-left">
            <div className="p-4 bg-indigo-600 text-white rounded-2xl flex items-start gap-4">
              <div className="p-2.5 bg-white/20 text-white rounded-xl shrink-0">
                <Sparkles className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-black uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded">
                  Gemini Supplier Insights
                </span>
                <h4 className="text-xs font-black uppercase tracking-wide">Cognitive vendor sign-off report</h4>
                <p className="text-[11px] font-light leading-relaxed">
                  {supplier.aiSummary || "Tata Tele Infra Ltd has maintained a consistent 98% on-time delivery rate. Leads stand at 4.2 days. Recommended for premium infrastructure items."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
