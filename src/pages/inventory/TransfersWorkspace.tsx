/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { inventoryService, StockTransfer, InventoryItem } from '../../services/inventory.service';
import { warehouseService, Warehouse } from '../../services/warehouse.service';
import { Card, Button, Input } from '../../components/ui';
import { 
  ArrowLeftRight, 
  Plus, 
  Calendar, 
  Package, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Truck,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

export const TransfersWorkspace: React.FC = () => {
  const [transfers, setTransfers] = useState<StockTransfer[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Transfer form state
  const [newTransfer, setNewTransfer] = useState({
    itemId: '',
    sourceWarehouseId: '',
    destWarehouseId: '',
    quantity: 1,
    status: 'Pending' as StockTransfer['status']
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [trsf, inv, whs] = await Promise.all([
        inventoryService.getStockTransfers(),
        inventoryService.getInventoryItems(),
        warehouseService.getWarehouses()
      ]);
      setTransfers(trsf);
      setItems(inv);
      setWarehouses(whs);

      if (inv.length > 0 && whs.length > 1) {
        setNewTransfer(prev => ({
          ...prev,
          itemId: inv[0].id,
          sourceWarehouseId: whs[0].id,
          destWarehouseId: whs[1].id
        }));
      }
    } catch {
      toast.error('Failed to parse stock transfers history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTransfer.sourceWarehouseId === newTransfer.destWarehouseId) {
      toast.error('Source and Destination storage warehouses must be distinct.');
      return;
    }

    const matchedItem = items.find(i => i.id === newTransfer.itemId);
    if (!matchedItem) {
      toast.error('Invalid material product row selection.');
      return;
    }

    // Verify stock availability
    if (matchedItem.stockLevel < newTransfer.quantity) {
      toast.error(`Insufficient stock! Only ${matchedItem.stockLevel} units available in ${matchedItem.warehouseName}.`);
      return;
    }

    const srcWHName = warehouses.find(w => w.id === newTransfer.sourceWarehouseId)?.name || 'Source WH';
    const destWHName = warehouses.find(w => w.id === newTransfer.destWarehouseId)?.name || 'Destination WH';

    try {
      await inventoryService.createStockTransfer({
        itemId: newTransfer.itemId,
        itemName: matchedItem.name,
        sku: matchedItem.sku,
        sourceWarehouseId: newTransfer.sourceWarehouseId,
        sourceWarehouseName: srcWHName,
        destWarehouseId: newTransfer.destWarehouseId,
        destWarehouseName: destWHName,
        quantity: Number(newTransfer.quantity),
        status: newTransfer.status
      });

      toast.success('Successfully logged Stock Transfer request.');
      setIsAddOpen(false);
      loadData();
    } catch {
      toast.error('Failed to execute stock movement.');
    }
  };

  const handleUpdateStatus = async (id: string, nextStatus: StockTransfer['status']) => {
    try {
      await inventoryService.updateTransferStatus(id, nextStatus);
      toast.success(`Transfer status updated to ${nextStatus}.`);
      loadData();
    } catch {
      toast.error('Failed to adjust stock quantities.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-5 select-none">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-indigo-500" /> Stock Movements & Transfers
          </h1>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Relocate hardware assets across regional hubs, track transit stages, and audit ledger entries.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Move Materials
        </button>
      </div>

      {/* Transfers audit table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
        </div>
      ) : transfers.length > 0 ? (
        <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850/70 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-850 select-none text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider">
                  <th className="p-4">Transfer ID</th>
                  <th className="p-4">Material Details</th>
                  <th className="p-4">Route Info</th>
                  <th className="p-4 text-center">Relocation Qty</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Change State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                {transfers.map((trsf) => (
                  <tr key={trsf.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="p-4 font-mono font-black text-[10px] text-indigo-500">{trsf.id}</td>
                    <td className="p-4 text-left">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 dark:text-slate-100 block">{trsf.itemName}</span>
                        <span className="font-mono text-[9px] text-slate-400 font-bold uppercase">SKU: {trsf.sku}</span>
                      </div>
                    </td>
                    <td className="p-4 text-left">
                      <div className="flex items-center gap-2 select-none">
                        <div className="flex flex-col text-left">
                          <span className="text-[10px] text-slate-400 font-mono font-bold">SOURCE</span>
                          <span className="font-bold text-slate-700 dark:text-slate-350">{trsf.sourceWarehouseName}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-indigo-500 animate-pulse shrink-0" />
                        <div className="flex flex-col text-left">
                          <span className="text-[10px] text-slate-400 font-mono font-bold">DESTINATION</span>
                          <span className="font-bold text-slate-700 dark:text-slate-350">{trsf.destWarehouseName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center font-mono font-black text-slate-800 dark:text-slate-200">
                      {trsf.quantity} units
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border font-mono tracking-wider uppercase
                        ${trsf.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' : ''}
                        ${trsf.status === 'In Transit' ? 'bg-indigo-500/10 text-indigo-650 border-indigo-500/10' : ''}
                        ${trsf.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 border-amber-500/10' : ''}
                        ${trsf.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-600 border-rose-500/10' : ''}
                      `}>
                        {trsf.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                        {trsf.status === 'In Transit' && <Truck className="w-3 h-3" />}
                        {trsf.status === 'Pending' && <Clock className="w-3 h-3 text-amber-500" />}
                        {trsf.status === 'Cancelled' && <AlertCircle className="w-3 h-3" />}
                        {trsf.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {trsf.status === 'Pending' && (
                        <div className="flex justify-center gap-1 text-[10px]">
                          <button
                            onClick={() => handleUpdateStatus(trsf.id, 'In Transit')}
                            className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-650 font-black cursor-pointer uppercase font-mono"
                          >
                            In Transit
                          </button>
                        </div>
                      )}
                      {trsf.status === 'In Transit' && (
                        <div className="flex justify-center gap-1 text-[10px]">
                          <button
                            onClick={() => handleUpdateStatus(trsf.id, 'Completed')}
                            className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-black cursor-pointer uppercase font-mono"
                          >
                            Mark Arrived
                          </button>
                        </div>
                      )}
                      {trsf.status === 'Completed' && (
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase select-none">
                          Ledger Locked
                        </span>
                      )}
                      {trsf.status === 'Cancelled' && (
                        <span className="text-[10px] font-mono text-rose-500 font-bold uppercase select-none">
                          Voided
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-16 text-center bg-white border border-slate-200/50 rounded-2xl">
          <span className="text-xs text-slate-400">No stock relocations logged in transfer directories.</span>
        </div>
      )}

      {/* Add Transfer Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setIsAddOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl text-left space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono">
                Initiate Material Relocation
              </h3>
              <p className="text-xs text-slate-400 font-light mt-0.5">
                Execute hardware moving ledger records. Transfer levels automatically recalculate on arrival.
              </p>
            </div>

            <form onSubmit={handleCreateTransfer} className="space-y-4">
              
              {/* Product selector */}
              <div className="text-xs flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Target Material Item</label>
                <select 
                  value={newTransfer.itemId} 
                  onChange={(e) => setNewTransfer({ ...newTransfer, itemId: e.target.value })} 
                  className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent outline-none text-slate-750 dark:text-slate-250 font-bold"
                >
                  {items.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.sku} · Available: {i.stockLevel})
                    </option>
                  ))}
                </select>
              </div>

              {/* Source vs Dest */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Source WH</label>
                  <select 
                    value={newTransfer.sourceWarehouseId} 
                    onChange={(e) => setNewTransfer({ ...newTransfer, sourceWarehouseId: e.target.value })} 
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent outline-none font-bold"
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Destination WH</label>
                  <select 
                    value={newTransfer.destWarehouseId} 
                    onChange={(e) => setNewTransfer({ ...newTransfer, destWarehouseId: e.target.value })} 
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent outline-none font-bold"
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Qty and Status */}
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  label="Relocation Quantity" 
                  type="number" 
                  placeholder="2" 
                  value={newTransfer.quantity.toString()} 
                  onChange={(val) => setNewTransfer({ ...newTransfer, quantity: Number(val) })} 
                />

                <div className="text-xs flex flex-col justify-end">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Initial Status</label>
                  <select 
                    value={newTransfer.status} 
                    onChange={(e) => setNewTransfer({ ...newTransfer, status: e.target.value as any })} 
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent outline-none font-bold text-slate-750 dark:text-slate-250"
                  >
                    <option>Pending</option>
                    <option>In Transit</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <Button variant="outline" className="py-2 text-xs font-bold" type="button" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button variant="primary" className="py-2 text-xs font-bold" type="submit">Deploy Relocation</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
