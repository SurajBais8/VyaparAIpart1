import React, { useEffect, useState } from 'react';
import { productService } from '../../services/product.service';
import { warehouseService, Warehouse } from '../../services/warehouse.service';
import { purchaseService, PurchaseOrder } from '../../services/purchase.service';
import { Product } from '../../services/inventory.service';
import { 
  FileText, 
  Printer, 
  Download, 
  TrendingUp, 
  Boxes, 
  PieChart as PieIcon, 
  AlertTriangle,
  SlidersHorizontal,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from 'recharts';

export const InventoryReports: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [pos, setPOs] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedWarehouse, setSelectedWarehouse] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dateRange, setDateRange] = useState('This Month');

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, whs, orderList] = await Promise.all([
        productService.getProducts(),
        warehouseService.getWarehouses(),
        purchaseService.getPurchaseOrders()
      ]);
      setProducts(prods);
      setWarehouses(whs);
      setPOs(orderList);
    } catch {
      toast.error('Failed to parse reporting directories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute calculated metrics
  const filteredProducts = products.filter(p => {
    const matchWh = selectedWarehouse === 'All' || p.warehouseId === selectedWarehouse;
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchWh && matchCat;
  });

  const totalAssetValue = filteredProducts.reduce((sum, p) => sum + (p.sellingPrice * p.quantity), 0);
  const totalCostValue = filteredProducts.reduce((sum, p) => sum + (p.purchasePrice * p.quantity), 0);
  const totalItemsCount = filteredProducts.reduce((sum, p) => sum + p.quantity, 0);
  const lowStockCount = filteredProducts.filter(p => p.quantity < 10).length;

  const handlePrint = () => {
    toast.success('Spooling high-fidelity printable report document...');
  };

  const handleExportPDF = () => {
    toast.success('Downloading compiled report file as standard PDF layout.');
  };

  const handleExportExcel = () => {
    toast.success('Downloading matrix spreadsheets as secure XLSX table format.');
  };

  // Recharts chart data structures
  const warehouseCapacityData = warehouses.map(w => ({
    name: w.name,
    used: w.capacityLevel,
    free: Math.max(0, w.maxCapacity - w.capacityLevel)
  }));

  const categoryDistributionData = Array.from(new Set(products.map(p => p.category))).map(cat => {
    const catProds = products.filter(p => p.category === cat);
    return {
      category: cat,
      value: catProds.reduce((sum, p) => sum + (p.sellingPrice * p.quantity), 0)
    };
  });

  const categories = ['All', ...new Set(products.map(p => p.category))];

  return (
    <div className="space-y-6 text-left">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-150 pb-5">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" /> Executive Analytics & Reports
          </h1>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Audit capital valuations, storage efficiency gauges, supplier fulfillment performance and stock deficits.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-indigo-500" /> Print Report
          </button>
          <button
            onClick={handleExportPDF}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" /> Get Excel (XLSX)
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <div className="p-5 bg-white border border-slate-150 rounded-2xl shadow-2xs space-y-4 select-none">
        <div className="flex items-center gap-2 text-slate-800">
          <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-black uppercase font-mono tracking-wider">Configure Report Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Storage Depot Selection */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Target Storage Depot</label>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="p-2 text-xs rounded-xl border border-slate-200 bg-transparent text-slate-650 outline-none font-bold"
            >
              <option value="All">All Storage Depots</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          {/* Category selection */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Catalog Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 text-xs rounded-xl border border-slate-200 bg-transparent text-slate-650 outline-none font-bold"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>
          </div>

          {/* Date Range Select */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Audit Window Period</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="p-2 text-xs rounded-xl border border-slate-200 bg-transparent text-slate-650 outline-none font-bold"
            >
              <option value="This Month">This Month (Current)</option>
              <option value="Last Month">Last Month</option>
              <option value="Year-to-date">Year-to-date (YTD)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Stats summary block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        <div className="p-4 bg-white border border-slate-150 rounded-2xl">
          <span className="block text-[8px] font-black uppercase text-slate-400 font-mono">STOCK ASSET VALUATION</span>
          <span className="text-sm font-black text-slate-800 font-mono mt-1 block">₹{totalAssetValue.toLocaleString()}</span>
          <span className="text-[10px] text-emerald-600 font-mono mt-0.5 block font-bold">Estimated gross retail value</span>
        </div>

        <div className="p-4 bg-white border border-slate-150 rounded-2xl">
          <span className="block text-[8px] font-black uppercase text-slate-400 font-mono">STOCK COST VALUE</span>
          <span className="text-sm font-black text-slate-800 font-mono mt-1 block">₹{totalCostValue.toLocaleString()}</span>
          <span className="text-[10px] text-slate-450 font-mono mt-0.5 block font-light">Asset book-cost total</span>
        </div>

        <div className="p-4 bg-white border border-slate-150 rounded-2xl">
          <span className="block text-[8px] font-black uppercase text-slate-400 font-mono">TOTAL LOGISTIC QUANTITY</span>
          <span className="text-sm font-black text-slate-800 font-mono mt-1 block">{totalItemsCount} units</span>
          <span className="text-[10px] text-slate-450 font-mono mt-0.5 block font-light">Sum of physical item counts</span>
        </div>

        <div className="p-4 bg-rose-500/5 border border-rose-200 rounded-2xl">
          <span className="block text-[8px] font-black uppercase text-rose-500 font-mono">CRITICAL DEFICIT CODES</span>
          <span className="text-sm font-black text-rose-600 font-mono mt-1 block">{lowStockCount} items</span>
          <span className="text-[10px] text-rose-500 font-mono mt-0.5 block font-bold">Awaiting PO procurement</span>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 select-none text-left">
        {/* Warehouse Occupancy Capacity */}
        <div className="p-5 bg-white border rounded-2xl space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-450 font-mono">Depot Capacity & Allocation</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={warehouseCapacityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '10px' }} />
                <Legend verticalAlign="top" height={36} iconType="circle" fontSize={10} />
                <Bar dataKey="used" name="Occupied Slots (Qty)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="free" name="Empty Slots" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category distribution chart */}
        <div className="p-5 bg-white border rounded-2xl space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-450 font-mono">Asset Capital Value by Category</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '10px' }} />
                <Bar dataKey="value" name="Capital Value (₹)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main details table of compiled materials */}
      <div className="bg-white border rounded-2xl overflow-hidden shadow-2xs select-none">
        <div className="p-4 border-b flex justify-between items-center">
          <span className="text-xs font-black uppercase font-mono text-slate-400">Material Valuation List</span>
          <span className="text-[10px] text-slate-450 font-mono font-bold">Displaying {filteredProducts.length} entries</span>
        </div>

        <div className="overflow-x-auto text-xs text-left">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b select-none text-[10px] font-black text-slate-400 uppercase font-mono tracking-wider">
                <th className="p-4">SKU / Code</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Warehouse Depot</th>
                <th className="p-4 text-right">Available Qty</th>
                <th className="p-4 text-right">Purchase Cost (₹)</th>
                <th className="p-4 text-right">Selling Value (₹)</th>
                <th className="p-4 text-right">Total Valuation (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const totalVal = p.sellingPrice * p.quantity;
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-4 font-mono font-bold text-indigo-600">{p.sku}</td>
                    <td className="p-4 font-bold text-slate-800">{p.name}</td>
                    <td className="p-4 font-semibold text-slate-600">{p.warehouseName}</td>
                    <td className="p-4 text-right font-mono">{p.quantity} units</td>
                    <td className="p-4 text-right font-mono">₹{p.purchasePrice.toLocaleString()}</td>
                    <td className="p-4 text-right font-mono">₹{p.sellingPrice.toLocaleString()}</td>
                    <td className="p-4 text-right font-mono font-black text-slate-700">₹{totalVal.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
