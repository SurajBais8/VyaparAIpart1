import React, { useEffect, useState } from 'react';
import { stockTransferService, StockTransfer as ST } from '../../services/stockTransfer.service';
import { warehouseService, Warehouse } from '../../services/warehouse.service';
import { productService } from '../../services/product.service';
import { Product } from '../../services/inventory.service';
import { 
  Shuffle, 
  Plus, 
  Search, 
  Printer, 
  Download, 
  ChevronRight, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  Truck 
} from 'lucide-react';
import { toast } from 'sonner';

export const StockTransfer: React.FC = () => {
  const [transfers, setTransfers] = useState<ST[]>([]);
  const [filtered, setFiltered] = useState<ST[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // New transfer form triggers
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newST, setNewST] = useState({
    sourceWarehouseId: '',
    destWarehouseId: '',
    productId: '',
    quantity: 1
  });

  const loadTransfers = async () => {
    setLoading(true);
    try {
      const [allSTs, whs, prods] = await Promise.all([
        stockTransferService.getTransfers(),
        warehouseService.getWarehouses(),
        productService.getProducts()
      ]);
      setTransfers(allSTs);
      setFiltered(allSTs);
      setWarehouses(whs);
      setProducts(prods);

      if (whs.length > 1 && prods.length > 0) {
        setNewST({
          sourceWarehouseId: whs[0].id,
          destWarehouseId: whs[1].id,
          productId: prods[0].id,
          quantity: 1
        });
      }
    } catch {
      toast.error('Failed to parse stock transfer lists.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransfers();
  }, []);

  // Filter pipeline
  useEffect(() => {
    let result = [...transfers];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        st => st.id.toLowerCase().includes(q) ||
        st.sku.toLowerCase().includes(q) ||
        st.sourceWarehouseName.toLowerCase().includes(q) ||
        st.destWarehouseName.toLowerCase().includes(q)
      );
    }

    if (selectedStatus !== 'All') {
      result = result.filter(st => st.status === selectedStatus);
    }

    setFiltered(result);
  }, [transfers, searchQuery, selectedStatus]);

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newST.sourceWarehouseId === newST.destWarehouseId) {
      toast.error('Source and destination storage hubs must be distinct.');
      return;
    }

    const sourceWh = warehouses.find(w => w.id === newST.sourceWarehouseId);
    const destWh = warehouses.find(w => w.id === newST.destWarehouseId);
    const prod = products.find(p => p.id === newST.productId);

    if (!sourceWh || !destWh || !prod) {
      toast.error('Associations missing.');
      return;
    }

    try {
      await stockTransferService.createTransfer({
        sourceWarehouseId: sourceWh.id,
        sourceWarehouseName: sourceWh.name,
        destWarehouseId: destWh.id,
        destWarehouseName: destWh.name,
        itemId: prod.id,
        itemName: prod.name,
        sku: prod.sku,
        quantity: Number(newST.quantity),
        status: 'Requested'
      });

      toast.success('Stock transfer registered successfully.');
      setIsAddOpen(false);
      loadTransfers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to request stock transfer.');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'Shipped' | 'Received' | 'Rejected') => {
    try {
      await stockTransferService.updateTransferStatus(id, newStatus);
      toast.success(`Transfer "${id}" transitioned to state ${newStatus}.`);
      loadTransfers();
    } catch (err: any) {
      toast.error(err.message || 'State transition failed.');
    }
  };

  const handlePrintWaybill = (id: string) => {
    toast.success(`Waybill manifest generated for ${id}. Sending to label printing pool...`);
  };

  const handleExportManifests = () => {
    toast.success('Exporting transfer logs to PDF spreadsheets.');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-150 pb-5">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <Shuffle className="w-5 h-5 text-indigo-500" /> Depot Stock Relocations
          </h1>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Inter-warehouse transport slips, freight handshakes, ways and status triggers.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportManifests}
            className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export Sheets
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Relocate Stock
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 border rounded-2xl select-none">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, SKU, source, or target..."
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
          <option value="All">All Status Slips</option>
          <option value="Requested">Requested</option>
          <option value="Shipped">Shipped</option>
          <option value="Received">Received</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Transfer Grid Table */}
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
                  <th className="p-4">Transfer ID</th>
                  <th className="p-4">SKU / Item</th>
                  <th className="p-4">Dispatch Route</th>
                  <th className="p-4 text-center">Quantity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Requested Date</th>
                  <th className="p-4 text-center">Transit Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((tr) => (
                  <tr key={tr.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-4 font-mono font-black text-[11px] text-indigo-600">{tr.id}</td>
                    <td className="p-4">
                      <div className="flex flex-col font-mono text-[10px]">
                        <span className="font-bold text-slate-700">{tr.sku}</span>
                        <span className="text-[8px] text-slate-400">ID: {tr.itemId}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-750 font-bold">{tr.sourceWarehouseName}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-indigo-650 font-bold">{tr.destWarehouseName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center font-mono font-bold text-slate-800">{tr.quantity} units</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border font-mono uppercase tracking-wider
                        ${tr.status === 'Received' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' : ''}
                        ${tr.status === 'Shipped' ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/10' : ''}
                        ${tr.status === 'Requested' ? 'bg-amber-500/10 text-amber-600 border-amber-500/10' : ''}
                        ${tr.status === 'Rejected' ? 'bg-rose-500/10 text-rose-600 border-rose-500/10' : ''}
                      `}>
                        {tr.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-500">{tr.date}</td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-2">
                        {tr.status === 'Requested' && (
                          <button
                            onClick={() => handleUpdateStatus(tr.id, 'Shipped')}
                            className="px-2 py-1 bg-indigo-600 text-white rounded text-[9px] font-mono font-black uppercase cursor-pointer hover:bg-indigo-700 flex items-center gap-0.5"
                          >
                            <Truck className="w-3 h-3" /> Ship
                          </button>
                        )}
                        {tr.status === 'Shipped' && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleUpdateStatus(tr.id, 'Received')}
                              className="px-2 py-1 bg-emerald-500 text-white rounded text-[9px] font-mono font-black uppercase cursor-pointer hover:bg-emerald-600 flex items-center gap-0.5"
                            >
                              <CheckCircle className="w-3 h-3" /> Recv
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(tr.id, 'Rejected')}
                              className="px-2 py-1 bg-rose-500 text-white rounded text-[9px] font-mono font-black uppercase cursor-pointer hover:bg-rose-600 flex items-center gap-0.5"
                            >
                              <XCircle className="w-3 h-3" /> Rej
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => handlePrintWaybill(tr.id)}
                          className="p-1 border hover:bg-slate-50 rounded cursor-pointer"
                          title="Print label waybill"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-400 hover:text-slate-650" />
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
          <span className="text-xs text-slate-400">No active stock transfers recorded. Adjust filters.</span>
        </div>
      )}

      {/* Add Stock Transfer modal dialog */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setIsAddOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white border rounded-2xl p-6 shadow-2xl text-left space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">
                Initiate Depot Relocation
              </h3>
              <p className="text-xs text-slate-400 font-light mt-0.5">
                Balance supply targets across physical storage coordinates securely.
              </p>
            </div>

            <form onSubmit={handleCreateTransfer} className="space-y-4">
              <div className="text-xs flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Source Warehouse</label>
                <select
                  value={newST.sourceWarehouseId}
                  onChange={(e) => setNewST({ ...newST, sourceWarehouseId: e.target.value })}
                  className="w-full p-2 border rounded-xl outline-none font-bold bg-transparent text-slate-750"
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div className="text-xs flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Destination Warehouse</label>
                <select
                  value={newST.destWarehouseId}
                  onChange={(e) => setNewST({ ...newST, destWarehouseId: e.target.value })}
                  className="w-full p-2 border rounded-xl outline-none font-bold bg-transparent text-slate-750"
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div className="text-xs flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Select Product SKU</label>
                <select
                  value={newST.productId}
                  onChange={(e) => setNewST({ ...newST, productId: e.target.value })}
                  className="w-full p-2 border rounded-xl outline-none font-bold bg-transparent text-slate-750"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
                  ))}
                </select>
              </div>

              <div className="text-xs flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Relocation Quantity</label>
                <input
                  type="number"
                  value={newST.quantity}
                  onChange={(e) => setNewST({ ...newST, quantity: Number(e.target.value) })}
                  className="w-full p-2 border rounded-xl outline-none font-mono"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 border rounded-xl text-xs font-bold font-mono">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold font-mono">Relocate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
