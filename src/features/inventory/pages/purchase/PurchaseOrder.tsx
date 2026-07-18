import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { purchaseService, PurchaseOrder as PO } from '../../services/purchase.service';
import { supplierService, Supplier } from '../../services/supplier.service';
import { warehouseService, Warehouse } from '../../services/warehouse.service';
import { productService } from '../../services/product.service';
import { Product } from '../../services/inventory.service';
import { 
  FileText, 
  Plus, 
  Search, 
  Printer, 
  Download, 
  ChevronRight, 
  CheckCircle, 
  XCircle,
  Truck,
  Building2,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

export const PurchaseOrder: React.FC = () => {
  const navigate = useNavigate();
  const [pos, setPOs] = useState<PO[]>([]);
  const [filtered, setFiltered] = useState<PO[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Form Modal for creating a new PO
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newPO, setNewPO] = useState({
    supplierId: '',
    warehouseId: '',
    productId: '',
    quantity: 5,
    unitPrice: 120000,
    expectedDate: '2026-07-28'
  });

  const loadPOs = async () => {
    setLoading(true);
    try {
      const [allPOs, sups, whs, prods] = await Promise.all([
        purchaseService.getPurchaseOrders(),
        supplierService.getSuppliers(),
        warehouseService.getWarehouses(),
        productService.getProducts()
      ]);
      setPOs(allPOs);
      setFiltered(allPOs);
      setSuppliers(sups);
      setWarehouses(whs);
      setProducts(prods);

      if (sups.length > 0 && whs.length > 0 && prods.length > 0) {
        setNewPO(prev => ({
          ...prev,
          supplierId: sups[0].id,
          warehouseId: whs[0].id,
          productId: prods[0].id
        }));
      }
    } catch {
      toast.error('Failed to parse purchase records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPOs();
  }, []);

  // Filter application
  useEffect(() => {
    let result = [...pos];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        po => po.id.toLowerCase().includes(q) ||
        po.supplierName.toLowerCase().includes(q) ||
        po.warehouseName.toLowerCase().includes(q)
      );
    }

    if (selectedStatus !== 'All') {
      result = result.filter(po => po.status === selectedStatus);
    }

    setFiltered(result);
  }, [pos, searchQuery, selectedStatus]);

  const handleCreatePO = async (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === newPO.supplierId);
    const wh = warehouses.find(w => w.id === newPO.warehouseId);
    const prod = products.find(p => p.id === newPO.productId);

    if (!sup || !wh || !prod) {
      toast.error('All associations are required.');
      return;
    }

    const totalVal = newPO.quantity * newPO.unitPrice;

    try {
      await purchaseService.createPurchaseOrder({
        supplierId: sup.id,
        supplierName: sup.name,
        warehouseId: wh.id,
        warehouseName: wh.name,
        products: [
          {
            productId: prod.id,
            name: prod.name,
            quantity: Number(newPO.quantity),
            unitPrice: Number(newPO.unitPrice),
            total: totalVal
          }
        ],
        quantity: Number(newPO.quantity),
        amount: totalVal,
        expectedDate: newPO.expectedDate,
        status: 'Pending Approval',
        documents: ['PO_Draft_Unassigned.pdf']
      });

      toast.success('Purchase order created in Pending state.');
      setIsAddOpen(false);
      loadPOs();
    } catch {
      toast.error('Failed to register draft PO.');
    }
  };

  const handleReceiveGoods = async (id: string) => {
    try {
      const poObj = pos.find(p => p.id === id);
      if (!poObj) return;

      if (poObj.status === 'Received') {
        toast.info('This order is already flagged as received.');
        return;
      }

      await purchaseService.updatePOStatus(id, 'Received');
      toast.success(`Marked order "${id}" as Received. Storage stock limits adjusted.`);
      loadPOs();
    } catch {
      toast.error('Failed to receive goods.');
    }
  };

  const handleCancelPO = async (id: string) => {
    if (confirm(`Cancel purchase order "${id}"?`)) {
      await purchaseService.updatePOStatus(id, 'Cancelled');
      toast.success(`Purchase order ${id} is cancelled.`);
      loadPOs();
    }
  };

  const handlePrintPO = (id: string) => {
    toast.success(`PO Draft PDF generated for "${id}". Sending to labels spool...`);
  };

  const handleExportPOs = () => {
    toast.success('Exporting PO register as high-integrity Excel sheets.');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-150 pb-5">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500 animate-pulse" /> Sourcing Purchase Orders (PO)
          </h1>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Procurement sheets, digital stamps, expectations, and goods receiving gates.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportPOs}
            className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export Sheets
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Issue Draft PO
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 border rounded-2xl">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, supplier, or warehouse name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs outline-none font-bold"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full p-2 text-xs rounded-xl border border-slate-200 text-slate-650 outline-none font-bold"
        >
          <option value="All">All Order States</option>
          <option value="Pending Approval">Pending Approval</option>
          <option value="Approved">Approved</option>
          <option value="Received">Received</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* PO Register Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-white border rounded-2xl overflow-hidden shadow-2xs select-none">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b select-none text-[10px] font-black text-slate-400 uppercase font-mono tracking-wider">
                  <th className="p-4">PO Number</th>
                  <th className="p-4">Supplier Partner</th>
                  <th className="p-4">Storage Coordination</th>
                  <th className="p-4">Products</th>
                  <th className="p-4 text-center">Quantity</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4">Expected Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-4 font-mono font-black text-[11px] text-indigo-600">{po.id}</td>
                    <td className="p-4 font-bold text-slate-800">{po.supplierName}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-600">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {po.warehouseName}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 max-w-44 truncate">
                      {po.products.map(p => `${p.quantity}x ${p.name}`).join(', ')}
                    </td>
                    <td className="p-4 text-center font-mono font-semibold">{po.quantity}</td>
                    <td className="p-4 text-right font-mono font-bold text-slate-700">
                      ₹{po.amount.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 font-mono text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {po.expectedDate}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border font-mono uppercase tracking-wider
                        ${po.status === 'Received' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' : ''}
                        ${po.status === 'Approved' ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/10' : ''}
                        ${po.status === 'Pending Approval' ? 'bg-amber-500/10 text-amber-600 border-amber-500/10' : ''}
                        ${po.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-600 border-rose-500/10' : ''}
                      `}>
                        {po.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-2">
                        {po.status === 'Approved' && (
                          <button
                            onClick={() => handleReceiveGoods(po.id)}
                            className="px-2 py-1 bg-emerald-500 text-white rounded text-[9px] font-mono font-black uppercase cursor-pointer hover:bg-emerald-600"
                            title="Acknowledge goods receipt"
                          >
                            Receive
                          </button>
                        )}
                        {po.status === 'Pending Approval' && (
                          <button
                            onClick={() => handleCancelPO(po.id)}
                            className="px-2 py-1 bg-rose-50 text-rose-600 border border-rose-200/40 rounded text-[9px] font-mono font-black uppercase cursor-pointer hover:bg-rose-100"
                            title="Cancel Order"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => handlePrintPO(po.id)}
                          className="p-1 border hover:bg-slate-50 rounded cursor-pointer"
                          title="Print labels"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
                        </button>
                        <button
                          onClick={() => navigate(`/inventory/purchase/${po.id}`)}
                          className="p-1 border hover:bg-slate-50 rounded text-indigo-600 cursor-pointer"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
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
        <div className="p-16 text-center bg-white border rounded-2xl select-none">
          <span className="text-xs text-slate-400">No purchase order documents tracked. Adjust filters.</span>
        </div>
      )}

      {/* Draft PO issuing modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setIsAddOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white border rounded-2xl p-6 shadow-2xl text-left space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">
                Draft Purchase Order
              </h3>
              <p className="text-xs text-slate-400 font-light mt-0.5">
                Commit materials to preferred vendors and assign delivery coordinates.
              </p>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-4">
              <div className="text-xs flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Select Supplier</label>
                <select
                  value={newPO.supplierId}
                  onChange={(e) => setNewPO({ ...newPO, supplierId: e.target.value })}
                  className="w-full p-2 border rounded-xl outline-none font-bold bg-transparent text-slate-750"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="text-xs flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Target Storage Warehouse</label>
                <select
                  value={newPO.warehouseId}
                  onChange={(e) => setNewPO({ ...newPO, warehouseId: e.target.value })}
                  className="w-full p-2 border rounded-xl outline-none font-bold bg-transparent text-slate-750"
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div className="text-xs flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Select Material SKU</label>
                <select
                  value={newPO.productId}
                  onChange={(e) => setNewPO({ ...newPO, productId: e.target.value })}
                  className="w-full p-2 border rounded-xl outline-none font-bold bg-transparent text-slate-750"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Order Quantity</label>
                  <input
                    type="number"
                    value={newPO.quantity}
                    onChange={(e) => setNewPO({ ...newPO, quantity: Number(e.target.value) })}
                    className="w-full p-2 border rounded-xl outline-none font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Unit Contract Price</label>
                  <input
                    type="number"
                    value={newPO.unitPrice}
                    onChange={(e) => setNewPO({ ...newPO, unitPrice: Number(e.target.value) })}
                    className="w-full p-2 border rounded-xl outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div className="text-xs flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Expected Delivery Date</label>
                <input
                  type="date"
                  value={newPO.expectedDate}
                  onChange={(e) => setNewPO({ ...newPO, expectedDate: e.target.value })}
                  className="w-full p-2 border rounded-xl outline-none font-mono"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 border rounded-xl text-xs font-bold font-mono">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold font-mono">Create PO</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
