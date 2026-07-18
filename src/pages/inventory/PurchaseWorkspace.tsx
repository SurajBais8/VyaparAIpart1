/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { purchaseService, PurchaseOrder, PurchaseOrderItem } from '../../services/purchase.service';
import { supplierService, Supplier } from '../../services/supplier.service';
import { inventoryService, InventoryItem } from '../../services/inventory.service';
import { Card, Button, Input } from '../../components/ui';
import { 
  FileText, 
  Plus, 
  Calendar, 
  User, 
  Coins, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  FileCheck,
  TrendingUp,
  CreditCard,
  Trash2,
  ListPlus
} from 'lucide-react';
import { toast } from 'sonner';

export const PurchaseWorkspace: React.FC = () => {
  const [pos, setPOs] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [notes, setNotes] = useState('');
  const [taxRate, setTaxRate] = useState(18);
  const [shippingCost, setShippingCost] = useState(5000);
  const [formItems, setFormItems] = useState<{ itemId: string; quantity: number; costPrice: number }[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pOrders, sups, invItems] = await Promise.all([
        purchaseService.getPurchaseOrders(),
        supplierService.getSuppliers(),
        inventoryService.getInventoryItems()
      ]);
      setPOs(pOrders);
      setSuppliers(sups);
      setItems(invItems);

      if (sups.length > 0) {
        setSelectedSupplierId(sups[0].id);
      }
      if (invItems.length > 0) {
        setFormItems([{ itemId: invItems[0].id, quantity: 1, costPrice: invItems[0].costPrice }]);
      }
    } catch {
      toast.error('Failed to parse purchase directories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddFormItem = () => {
    if (items.length > 0) {
      setFormItems([...formItems, { itemId: items[0].id, quantity: 1, costPrice: items[0].costPrice }]);
    }
  };

  const handleRemoveFormItem = (idx: number) => {
    setFormItems(formItems.filter((_, i) => i !== idx));
  };

  const handleFormItemChange = (idx: number, field: string, val: any) => {
    const updated = [...formItems];
    if (field === 'itemId') {
      const matched = items.find(i => i.id === val);
      updated[idx] = { 
        itemId: val, 
        quantity: updated[idx].quantity, 
        costPrice: matched ? matched.costPrice : 1000 
      };
    } else {
      updated[idx] = { ...updated[idx], [field]: val };
    }
    setFormItems(updated);
  };

  const handleCreatePO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formItems.length === 0) {
      toast.error('At least one catalog item is required to issue a Purchase Order.');
      return;
    }

    const matchedSupplier = suppliers.find(s => s.id === selectedSupplierId);
    if (!matchedSupplier) {
      toast.error('Invalid vendor supplier selected.');
      return;
    }

    // Build PO items
    const poItems: PurchaseOrderItem[] = formItems.map((formItem) => {
      const matched = items.find(i => i.id === formItem.itemId);
      return {
        itemId: formItem.itemId,
        name: matched ? matched.name : 'Unknown Product',
        sku: matched ? matched.sku : 'SKU-UNK',
        quantity: Number(formItem.quantity),
        costPrice: Number(formItem.costPrice)
      };
    });

    try {
      await purchaseService.createPurchaseOrder({
        supplierId: selectedSupplierId,
        supplierName: matchedSupplier.name,
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days out
        items: poItems,
        taxRate: Number(taxRate),
        shippingCost: Number(shippingCost),
        status: 'Draft',
        paymentStatus: 'Unpaid',
        notes
      });

      toast.success('Successfully issued draft Purchase Order.');
      setIsAddOpen(false);
      setNotes('');
      setTaxRate(18);
      setShippingCost(5000);
      if (items.length > 0) {
        setFormItems([{ itemId: items[0].id, quantity: 1, costPrice: items[0].costPrice }]);
      }
      loadData();
    } catch {
      toast.error('Failed to issue PO.');
    }
  };

  const handleUpdateStatus = async (id: string, nextStatus: PurchaseOrder['status']) => {
    try {
      await purchaseService.updatePurchaseOrderStatus(id, nextStatus);
      toast.success(`PO status progressed to ${nextStatus}.`);
      loadData();
    } catch {
      toast.error('Failed to adjust PO status.');
    }
  };

  const handleUpdatePayment = async (id: string, nextPayment: PurchaseOrder['paymentStatus']) => {
    try {
      await purchaseService.updatePurchaseOrderPayment(id, nextPayment);
      toast.success(`Payment status marked as ${nextPayment}.`);
      loadData();
    } catch {
      toast.error('Failed to adjust payment values.');
    }
  };

  const handleDeletePO = async (id: string, num: string) => {
    if (confirm(`Revoke and cancel purchase order "${num}" permanently?`)) {
      await purchaseService.deletePurchaseOrder(id);
      toast.success('Purchase order deleted.');
      loadData();
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-5 select-none">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" /> Procurement & Purchase Orders
          </h1>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Issue procurement catalogs, verify taxes and freight bills, and authorize vendor balance transfers.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Issue Purchase Order
        </button>
      </div>

      {/* Purchase orders board */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
        </div>
      ) : pos.length > 0 ? (
        <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850/70 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-850 select-none text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider">
                  <th className="p-4">PO Code</th>
                  <th className="p-4">Supplier / Vendor</th>
                  <th className="p-4">Items Summary</th>
                  <th className="p-4 text-right">Aggregate Cost</th>
                  <th className="p-4">SLA Stages</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4 text-center">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                {pos.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col text-left">
                        <span className="font-mono font-black text-[11px] text-slate-800 dark:text-slate-100">{po.orderNumber}</span>
                        <span className="text-[9px] text-slate-450 font-mono mt-0.5">ID: {po.id}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col text-left font-sans">
                        <span className="font-bold text-slate-700 dark:text-slate-350">{po.supplierName}</span>
                        <span className="text-[9px] text-slate-400 font-mono">Issued: {po.orderDate}</span>
                      </div>
                    </td>
                    <td className="p-4 text-left">
                      <div className="max-w-[220px] truncate space-y-1">
                        {po.items.map((it, idx) => (
                          <div key={idx} className="text-[10px] text-slate-500 dark:text-slate-400 font-mono leading-relaxed truncate">
                            ● {it.name} <strong className="font-bold">x{it.quantity}</strong>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                      ₹{po.totalCost.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border font-mono tracking-wider uppercase
                        ${po.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' : ''}
                        ${po.status === 'Approved' ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/10' : ''}
                        ${po.status === 'Pending Approval' ? 'bg-amber-500/10 text-amber-600 border-amber-500/10' : ''}
                        ${po.status === 'Draft' ? 'bg-slate-500/10 text-slate-400 border-slate-500/10' : ''}
                        ${po.status === 'Shipped' ? 'bg-sky-500/10 text-sky-600 border-sky-500/10' : ''}
                        ${po.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-600 border-rose-500/10' : ''}
                      `}>
                        {po.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border font-mono
                        ${po.paymentStatus === 'Paid' ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/10' : ''}
                        ${po.paymentStatus === 'Partially Paid' ? 'bg-amber-500/5 text-amber-600 border-amber-500/10' : ''}
                        ${po.paymentStatus === 'Unpaid' ? 'bg-rose-500/5 text-rose-600 border-rose-500/10' : ''}
                      `}>
                        {po.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center items-center gap-1.5 text-[10px] font-mono font-black uppercase">
                        {po.status === 'Draft' && (
                          <button
                            onClick={() => handleUpdateStatus(po.id, 'Pending Approval')}
                            className="px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-650 cursor-pointer"
                          >
                            Submit
                          </button>
                        )}
                        {po.status === 'Pending Approval' && (
                          <button
                            onClick={() => handleUpdateStatus(po.id, 'Approved')}
                            className="px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        {po.status === 'Approved' && (
                          <button
                            onClick={() => handleUpdateStatus(po.id, 'Shipped')}
                            className="px-2 py-1 rounded bg-sky-500 hover:bg-sky-650 text-white cursor-pointer"
                          >
                            Ship
                          </button>
                        )}
                        {po.status === 'Shipped' && (
                          <button
                            onClick={() => handleUpdateStatus(po.id, 'Delivered')}
                            className="px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                          >
                            Arrived
                          </button>
                        )}

                        {po.paymentStatus !== 'Paid' && po.status === 'Delivered' && (
                          <button
                            onClick={() => handleUpdatePayment(po.id, 'Paid')}
                            className="px-2 py-1 rounded border border-emerald-500/10 text-emerald-500 hover:bg-emerald-50 cursor-pointer"
                            title="Mark balance cleared"
                          >
                            Clear Pay
                          </button>
                        )}

                        <button
                          onClick={() => handleDeletePO(po.id, po.orderNumber)}
                          className="p-1 rounded text-slate-400 hover:text-rose-500 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-16 text-center bg-white border border-slate-200/50 rounded-2xl">
          <span className="text-xs text-slate-400">No purchase records found in procurement databases.</span>
        </div>
      )}

      {/* Add PO Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setIsAddOpen(false)} />
          
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl text-left space-y-4 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono">
                Issue Purchase Order
              </h3>
              <p className="text-xs text-slate-400 font-light mt-0.5">
                Compile material requests from internal stock departments. Tax and shipping automatically apply.
              </p>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-4">
              
              {/* Supplier Dropdown */}
              <div className="text-xs flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Target Vendor Supplier</label>
                <select 
                  value={selectedSupplierId} 
                  onChange={(e) => setSelectedSupplierId(e.target.value)} 
                  className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent outline-none text-slate-750 dark:text-slate-250 font-bold"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                  ))}
                </select>
              </div>

              {/* Items checklist */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center select-none">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Included Products</span>
                  <button 
                    type="button" 
                    onClick={handleAddFormItem}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase font-mono flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <ListPlus className="w-3.5 h-3.5" /> Append Row
                  </button>
                </div>

                <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                  {formItems.map((formItem, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <select
                        value={formItem.itemId}
                        onChange={(e) => handleFormItemChange(idx, 'itemId', e.target.value)}
                        className="flex-grow p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-transparent text-[11px] font-medium"
                      >
                        {items.map(i => (
                          <option key={i.id} value={i.id}>{i.name}</option>
                        ))}
                      </select>

                      <input
                        type="number"
                        placeholder="Qty"
                        value={formItem.quantity.toString()}
                        onChange={(e) => handleFormItemChange(idx, 'quantity', Number(e.target.value))}
                        className="w-16 p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] text-center font-mono font-bold"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveFormItem(idx)}
                        className="p-1.5 rounded text-rose-500 hover:bg-rose-50 border border-slate-100 hover:border-rose-500/20 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping & Taxes */}
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  label="GST Tax Rate %" 
                  type="number" 
                  placeholder="18" 
                  value={taxRate.toString()} 
                  onChange={(val) => setTaxRate(Number(val))} 
                />
                <Input 
                  label="Freight Shipping Fee (INR)" 
                  type="number" 
                  placeholder="5000" 
                  value={shippingCost.toString()} 
                  onChange={(val) => setShippingCost(Number(val))} 
                />
              </div>

              <Input 
                label="Procurement Directives / Notes" 
                placeholder="Include SLA contract deliverables..." 
                value={notes} 
                onChange={(val) => setNotes(val)} 
              />

              <div className="flex gap-3 justify-end pt-3">
                <Button variant="outline" className="py-2 text-xs font-bold" type="button" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button variant="primary" className="py-2 text-xs font-bold" type="submit">Draft Order</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
