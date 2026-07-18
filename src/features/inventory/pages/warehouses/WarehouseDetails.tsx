import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { warehouseService, Warehouse } from '../../services/warehouse.service';
import { productService } from '../../services/product.service';
import { stockTransferService, StockTransfer } from '../../services/stockTransfer.service';
import { Product } from '../../services/inventory.service';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  User, 
  TrendingUp, 
  ShieldAlert, 
  BarChart4, 
  Users2, 
  Shuffle, 
  FileText,
  Boxes
} from 'lucide-react';
import { toast } from 'sonner';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

export const WarehouseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [transfers, setTransfers] = useState<StockTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const loadWarehouseDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const wh = await warehouseService.getWarehouseById(id);
      if (wh) {
        setWarehouse(wh);
        const [stocks, allTransfers] = await Promise.all([
          warehouseService.getWarehouseStock(wh.id),
          stockTransferService.getTransfers()
        ]);
        setProducts(stocks);
        setTransfers(allTransfers.filter(t => t.sourceWarehouseId === wh.id || t.destWarehouseId === wh.id));
      } else {
        toast.error('Warehouse node not found.');
      }
    } catch {
      toast.error('Failed to parse warehouse directories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWarehouseDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="p-10 text-center bg-white border rounded-2xl">
        <span className="text-sm text-slate-400">Warehouse not found.</span>
        <button onClick={() => navigate('/inventory/warehouses')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs uppercase font-mono">Back to Warehouses</button>
      </div>
    );
  }

  const usagePercent = Math.min(100, Math.round((warehouse.capacityLevel / warehouse.maxCapacity) * 100));
  const freeSpace = Math.max(0, warehouse.maxCapacity - warehouse.capacityLevel);

  // Pie chart data
  const occupancyData = [
    { name: 'Used Space', value: warehouse.capacityLevel, color: '#6366f1' },
    { name: 'Free Space', value: freeSpace, color: '#cbd5e1' }
  ];

  // Bar chart data for stock items
  const stockBarData = products.map(p => ({
    name: p.sku,
    qty: p.quantity
  }));

  const tabItems = [
    { id: 'overview', title: 'Overview' },
    { id: 'products', title: 'Products' },
    { id: 'inventory', title: 'Inventory Stats' },
    { id: 'transfers', title: 'Transfers' },
    { id: 'employees', title: 'Employees' },
    { id: 'reports', title: 'SLA Reports' },
    { id: 'analytics', title: 'Analytics' }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Title block */}
      <div className="flex items-center gap-3 select-none">
        <button
          onClick={() => navigate('/inventory/warehouses')}
          className="p-2 border border-slate-150 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl cursor-pointer text-slate-500"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400">
            Storage Code: {warehouse.code}
          </span>
          <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide font-mono">
            {warehouse.name}
          </h2>
        </div>
      </div>

      {/* Stats row cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        <div className="p-4 bg-white border rounded-2xl flex flex-col justify-between">
          <span className="block text-[8px] font-black uppercase text-slate-400 font-mono">USED SPACE</span>
          <span className="text-sm font-black text-slate-800 font-mono mt-1">{warehouse.capacityLevel} Units</span>
        </div>
        <div className="p-4 bg-white border rounded-2xl flex flex-col justify-between">
          <span className="block text-[8px] font-black uppercase text-slate-400 font-mono">AVAILABLE SPACE</span>
          <span className="text-sm font-black text-slate-800 font-mono mt-1">{freeSpace} Units</span>
        </div>
        <div className="p-4 bg-white border rounded-2xl flex flex-col justify-between">
          <span className="block text-[8px] font-black uppercase text-slate-400 font-mono">TOTAL VALUATION</span>
          <span className="text-sm font-black text-indigo-600 font-mono mt-1">₹{(warehouse.stockValue || 4500000).toLocaleString()}</span>
        </div>
        <div className="p-4 bg-white border rounded-2xl flex flex-col justify-between">
          <span className="block text-[8px] font-black uppercase text-slate-400 font-mono">ACTIVE PRODUCTS</span>
          <span className="text-sm font-black text-slate-800 font-mono mt-1">{products.length} catalog rows</span>
        </div>
      </div>

      {/* Tabs navigation */}
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

      {/* Tabs Content */}
      <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-2xs">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-400 font-mono">Coordinates & Contacts</h3>
                <div className="space-y-2 text-xs text-slate-600 leading-relaxed font-light">
                  <p className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-450" /> <strong>Site Address:</strong> {warehouse.location}</p>
                  <p className="flex items-center gap-1.5"><User className="w-4 h-4 text-slate-450" /> <strong>Primary Manager:</strong> {warehouse.manager}</p>
                  <p className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-slate-450" /> <strong>Status:</strong> {warehouse.status}</p>
                </div>
              </div>

              {/* Timeline widget */}
              <div className="space-y-3 pt-4">
                <h3 className="text-xs font-black uppercase text-slate-400 font-mono">Warehouse Node History</h3>
                <div className="relative border-l border-slate-100 pl-4 space-y-4 text-xs select-none">
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-mono text-slate-400 font-bold">2026-07-18</span>
                    <p className="font-bold text-slate-700">Storage capacity audited</p>
                    <p className="text-[11px] text-slate-450 mt-0.5">Physical storage usage verified as {usagePercent}% by Rajesh Nair.</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span className="text-[9px] font-mono text-slate-400 font-bold">2026-07-10</span>
                    <p className="font-bold text-slate-700">Stock Transfer TRSF-501 received</p>
                    <p className="text-[11px] text-slate-450 mt-0.5">2 servers successfully received from Mumbai Hub.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Occupancy circular layout */}
            <div className="p-4 border border-slate-150 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center select-none text-center">
              <span className="block text-[9px] font-mono font-black uppercase tracking-wider text-slate-400">Occupancy Gauge</span>
              <div className="h-44 w-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={occupancyData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                      {occupancyData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <span className="text-xs font-black font-mono text-slate-800">{usagePercent}% CAPACITY COMPLETED</span>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono">Assigned Material Products</h3>
            {products.length > 0 ? (
              <div className="border border-slate-150 rounded-xl overflow-hidden text-xs text-left">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-mono font-black text-slate-400 uppercase">
                      <th className="p-3">SKU</th>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">In Stock</th>
                      <th className="p-3">Selling Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-indigo-600">{p.sku}</td>
                        <td className="p-3 font-semibold">{p.name}</td>
                        <td className="p-3 font-mono font-bold">{p.quantity} units</td>
                        <td className="p-3 font-mono">₹{p.sellingPrice.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 border border-dashed rounded-xl text-center select-none">
                <span className="text-xs text-slate-400 italic">No products assigned to this coordinate silo.</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
            <div className="p-4 border border-slate-150 rounded-xl space-y-4">
              <h3 className="text-xs font-black uppercase text-indigo-500 font-mono">Stock level warning matrix</h3>
              <div className="space-y-3 text-xs text-left">
                {products.map(p => (
                  <div key={p.id} className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <div>
                      <span className="block font-semibold">{p.name}</span>
                      <span className="text-[9px] text-slate-400 font-mono">{p.sku}</span>
                    </div>
                    <span className={`font-mono font-black px-2 py-0.5 rounded
                      ${p.quantity < 10 ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-500'}`}>
                      {p.quantity} Units
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transfers' && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono">Associated Relocations (Stock Transfers)</h3>
            {transfers.length > 0 ? (
              <div className="border border-slate-150 rounded-xl overflow-hidden text-xs text-left">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-mono font-black text-slate-400 uppercase">
                      <th className="p-3">Transfer ID</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3">Direction</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transfers.map(tr => {
                      const isSource = tr.sourceWarehouseId === warehouse.id;
                      return (
                        <tr key={tr.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-indigo-600">{tr.id}</td>
                          <td className="p-3 font-mono">{tr.sku}</td>
                          <td className="p-3 font-mono font-bold">{tr.quantity} units</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold
                              ${isSource ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                              {isSource ? `OUTBOUND -> ${tr.destWarehouseName}` : `<- INBOUND from ${tr.sourceWarehouseName}`}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-slate-650">{tr.status}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 border border-dashed rounded-xl text-center select-none">
                <span className="text-xs text-slate-400 italic">No transfer movements logged for this silo.</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="space-y-4 select-none">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono">Registered Warehouse Operators</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
              {(warehouse.employees || ["Amit Sharma", "Pooja Patel", "Rohan Sen"]).map(emp => (
                <div key={emp} className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-center gap-2.5 text-left text-xs">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center">
                    {emp[0]}
                  </div>
                  <div>
                    <span className="block font-bold text-slate-700">{emp}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Assigned Staff</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-4 select-none">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono">Warehouse SLA Compliance Sheets</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl text-left">
              <div className="p-3 border rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-bold">Capacity_Report_Q3_2026.pdf</span>
                </div>
                <button onClick={() => toast.success('Downloaded report')} className="px-2 py-1 text-[9px] font-mono font-black bg-indigo-600 text-white rounded">Get</button>
              </div>
              <div className="p-3 border rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold">Site_Audit_Signoff.pdf</span>
                </div>
                <button onClick={() => toast.success('Downloaded report')} className="px-2 py-1 text-[9px] font-mono font-black bg-indigo-600 text-white rounded">Get</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6 select-none text-left">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono">Silo Sku Distribution</h3>
            <div className="h-60 bg-slate-50/50 border border-slate-200/50 rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '10px' }} />
                  <Bar dataKey="qty" fill="#6366f1" radius={[4, 4, 0, 0]} name="Inbound Qty" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
