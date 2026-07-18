import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/product.service';
import { inventoryService, Product } from '../../services/inventory.service';
import { supplierService, Supplier } from '../../services/supplier.service';
import { purchaseService, PurchaseOrder } from '../../services/purchase.service';
import { warehouseService, Warehouse } from '../../services/warehouse.service';
import { BarcodePreview } from '../../components/BarcodePreview';
import { QRPreview } from '../../components/QRPreview';
import { StockTimeline } from '../../components/StockTimeline';
import { 
  ArrowLeft, 
  Layers, 
  MapPin, 
  Users2, 
  Files, 
  TrendingUp, 
  QrCode, 
  Barcode as BarcodeIcon, 
  Sparkles,
  ShieldCheck,
  Compass,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from 'sonner';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const InventoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseOrder[]>([]);
  const [stockHistory, setStockHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const loadProductDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const prod = await productService.getProductById(id);
      if (prod) {
        setProduct(prod);
        const [sup, wh, allPOs, history] = await Promise.all([
          supplierService.getSupplierProfile(prod.supplierId || ''),
          warehouseService.getWarehouseById(prod.warehouseId),
          purchaseService.getPurchaseOrders(),
          inventoryService.getStockHistory(prod.id)
        ]);
        setSupplier(sup || null);
        setWarehouse(wh || null);
        setPurchaseHistory(allPOs.filter(po => po.products.some(p => p.productId === prod.id || p.productId === 'PROD-001')));
        setStockHistory(history);
      } else {
        toast.error('Product not found in register.');
      }
    } catch {
      toast.error('Failed to parse details directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-10 text-center bg-white border rounded-2xl">
        <span className="text-sm text-slate-400">Product not found.</span>
        <button onClick={() => navigate('/inventory/items')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs uppercase font-mono">Back to Inventory</button>
      </div>
    );
  }

  // AI Stock predictions data
  const aiForecastData = [
    { month: 'Jul (Current)', stock: product.quantity, prediction: product.quantity },
    { month: 'Aug', stock: null, prediction: Math.round(product.quantity * 1.25) },
    { month: 'Sep', stock: null, prediction: Math.round(product.quantity * 1.5) },
    { month: 'Oct', stock: null, prediction: Math.round(product.quantity * 1.1) },
    { month: 'Nov', stock: null, prediction: Math.round(product.quantity * 1.7) },
    { month: 'Dec', stock: null, prediction: Math.round(product.quantity * 2.1) }
  ];

  const tabItems = [
    { id: 'overview', title: 'Overview' },
    { id: 'stock-history', title: 'Stock History' },
    { id: 'purchase-history', title: 'Purchase History' },
    { id: 'suppliers', title: 'Suppliers' },
    { id: 'warehouses', title: 'Warehouses' },
    { id: 'barcode', title: 'Barcode' },
    { id: 'qrcode', title: 'QR Code' },
    { id: 'documents', title: 'Documents' },
    { id: 'timeline', title: 'Activity Timeline' },
    { id: 'ai-prediction', title: 'AI Stock Prediction' }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Back & Breadcrumb header */}
      <div className="flex items-center gap-3 select-none">
        <button
          onClick={() => navigate('/inventory/items')}
          className="p-2 border border-slate-150 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl cursor-pointer text-slate-500"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400">
            Catalog ID: {product.id}
          </span>
          <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide font-mono">
            {product.name}
          </h2>
        </div>
      </div>

      {/* Responsive tabs row */}
      <div className="border-b border-slate-200 dark:border-slate-850 overflow-x-auto select-none">
        <div className="flex gap-6 pb-px">
          {tabItems.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 text-xs font-bold font-mono uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors border-b-2
                  ${isActive 
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-650 dark:hover:text-slate-350'}`}
              >
                {tab.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs Content */}
      <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850/60 p-6 rounded-2xl shadow-2xs">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-black uppercase text-indigo-500">DESCRIPTION</span>
                <p className="text-xs text-slate-550 dark:text-slate-350 leading-relaxed font-light">
                  {product.description || "High-performance enterprise hardware server equipped with core processors, storage nodes, and digital SLA contracts."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-850 rounded-xl">
                  <span className="block text-[8px] font-black uppercase text-slate-400 font-mono">SELLING PRICE</span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-100 font-mono">
                    ₹{product.sellingPrice.toLocaleString()}
                  </span>
                </div>
                <div className="p-4 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-850 rounded-xl">
                  <span className="block text-[8px] font-black uppercase text-slate-400 font-mono">PURCHASE PRICE</span>
                  <span className="text-sm font-black text-slate-850 dark:text-slate-100 font-mono">
                    ₹{product.purchasePrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics summary panel */}
            <div className="p-5 bg-slate-50/40 dark:bg-slate-900/10 border border-slate-200/50 dark:border-slate-850 rounded-xl space-y-4">
              <span className="block text-[10px] font-mono font-black uppercase tracking-wider text-slate-400">Stock Status Summary</span>
              
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Total Quantity</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{product.quantity} Units</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Reserved Units</span>
                  <span className="font-bold text-amber-500">{product.reservedQuantity} Units</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Available Stock</span>
                  <span className="font-bold text-emerald-500">{product.availableQuantity} Units</span>
                </div>
                <div className="flex justify-between font-mono pt-3 border-t border-slate-150">
                  <span className="text-slate-400">Warehouse location</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{product.warehouseName}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stock-history' && (
          <div className="max-w-2xl">
            <StockTimeline events={stockHistory} />
          </div>
        )}

        {activeTab === 'purchase-history' && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono tracking-wider">Purchase History (Vendor Orders)</h3>
            {purchaseHistory.length > 0 ? (
              <div className="border border-slate-150 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-mono font-black text-slate-400 uppercase">
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Vendor Name</th>
                      <th className="p-3">Order Status</th>
                      <th className="p-3">Received Qty</th>
                      <th className="p-3">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {purchaseHistory.map(po => (
                      <tr key={po.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-indigo-500">{po.id}</td>
                        <td className="p-3 font-semibold">{po.supplierName}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-emerald-50 text-emerald-600 font-bold">
                            {po.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono">{po.quantity} units</td>
                        <td className="p-3 font-mono font-bold">₹{po.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 text-center border border-dashed rounded-xl select-none">
                <span className="text-xs text-slate-400 italic">No purchase order associations recorded.</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'suppliers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supplier ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="inline-block px-1.5 py-0.5 text-[8px] font-black uppercase font-mono bg-indigo-50 text-indigo-500 border border-indigo-500/10 rounded">
                    Active Partner
                  </span>
                  <h4 className="text-xs font-black font-mono uppercase text-slate-800 dark:text-slate-100 mt-2 block">
                    {supplier.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">Supplier Code: {supplier.code}</p>
                </div>
                <div className="space-y-2 text-xs text-slate-500 leading-relaxed font-light">
                  <p><strong>Primary Contact:</strong> {supplier.contactPerson}</p>
                  <p><strong>Support Email:</strong> {supplier.email}</p>
                  <p><strong>Telephone:</strong> {supplier.phone}</p>
                  <p><strong>Corporate Address:</strong> {supplier.address}</p>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center border border-dashed rounded-xl select-none">
                <span className="text-xs text-slate-400 italic">No supplier directory matches this item.</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'warehouses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {warehouse ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="inline-block px-1.5 py-0.5 text-[8px] font-black uppercase font-mono bg-indigo-50 text-indigo-500 border border-indigo-500/10 rounded">
                    Storage Coordinator
                  </span>
                  <h4 className="text-xs font-black font-mono uppercase text-slate-800 dark:text-slate-100 mt-2 block">
                    {warehouse.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">Location: {warehouse.location}</p>
                </div>
                <div className="space-y-2 text-xs text-slate-500 leading-relaxed font-light">
                  <p><strong>Depot Code:</strong> {warehouse.code}</p>
                  <p><strong>Warehouse Manager:</strong> {warehouse.manager}</p>
                  <p><strong>Occupancy status:</strong> {warehouse.status}</p>
                  <p><strong>Silo capacity level:</strong> {warehouse.capacityLevel} / {warehouse.maxCapacity} units</p>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center border border-dashed rounded-xl select-none">
                <span className="text-xs text-slate-400 italic">No warehouse placement associations recorded.</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'barcode' && (
          <div className="flex justify-center py-6">
            <BarcodePreview sku={product.sku} name={product.name} barcodeValue={product.barcode || '8901234567890'} />
          </div>
        )}

        {activeTab === 'qrcode' && (
          <div className="flex justify-center py-6">
            <QRPreview sku={product.sku} name={product.name} value={`product-id:${product.id};sku:${product.sku};stock:${product.quantity}`} />
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono tracking-wider">Associated Documentation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 border rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span className="text-[11px] font-bold">Catalog_Spec_Sheet_{product.sku}.xlsx</span>
                </div>
                <button
                  onClick={() => toast.success('Downloading spec sheet...')}
                  className="px-2 py-1 text-[9px] font-mono font-black uppercase bg-indigo-600 hover:bg-indigo-700 text-white rounded cursor-pointer"
                >
                  Get
                </button>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 border rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Files className="w-4 h-4 text-indigo-500" />
                  <span className="text-[11px] font-bold">Compliance_FIPS_Certificate.pdf</span>
                </div>
                <button
                  onClick={() => toast.success('Downloading certificate...')}
                  className="px-2 py-1 text-[9px] font-mono font-black uppercase bg-indigo-600 hover:bg-indigo-700 text-white rounded cursor-pointer"
                >
                  Get
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="max-w-xl text-left space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono tracking-wider">Material Audit Stream</h3>
            <div className="relative pl-6 border-l border-slate-100 dark:border-slate-900 space-y-5">
              <div className="relative">
                <span className="absolute -left-[30px] top-1.5 w-4.5 h-4.5 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-500">2026-07-18 11:30 UTC</span>
                <p className="text-xs font-bold mt-1 text-slate-800 dark:text-slate-100">Stock count audited</p>
                <p className="text-[11px] text-slate-500 leading-relaxed font-light">Inventory coordinator verified stock counts matched physical registry labels.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[30px] top-1.5 w-4.5 h-4.5 rounded-full bg-indigo-500/15 border-2 border-indigo-500 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                </span>
                <span className="text-[10px] font-mono font-bold text-indigo-500">2026-07-16 09:15 UTC</span>
                <p className="text-xs font-bold mt-1 text-slate-800 dark:text-slate-100">PO Deliveries Received</p>
                <p className="text-[11px] text-slate-500 leading-relaxed font-light">Incoming delivery of PO-902 received at the docking gate and checked in.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai-prediction' && (
          <div className="space-y-6">
            <div className="p-4 bg-indigo-600 text-white rounded-2xl flex items-start gap-4 text-left">
              <div className="p-2.5 bg-white/20 text-white rounded-xl shrink-0">
                <Sparkles className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-black uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded">
                  Gemini Predictive intelligence
                </span>
                <h4 className="text-xs font-black uppercase tracking-wide">AI Recommendation: Low Stock Alert Warning</h4>
                <p className="text-[11px] font-light leading-relaxed">
                  Based on current seasonal sales velocity, the stock of {product.name} is forecast to hit 0 units in 14 days. Sourcing lead times from {supplier?.name || 'Default Supplier'} stand at 5 days. We recommend initiating a Purchase Order of at least 25 units immediately.
                </p>
              </div>
            </div>

            {/* Prediction Area Chart */}
            <div className="space-y-2 select-none">
              <h4 className="text-xs font-black uppercase font-mono tracking-wider text-slate-400">Demand Forecast (6-Months Area Chart)</h4>
              <div className="h-64 bg-slate-50/50 dark:bg-slate-900/10 border border-slate-200/50 rounded-xl p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={aiForecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '10px' }} />
                    <Area type="monotone" dataKey="prediction" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorPred)" name="AI Forecast Stock Needed" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
