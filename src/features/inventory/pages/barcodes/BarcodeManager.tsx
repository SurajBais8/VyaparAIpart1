import React, { useEffect, useState } from 'react';
import { productService } from '../../services/product.service';
import { Product } from '../../services/inventory.service';
import { BarcodePreview } from '../../components/BarcodePreview';
import { 
  Barcode as BarcodeIcon, 
  Printer, 
  Download, 
  Search, 
  Sparkles, 
  Camera, 
  Keyboard, 
  RefreshCw 
} from 'lucide-react';
import { toast } from 'sonner';

export const BarcodeManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // SKU-to-Barcode Converter state
  const [customSKU, setCustomSKU] = useState('TRANSIT-MUM-902');
  const [customBarcode, setCustomBarcode] = useState('8901234567890');

  // Scanner Simulation State
  const [scannedResult, setScannedResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // Bulk print checklist
  const [bulkList, setBulkList] = useState<string[]>([]);

  const loadData = async () => {
    try {
      const prods = await productService.getProducts();
      setProducts(prods);
      if (prods.length > 0) {
        setSelectedProduct(prods[0]);
        setBulkList(prods.slice(0, 3).map(p => p.id));
      }
    } catch {
      toast.error('Failed to parse catalog barcodes.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSimulateScan = () => {
    setIsScanning(true);
    toast.info('Activating optical laser scanning array...');
    
    setTimeout(() => {
      setIsScanning(false);
      if (products.length > 0) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        setScannedResult(randomProduct.barcode);
        setSelectedProduct(randomProduct);
        toast.success(`MATCH FOUND! SKU: ${randomProduct.sku} (${randomProduct.name})`);
      }
    }, 2000);
  };

  const handleCustomConvert = () => {
    if (!customSKU.trim()) {
      toast.error('Provide a high-integrity SKU name.');
      return;
    }
    const simulatedNumeric = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    setCustomBarcode(simulatedNumeric);
    toast.success('Successfully converted string SKU to numeric GS1 Barcode.');
  };

  const handleBulkPrint = () => {
    if (bulkList.length === 0) {
      toast.error('Select at least one product label.');
      return;
    }
    toast.success(`Sent ${bulkList.length} barcode labels to high-contrast printers.`);
  };

  const handleBulkExport = () => {
    if (bulkList.length === 0) {
      toast.error('Select at least one product label.');
      return;
    }
    toast.success(`Exporting ${bulkList.length} labels to high-integrity PNG ZIP folder.`);
  };

  const toggleBulkItem = (id: string) => {
    setBulkList(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 text-left">
      {/* Title */}
      <div className="border-b border-slate-150 pb-5">
        <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
          <BarcodeIcon className="w-5 h-5 text-indigo-500 animate-pulse" /> Asset Barcode Station
        </h1>
        <p className="text-xs text-slate-400 font-light mt-0.5">
          Generate GS1-compliant labels, simulate barcode camera scans, and queue bulk warehouse sticker runs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none">
        {/* Main interactive area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Simulation Scanner Card */}
          <div className="p-5 bg-white border border-slate-150 rounded-2xl shadow-2xs space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-450 font-mono flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-indigo-500" /> Simulate Optical Scanner Gun
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Scan box viewport */}
              <div className="relative h-44 bg-slate-950 rounded-xl overflow-hidden flex flex-col items-center justify-center border-2 border-slate-850">
                {/* Simulated laser line */}
                {isScanning && (
                  <div className="absolute left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_10px_#f43f5e] top-1/2 -translate-y-1/2 animate-[bounce_1.5s_infinite]" />
                )}
                
                <BarcodeIcon className={`w-16 h-12 transition-colors duration-500
                  ${isScanning ? 'text-rose-500' : 'text-slate-700'}`} />
                
                <span className="text-[9px] font-mono font-bold text-slate-500 mt-2">
                  {isScanning ? 'TRANSMITTING BEAM...' : 'READY FOR DISPATCH'}
                </span>
              </div>

              {/* Controls */}
              <div className="space-y-3.5 text-xs text-left">
                <p className="font-light text-slate-500 leading-relaxed">
                  Test physical handheld operations. Initiating simulation triggers virtual webcam capture layers and queries matched SKUs.
                </p>

                <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-150 font-mono">
                  <span className="block text-[8px] font-black uppercase text-slate-400">LAST SCANNED VALUE</span>
                  <span className="font-bold text-slate-700 text-[11px]">
                    {scannedResult || "WAITING ON ACQUISITION..."}
                  </span>
                </div>

                <button
                  onClick={handleSimulateScan}
                  disabled={isScanning}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} /> Scan Random SKU
                </button>
              </div>
            </div>
          </div>

          {/* SKU-to-Barcode Converter */}
          <div className="p-5 bg-white border border-slate-150 rounded-2xl shadow-2xs space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-450 font-mono flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-indigo-500" /> SKU-to-Barcode Converter
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Input Custom SKU</label>
                <input
                  type="text"
                  value={customSKU}
                  onChange={(e) => setCustomSKU(e.target.value)}
                  placeholder="e.g. SERVER-WEST-902"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none font-mono font-bold"
                />
              </div>

              <div className="flex flex-col justify-end">
                <button
                  onClick={handleCustomConvert}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4.5 h-4.5" /> Convert & Register
                </button>
              </div>
            </div>

            {/* Generated display */}
            {customBarcode && (
              <div className="pt-2">
                <BarcodePreview sku={customSKU} name="Custom Material SKU Asset" barcodeValue={customBarcode} />
              </div>
            )}
          </div>

          {/* Bulk label checklist */}
          <div className="p-5 bg-white border border-slate-150 rounded-2xl shadow-2xs space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="text-xs font-black uppercase text-slate-450 font-mono">Bulk Print Label Queue</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkPrint}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[9px] font-mono font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3 h-3" /> Print Checked ({bulkList.length})
                </button>
                <button
                  onClick={handleBulkExport}
                  className="px-2.5 py-1 border hover:bg-slate-50 text-slate-650 rounded text-[9px] font-mono font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" /> Zip Export
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {products.map(p => {
                const isChecked = bulkList.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => toggleBulkItem(p.id)}
                    className={`p-3 border rounded-xl flex items-center gap-2.5 cursor-pointer transition-colors text-left
                      ${isChecked ? 'border-indigo-500 bg-indigo-500/5' : 'hover:bg-slate-50'}`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // toggled on card click
                      className="cursor-pointer"
                    />
                    <div>
                      <span className="block font-bold text-slate-800 uppercase tracking-wide">{p.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Preview Side Drawer Column */}
        <div className="space-y-4">
          <div className="sticky top-6">
            <span className="block text-[10px] font-mono font-black uppercase tracking-wider text-slate-450 mb-3 text-left">
              Live Preview & Generation
            </span>

            <div className="p-4 border rounded-2xl bg-white space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-[10px] font-mono font-bold text-slate-400">SELECT PRODUCT</span>
                <select
                  value={selectedProduct?.id || ''}
                  onChange={(e) => {
                    const prod = products.find(p => p.id === e.target.value);
                    if (prod) setSelectedProduct(prod);
                  }}
                  className="p-1 text-[10px] rounded border font-mono font-bold"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.sku}</option>
                  ))}
                </select>
              </div>

              {selectedProduct ? (
                <BarcodePreview 
                  sku={selectedProduct.sku} 
                  name={selectedProduct.name} 
                  barcodeValue={selectedProduct.barcode || '8901234567890'} 
                />
              ) : (
                <div className="p-10 border border-dashed rounded-xl text-center text-xs text-slate-400">
                  Select a product to view GS1 barcode labels.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
