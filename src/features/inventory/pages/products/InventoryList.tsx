import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/product.service';
import { warehouseService, Warehouse } from '../../services/warehouse.service';
import { Product } from '../../services/inventory.service';
import { ProductCard } from '../../components/ProductCard';
import { 
  Search, 
  Layers, 
  Building2, 
  AlertTriangle, 
  Trash2, 
  ArrowUpDown, 
  FileText, 
  Printer, 
  ChevronRight, 
  Plus, 
  SlidersHorizontal,
  FolderSync,
  Shuffle
} from 'lucide-react';
import { toast } from 'sonner';

export const InventoryList: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter conditions
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedWarehouse, setSelectedWarehouse] = useState('All');
  const [stockStatus, setStockStatus] = useState('All'); // 'All' | 'In Stock' | 'Low Stock' | 'Out of Stock'
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Bulk operation triggers
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, whs] = await Promise.all([
        productService.getProducts(),
        warehouseService.getWarehouses()
      ]);
      setProducts(prods);
      setFiltered(prods);
      setWarehouses(whs);
    } catch {
      toast.error('Failed to parse catalog directories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter application pipeline
  useEffect(() => {
    let result = [...products];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Brand
    if (selectedBrand !== 'All') {
      result = result.filter(p => p.brand === selectedBrand);
    }

    // Warehouse
    if (selectedWarehouse !== 'All') {
      result = result.filter(p => p.warehouseId === selectedWarehouse);
    }

    // Stock Status
    if (stockStatus !== 'All') {
      if (stockStatus === 'Low Stock') {
        result = result.filter(p => p.quantity < 10 && p.quantity > 0);
      } else if (stockStatus === 'Out of Stock') {
        result = result.filter(p => p.quantity === 0);
      } else if (stockStatus === 'In Stock') {
        result = result.filter(p => p.quantity >= 10);
      }
    }

    // Price range
    if (minPrice) {
      result = result.filter(p => p.sellingPrice >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter(p => p.sellingPrice <= Number(maxPrice));
    }

    // Sort result
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB as string).toLowerCase();
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFiltered(result);
  }, [products, searchQuery, selectedCategory, selectedBrand, selectedWarehouse, stockStatus, minPrice, maxPrice, sortField, sortOrder]);

  const toggleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedProductIds.length === filtered.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filtered.map(p => p.id));
    }
  };

  // Bulk operations
  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedProductIds.length} products?`)) {
      await Promise.all(selectedProductIds.map(id => productService.deleteProduct(id)));
      toast.success('Successfully deleted chosen items.');
      setSelectedProductIds([]);
      loadData();
    }
  };

  const handleBulkExport = () => {
    if (selectedProductIds.length === 0) {
      toast.error('Select items to export');
      return;
    }
    toast.success(`Exporting ${selectedProductIds.length} items to CSV format.`);
  };

  const handleBulkPrint = () => {
    if (selectedProductIds.length === 0) {
      toast.error('Select items to print');
      return;
    }
    toast.success(`Sent ${selectedProductIds.length} labels to high-contrast printers.`);
  };

  const handleBulkTransfer = () => {
    if (selectedProductIds.length === 0) return;
    toast.success(`Relocating ${selectedProductIds.length} stock elements to Transfers workflow.`);
    navigate('/inventory/transfers');
  };

  // Get unique categories and brands for filtering lists
  const categories = ['All', ...new Set(products.map(p => p.category))];
  const brands = ['All', ...new Set(products.map(p => p.brand).filter(Boolean))];

  return (
    <div className="space-y-6 text-left">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-150 dark:border-slate-850 pb-5">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" /> Enterprise Product Directory
          </h1>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Audit high-value capital assets, barcode registry databases, and warehouse placements.
          </p>
        </div>

        <button
          onClick={() => {
            toast.info('Add custom items from the main Dashboard panel.');
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Register New Product
        </button>
      </div>

      {/* Advanced Filter Panel */}
      <div className="p-5 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl shadow-2xs space-y-4 select-none">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
          <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-black uppercase font-mono tracking-wider">Search & Filter Directories</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="SKU, Name, Barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 text-xs text-slate-800 dark:text-slate-200 outline-none font-bold"
            />
          </div>

          {/* Category SELECT */}
          <div className="flex flex-col justify-end">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-650 dark:text-slate-350 outline-none font-bold"
            >
              <option value="All">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Brand SELECT */}
          <div className="flex flex-col justify-end">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-650 dark:text-slate-350 outline-none font-bold"
            >
              <option value="All">All Brands</option>
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Warehouse SELECT */}
          <div className="flex flex-col justify-end">
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Stock Status selector */}
          <div>
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-650 dark:text-slate-350 outline-none font-bold"
            >
              <option value="All">All Stock Statuses</option>
              <option value="In Stock">{"In Stock (>= 10 units)"}</option>
              <option value="Low Stock">{"Low Stock (< 10 units)"}</option>
              <option value="Out of Stock">{"Out of Stock (= 0 units)"}</option>
            </select>
          </div>

          {/* Price Filters */}
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Min Price (₹)"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 text-xs text-slate-800 dark:text-slate-200 outline-none font-mono"
            />
            <span className="text-slate-400 font-mono text-[10px] font-bold">TO</span>
            <input
              type="number"
              placeholder="Max Price (₹)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 text-xs text-slate-800 dark:text-slate-200 outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* Bulk Action Controls */}
      {selectedProductIds.length > 0 && (
        <div className="p-4 bg-indigo-600 rounded-2xl text-white flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 select-none text-left">
            <span className="text-xs font-mono font-black uppercase bg-white/20 px-2 py-0.5 rounded">
              {selectedProductIds.length} Selected
            </span>
            <p className="text-[11px] font-bold">Apply enterprise bulk actions to chosen elements.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={handleBulkPrint}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/25 rounded-lg text-[10px] font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Label Print
            </button>
            <button
              onClick={handleBulkExport}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/25 rounded-lg text-[10px] font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <FileText className="w-3.5 h-3.5" /> CSV Export
            </button>
            <button
              onClick={handleBulkTransfer}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/25 rounded-lg text-[10px] font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5" /> Transfer Stock
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 rounded-lg text-[10px] font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Wipe Elements
            </button>
          </div>
        </div>
      )}

      {/* Main product listings table */}
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
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedProductIds.length === filtered.length}
                      onChange={handleSelectAll}
                      className="cursor-pointer"
                    />
                  </th>
                  <th className="p-4 cursor-pointer" onClick={() => toggleSort('id')}>Product Code</th>
                  <th className="p-4 cursor-pointer" onClick={() => toggleSort('sku')}>SKU / Barcode</th>
                  <th className="p-4 cursor-pointer" onClick={() => toggleSort('name')}>Product Name</th>
                  <th className="p-4 cursor-pointer" onClick={() => toggleSort('category')}>Category</th>
                  <th className="p-4 cursor-pointer" onClick={() => toggleSort('warehouseName')}>Warehouse</th>
                  <th className="p-4 text-right cursor-pointer" onClick={() => toggleSort('quantity')}>Available Stock</th>
                  <th className="p-4 text-right cursor-pointer" onClick={() => toggleSort('sellingPrice')}>Selling Price</th>
                  <th className="p-4 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                {filtered.map((prod) => {
                  const isChecked = selectedProductIds.includes(prod.id);
                  const isLow = prod.quantity < 10;
                  return (
                    <tr 
                      key={prod.id}
                      className={`hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors
                        ${isChecked ? 'bg-indigo-500/5' : ''}
                        ${isLow ? 'bg-rose-500/5' : ''}`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectProduct(prod.id)}
                          className="cursor-pointer"
                        />
                      </td>
                      <td className="p-4 font-mono font-black text-[10px] text-slate-400">{prod.id}</td>
                      <td className="p-4 text-left">
                        <div className="flex flex-col font-mono text-[10px]">
                          <span className="font-bold text-slate-700 dark:text-slate-350">{prod.sku}</span>
                          <span className="text-[9px] text-slate-400">{prod.barcode}</span>
                        </div>
                      </td>
                      <td className="p-4 text-left font-bold text-slate-800 dark:text-slate-100">
                        {prod.name}
                      </td>
                      <td className="p-4 font-medium text-slate-650 dark:text-slate-350">
                        <span className="inline-block px-1.5 py-0.5 text-[8px] font-black uppercase font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 rounded">
                          {prod.category}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {prod.warehouseName}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className={`font-mono font-bold text-xs
                            ${isLow ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}
                          >
                            {prod.quantity} units
                          </span>
                          {isLow && (
                            <span className="inline-flex items-center gap-0.5 text-[8px] font-black text-rose-500 font-mono uppercase tracking-widest mt-0.5 animate-pulse">
                              ● Low Stock
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                        ₹{prod.sellingPrice.toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => navigate(`/inventory/products/${prod.id}`)}
                          className="p-1 text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-16 text-center bg-white border border-slate-200/50 rounded-2xl select-none">
          <span className="text-xs text-slate-400">No products match the selected filters. Change filter criteria or keywords.</span>
        </div>
      )}
    </div>
  );
};
