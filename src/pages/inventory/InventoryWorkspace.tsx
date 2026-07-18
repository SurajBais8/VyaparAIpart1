/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { inventoryService, InventoryItem } from '../../services/inventory.service';
import { warehouseService, Warehouse } from '../../services/warehouse.service';
import { supplierService, Supplier } from '../../services/supplier.service';
import { Card, Button, Input } from '../../components/ui';
import { 
  Package, 
  Plus, 
  Search, 
  TrendingDown, 
  QrCode, 
  Cpu, 
  Warehouse as WHIcon, 
  Layers, 
  AlertTriangle, 
  Trash2, 
  Edit,
  Sparkles,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

export const InventoryWorkspace: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filtered, setFiltered] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedWarehouse, setSelectedWarehouse] = useState('All');
  const [showAlertsOnly, setShowAlertsOnly] = useState(false);

  // Dialog State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    sku: '',
    barcode: '',
    category: 'Hardware',
    warehouseId: '',
    stockLevel: 10,
    minStockLevel: 5,
    unitPrice: 1000,
    costPrice: 600,
    supplierId: ''
  });

  // Mock Scanning Simulator state
  const [isScanning, setIsScanning] = useState(false);
  const [scanQuery, setScanQuery] = useState('');
  const [scannedItem, setScannedItem] = useState<InventoryItem | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [inv, whs, sups] = await Promise.all([
        inventoryService.getInventoryItems(),
        warehouseService.getWarehouses(),
        supplierService.getSuppliers()
      ]);
      setItems(inv);
      setFiltered(inv);
      setWarehouses(whs);
      setSuppliers(sups);

      if (whs.length > 0 && sups.length > 0) {
        setNewItem(prev => ({
          ...prev,
          warehouseId: whs[0].id,
          supplierId: sups[0].id
        }));
      }
    } catch (err) {
      toast.error('Failed to load inventory assets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter application
  useEffect(() => {
    let result = items;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        i =>
          i.name.toLowerCase().includes(q) ||
          i.sku.toLowerCase().includes(q) ||
          i.barcode.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(i => i.category === selectedCategory);
    }

    if (selectedWarehouse !== 'All') {
      result = result.filter(i => i.warehouseId === selectedWarehouse);
    }

    if (showAlertsOnly) {
      result = result.filter(i => i.stockLevel <= i.minStockLevel);
    }

    setFiltered(result);
  }, [items, searchQuery, selectedCategory, selectedWarehouse, showAlertsOnly]);

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.sku) {
      toast.error('Product Name and SKU are required.');
      return;
    }

    const whName = warehouses.find(w => w.id === newItem.warehouseId)?.name || 'Default Hub';
    const supName = suppliers.find(s => s.id === newItem.supplierId)?.name || 'Default Supplier';

    try {
      await inventoryService.createInventoryItem({
        name: newItem.name,
        sku: newItem.sku,
        barcode: newItem.barcode || Math.floor(1000000000000 + Math.random() * 9000000000000).toString(),
        category: newItem.category,
        warehouseId: newItem.warehouseId,
        warehouseName: whName,
        stockLevel: Number(newItem.stockLevel),
        minStockLevel: Number(newItem.minStockLevel),
        unitPrice: Number(newItem.unitPrice),
        costPrice: Number(newItem.costPrice),
        supplierId: newItem.supplierId,
        supplierName: supName
      });

      toast.success(`Successfully saved "${newItem.name}" to inventory.`);
      setIsAddOpen(false);
      setNewItem({
        name: '',
        sku: '',
        barcode: '',
        category: 'Hardware',
        warehouseId: warehouses[0]?.id || '',
        stockLevel: 10,
        minStockLevel: 5,
        unitPrice: 1000,
        costPrice: 600,
        supplierId: suppliers[0]?.id || ''
      });
      loadData();
    } catch (err) {
      toast.error('Failed to create product.');
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (confirm(`Wipe "${name}" from inventory records permanently?`)) {
      await inventoryService.deleteInventoryItem(id);
      toast.success('Removed product from registry.');
      loadData();
    }
  };

  // Barcode Mock Scanner Simulator execution
  const handleTriggerMockScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanQuery.trim()) return;

    setIsScanning(true);
    setScannedItem(null);

    setTimeout(() => {
      const q = scanQuery.trim().toLowerCase();
      const match = items.find(
        item => item.barcode === q || item.sku.toLowerCase() === q || item.id.toLowerCase() === q
      );

      if (match) {
        setScannedItem(match);
        toast.success(`Successful Scan: matched SKU ${match.sku}`);
      } else {
        toast.error('Scan Error: product barcode or SKU not registered.');
      }
      setIsScanning(false);
    }, 700);
  };

  const handleUpdateScannedStock = async (newLevel: number) => {
    if (!scannedItem) return;
    try {
      const updated = await inventoryService.updateInventoryItem(scannedItem.id, {
        stockLevel: Math.max(0, newLevel)
      });
      setScannedItem(updated);
      toast.success(`Updated stock of "${updated.name}" to ${updated.stockLevel}`);
      loadData();
    } catch {
      toast.error('Failed to adjust stock levels.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-5 select-none">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-500 animate-pulse" /> Material Inventory Directory
          </h1>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Real-time stock audits, barcode catalogs, and automated storage capacity trackers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Material Item
          </button>
        </div>
      </div>

      {/* Main layout split: Search & Table vs Mock QR Scanner Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Table & Filters (takes 3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Filtering row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-950 p-4 border border-slate-150 dark:border-slate-850/60 rounded-2xl shadow-2xs">
            
            {/* Search Input */}
            <div className="relative sm:col-span-2">
              <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by name, SKU, or barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 text-xs text-slate-800 dark:text-slate-200 outline-none"
              />
            </div>

            {/* Warehouse select */}
            <div>
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-650 dark:text-slate-350 outline-none font-bold"
              >
                <option value="All">All Storage Hubs</option>
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            {/* Critical deficit filter button */}
            <button
              onClick={() => setShowAlertsOnly(!showAlertsOnly)}
              className={`py-2 px-3 rounded-xl border text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer
                ${showAlertsOnly 
                  ? 'bg-rose-500 text-white border-rose-500' 
                  : 'bg-transparent text-rose-500 hover:bg-rose-50 border-rose-500/20'}`}
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Deficit Stock ({items.filter(i => i.stockLevel <= i.minStockLevel).length})
            </button>
          </div>

          {/* Core Inventory items table */}
          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
            </div>
          ) : filtered.length > 0 ? (
            <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850/70 rounded-2xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-850 select-none text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider">
                      <th className="p-4">Material ID</th>
                      <th className="p-4">SKU / Barcode</th>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Warehouse</th>
                      <th className="p-4 text-right">Available Stock</th>
                      <th className="p-4 text-right">Selling Price</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                    {filtered.map((item) => {
                      const isAlert = item.stockLevel <= item.minStockLevel;
                      return (
                        <tr 
                          key={item.id}
                          className={`hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors
                            ${isAlert ? 'bg-rose-500/5 dark:bg-rose-950/5' : ''}`}
                        >
                          <td className="p-4 font-mono font-black text-[10px] text-slate-400">{item.id}</td>
                          <td className="p-4 text-left">
                            <div className="flex flex-col font-mono text-[10px]">
                              <span className="font-bold text-slate-700 dark:text-slate-350">{item.sku}</span>
                              <span className="text-[9px] text-slate-400">{item.barcode}</span>
                            </div>
                          </td>
                          <td className="p-4 text-left">
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-800 dark:text-slate-100 block">{item.name}</span>
                              <span className="inline-block px-1.5 py-0.5 text-[8px] font-black uppercase font-mono bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-500/10 text-indigo-500 rounded">
                                {item.category}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-slate-600 dark:text-slate-300">
                            <span className="flex items-center gap-1.5">
                              <WHIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {item.warehouseName}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex flex-col items-end">
                              <span className={`font-mono font-bold text-xs
                                ${isAlert ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}
                              >
                                {item.stockLevel} units
                              </span>
                              {isAlert ? (
                                <span className="inline-flex items-center gap-0.5 text-[8px] font-black text-rose-500 font-mono uppercase tracking-widest mt-0.5">
                                  ● Critical Deficit
                                </span>
                              ) : (
                                <span className="text-[9px] text-slate-400 font-mono">Min: {item.minStockLevel}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                            ₹{item.unitPrice.toLocaleString()}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex justify-center items-center gap-1">
                              <button
                                onClick={() => {
                                  setScanQuery(item.sku);
                                  setScannedItem(item);
                                  toast.success(`Loaded "${item.name}" into Scan Terminal`);
                                }}
                                className="p-1.5 rounded-lg border border-slate-150 hover:border-indigo-500/30 text-indigo-500 cursor-pointer hover:bg-indigo-50/10"
                                title="Load item into Scanner Node"
                              >
                                <QrCode className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id, item.name)}
                                className="p-1.5 rounded-lg border border-slate-150 hover:border-rose-500/30 text-rose-500 cursor-pointer hover:bg-rose-50"
                                title="Remove Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-16 text-center bg-white border border-slate-200/50 rounded-2xl">
              <span className="text-xs text-slate-400">No material items found matching current search criteria.</span>
            </div>
          )}

        </div>

        {/* Right Side: QR/Barcode Scanning Simulator Terminal */}
        <div className="space-y-4">
          <Card 
            variant="glass"
            className="p-5 border border-slate-200/50 dark:border-slate-850/80 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 select-none">
                <QrCode className="w-4 h-4 text-indigo-500 animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-wider font-mono">
                  Bar/QR Scan Node
                </h3>
              </div>
              <p className="text-[10px] text-slate-450 font-light leading-relaxed">
                Enter a SKU or click the load icon on any row to simulate a physical handheld laser terminal scan.
              </p>

              {/* Input simulator Form */}
              <form onSubmit={handleTriggerMockScan} className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="SKU or Barcode..."
                  value={scanQuery}
                  onChange={(e) => setScanQuery(e.target.value)}
                  className="flex-grow px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/10 text-[11px] font-mono outline-none"
                />
                <button
                  type="submit"
                  className="px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-black uppercase font-mono tracking-wider cursor-pointer transition-colors"
                >
                  Scan
                </button>
              </form>

              {/* Scanning visual overlay loader */}
              {isScanning && (
                <div className="relative h-24 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-850">
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-emerald-500 shadow-lg shadow-emerald-500 animate-bounce" />
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest animate-pulse">
                    Laser Target Active...
                  </span>
                </div>
              )}

              {/* Scanned item stock modification panel */}
              {!isScanning && scannedItem && (
                <div className="p-3.5 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-200/50 dark:border-slate-850 space-y-3.5">
                  <div className="space-y-0.5 text-left">
                    <span className="text-[9px] font-mono font-black uppercase tracking-wider text-indigo-500 block">
                      Target SKU matched
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {scannedItem.name}
                    </h4>
                    <p className="text-[9px] text-slate-400 font-mono">
                      Warehouse: {scannedItem.warehouseName}
                    </p>
                  </div>

                  {/* Stock details */}
                  <div className="grid grid-cols-2 gap-2 text-center text-[10px] select-none font-mono font-bold uppercase">
                    <div className="p-2 bg-white dark:bg-slate-950 border rounded-lg">
                      <span className="block text-slate-400 text-[8px]">In Stock</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                        {scannedItem.stockLevel} units
                      </span>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-950 border rounded-lg">
                      <span className="block text-slate-400 text-[8px]">Deficit limit</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                        {scannedItem.minStockLevel} units
                      </span>
                    </div>
                  </div>

                  {/* Increment / Decrement actions */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-[8px] font-mono text-slate-400 font-bold uppercase">
                      Instant Stock Adjustment
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateScannedStock(scannedItem.stockLevel - 1)}
                        className="flex-1 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[10px] font-black uppercase font-mono cursor-pointer transition-colors"
                      >
                        - 1 Unit
                      </button>
                      <button
                        onClick={() => handleUpdateScannedStock(scannedItem.stockLevel + 1)}
                        className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase font-mono cursor-pointer transition-colors"
                      >
                        + 1 Unit
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty simulator state */}
              {!isScanning && !scannedItem && (
                <div className="py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center select-none">
                  <span className="text-[10px] text-slate-400 italic">No targeted SKU in active laser buffer.</span>
                </div>
              )}

            </div>
          </Card>
        </div>

      </div>

      {/* Add Item Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setIsAddOpen(false)} />
          
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl text-left space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono">
                Add Material Product Row
              </h3>
              <p className="text-xs text-slate-400 font-light mt-0.5">
                Define the asset catalogs and assign them to physical warehouse coordinates.
              </p>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  label="Product Name" 
                  placeholder="Premium Routing Router" 
                  value={newItem.name} 
                  onChange={(val) => setNewItem({ ...newItem, name: val })} 
                  required 
                />
                <Input 
                  label="SKU Identifier" 
                  placeholder="SRV-CLOUD-R" 
                  value={newItem.sku} 
                  onChange={(val) => setNewItem({ ...newItem, sku: val })} 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input 
                  label="Barcode (Optional)" 
                  placeholder="8901234567" 
                  value={newItem.barcode} 
                  onChange={(val) => setNewItem({ ...newItem, barcode: val })} 
                />
                <div className="text-xs flex flex-col justify-end">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Product Category</label>
                  <select 
                    value={newItem.category} 
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} 
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent outline-none text-slate-750 dark:text-slate-250 font-bold"
                  >
                    <option>Hardware</option>
                    <option>Software License</option>
                    <option>Hardware Security</option>
                    <option>Hardware Router</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-xs flex flex-col justify-end">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Warehouse Hub</label>
                  <select 
                    value={newItem.warehouseId} 
                    onChange={(e) => setNewItem({ ...newItem, warehouseId: e.target.value })} 
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent outline-none text-slate-750 dark:text-slate-250 font-bold"
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>

                <div className="text-xs flex flex-col justify-end">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Supplier Association</label>
                  <select 
                    value={newItem.supplierId} 
                    onChange={(e) => setNewItem({ ...newItem, supplierId: e.target.value })} 
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent outline-none text-slate-750 dark:text-slate-250 font-bold"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input 
                  label="Initial Stock Qty" 
                  type="number" 
                  placeholder="10" 
                  value={newItem.stockLevel.toString()} 
                  onChange={(val) => setNewItem({ ...newItem, stockLevel: Number(val) })} 
                />
                <Input 
                  label="Min Deficit Stock Qty" 
                  type="number" 
                  placeholder="5" 
                  value={newItem.minStockLevel.toString()} 
                  onChange={(val) => setNewItem({ ...newItem, minStockLevel: Number(val) })} 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input 
                  label="Unit Sell Price (INR)" 
                  type="number" 
                  placeholder="150000" 
                  value={newItem.unitPrice.toString()} 
                  onChange={(val) => setNewItem({ ...newItem, unitPrice: Number(val) })} 
                />
                <Input 
                  label="Unit Cost Price (INR)" 
                  type="number" 
                  placeholder="95000" 
                  value={newItem.costPrice.toString()} 
                  onChange={(val) => setNewItem({ ...newItem, costPrice: Number(val) })} 
                />
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <Button variant="outline" className="py-2 text-xs font-bold" type="button" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button variant="primary" className="py-2 text-xs font-bold" type="submit">Register Material</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
