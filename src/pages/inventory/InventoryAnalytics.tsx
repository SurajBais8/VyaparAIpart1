/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { inventoryService, InventoryItem } from '../../services/inventory.service';
import { warehouseService, Warehouse } from '../../services/warehouse.service';
import { supplierService, Supplier } from '../../services/supplier.service';
import { Card } from '../../components/ui';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  LineChart, 
  TrendingUp, 
  Package, 
  Warehouse as WHIcon, 
  Users2, 
  AlertTriangle,
  Coins,
  Cpu,
  Star,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

export const InventoryAnalytics: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [inv, whs, sups] = await Promise.all([
        inventoryService.getInventoryItems(),
        warehouseService.getWarehouses(),
        supplierService.getSuppliers()
      ]);
      setItems(inv);
      setWarehouses(whs);
      setSuppliers(sups);
    } catch {
      toast.error('Failed to parse analytics records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute metric numbers
  const totalStockValue = items.reduce((sum, i) => sum + (i.stockLevel * i.costPrice), 0);
  const totalCatalogCount = items.length;
  const criticalDeficitCount = items.filter(i => i.stockLevel <= i.minStockLevel).length;
  const totalSupplierPayables = suppliers.reduce((sum, s) => sum + s.outstandingBalance, 0);

  // Chart Data 1: Stock Value by Category
  const categoryValueData = Object.entries(
    items.reduce((acc, item) => {
      const val = item.stockLevel * item.costPrice;
      acc[item.category] = (acc[item.category] || 0) + val;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // Chart Data 2: Warehouse capacity utilization
  const warehouseCapacityData = warehouses.map((wh) => ({
    name: wh.name.replace(' Warehouse', '').replace(' Storage', '').replace(' Central', '').replace(' Cloud', ''),
    used: wh.capacityLevel,
    free: Math.max(0, wh.maxCapacity - wh.capacityLevel)
  }));

  // Chart Data 3: Supplier Reliability ratings
  const supplierReliabilityData = suppliers.map((sup) => ({
    name: sup.name.replace(' Pvt Ltd', '').replace(' Ltd', '').replace(' Co', ''),
    score: sup.reliabilityScore
  }));

  // Colors
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="space-y-6 text-left">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-5 select-none">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <LineChart className="w-5 h-5 text-indigo-500 animate-pulse" /> Inventory Control Center
          </h1>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Operational dashboard compiling stock valuations, capacity margins, and contractor scores.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
        </div>
      ) : (
        <>
          {/* Executive metrics summaries */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <Card variant="glass" className="p-4 flex items-center gap-4 border border-slate-200/50 dark:border-slate-850/80 shadow-2xs">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
                <Coins className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="block text-[10px] font-black text-slate-400 uppercase font-mono tracking-widest">Total Asset Valuation</span>
                <span className="text-lg font-black font-mono text-slate-800 dark:text-slate-100">
                  ₹{totalStockValue.toLocaleString()}
                </span>
                <span className="block text-[9px] text-slate-400 font-mono">Based on cost price</span>
              </div>
            </Card>

            <Card variant="glass" className="p-4 flex items-center gap-4 border border-slate-200/50 dark:border-slate-850/80 shadow-2xs">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <Package className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="block text-[10px] font-black text-slate-400 uppercase font-mono tracking-widest">Material SKU Rows</span>
                <span className="text-lg font-black font-mono text-slate-800 dark:text-slate-100">
                  {totalCatalogCount} rows
                </span>
                <span className="block text-[9px] text-slate-400 font-mono">Assigned to catalog</span>
              </div>
            </Card>

            <Card variant="glass" className="p-4 flex items-center gap-4 border border-slate-200/50 dark:border-slate-850/80 shadow-2xs">
              <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-500">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="block text-[10px] font-black text-slate-400 uppercase font-mono tracking-widest">Deficit Stock Alerts</span>
                <span className="text-lg font-black font-mono text-rose-600 dark:text-rose-400">
                  {criticalDeficitCount} rows
                </span>
                <span className="block text-[9px] text-slate-400 font-mono">Below minimum limit</span>
              </div>
            </Card>

            <Card variant="glass" className="p-4 flex items-center gap-4 border border-slate-200/50 dark:border-slate-850/80 shadow-2xs">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-500">
                <Users2 className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="block text-[10px] font-black text-slate-400 uppercase font-mono tracking-widest">Supplier Payables</span>
                <span className="text-lg font-black font-mono text-slate-800 dark:text-slate-100">
                  ₹{totalSupplierPayables.toLocaleString()}
                </span>
                <span className="block text-[9px] text-slate-400 font-mono">Unsettled accounts</span>
              </div>
            </Card>

          </div>

          {/* Charts section layout split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart 1: Stock Value by Category (Pie Chart) */}
            <Card variant="glass" className="p-5 border border-slate-200/50 dark:border-slate-850/80 shadow-2xs lg:col-span-1 flex flex-col justify-between space-y-4">
              <div className="text-left select-none space-y-0.5">
                <h3 className="text-xs font-black uppercase text-slate-800 dark:text-slate-100 font-mono tracking-wide flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-indigo-500" /> Asset Value Shares
                </h3>
                <p className="text-[10px] text-slate-400 font-light">
                  Capital values grouped by item material category tags.
                </p>
              </div>

              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryValueData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryValueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: number) => [`₹${val.toLocaleString()}`, 'Valuation']} 
                      contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends list */}
              <div className="space-y-1.5 text-[10px] font-bold font-mono">
                {categoryValueData.map((entry, index) => (
                  <div key={entry.name} className="flex justify-between items-center select-none text-slate-550 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span>{entry.name}</span>
                    </div>
                    <span>₹{entry.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Chart 2: Warehouse capacity utilization */}
            <Card variant="glass" className="p-5 border border-slate-200/50 dark:border-slate-850/80 shadow-2xs lg:col-span-2 flex flex-col justify-between space-y-4">
              <div className="text-left select-none space-y-0.5">
                <h3 className="text-xs font-black uppercase text-slate-800 dark:text-slate-100 font-mono tracking-wide flex items-center gap-1.5">
                  <WHIcon className="w-4 h-4 text-indigo-500" /> Warehouse Capacities
                </h3>
                <p className="text-[10px] text-slate-400 font-light">
                  Utilized space versus remaining buffer space in storage units.
                </p>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={warehouseCapacityData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontStyle="bold" fontFamily="monospace" />
                    <YAxis stroke="#94a3b8" fontSize={9} fontStyle="bold" fontFamily="monospace" />
                    <Tooltip 
                      contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', fontFamily: 'monospace' }} />
                    <Bar dataKey="used" name="Occupied Units" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="free" name="Empty Units" stackId="a" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </Card>

          </div>

          {/* Chart 3: Supplier reliability metrics */}
          <Card variant="glass" className="p-5 border border-slate-200/50 dark:border-slate-850/80 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="text-left select-none space-y-0.5">
              <h3 className="text-xs font-black uppercase text-slate-800 dark:text-slate-100 font-mono tracking-wide flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-500" /> Supplier Delivery Reliability Scores
              </h3>
              <p className="text-[10px] text-slate-400 font-light">
                Average compliance scores of contractors for on-time delivery.
              </p>
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={supplierReliabilityData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontStyle="bold" fontFamily="monospace" />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={9} fontStyle="bold" fontFamily="monospace" />
                  <Tooltip 
                    formatter={(val: number) => [`${val}% Score`, 'Reliability']}
                    contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  />
                  <Bar dataKey="score" name="Reliability Percent" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={45}>
                    {supplierReliabilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score >= 90 ? '#10b981' : '#f59e0b'} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}

    </div>
  );
};
