import React, { useEffect, useState } from 'react';
import { productService } from '../../services/product.service';
import { Product } from '../../services/inventory.service';
import { QRPreview } from '../../components/QRPreview';
import { 
  QrCode, 
  Printer, 
  Download, 
  Camera, 
  Keyboard, 
  Sparkles, 
  RefreshCw,
  SlidersHorizontal 
} from 'lucide-react';
import { toast } from 'sonner';

export const QRCodeManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Custom QR Payload Manager state
  const [payloadType, setPayloadType] = useState('Product ID'); // 'Product ID' | 'JSON' | 'URL'
  const [customText, setCustomText] = useState('https://inventory.enterprise.co/material-item/PROD-102');
  const [customQRValue, setCustomQRValue] = useState('https://inventory.enterprise.co/material-item/PROD-102');

  // Scanner Simulator
  const [scannedResult, setScannedResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // Bulk print queue list
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
      toast.error('Failed to parse catalog QR codes.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSimulateScan = () => {
    setIsScanning(true);
    toast.info('Aligning camera viewfinder for matrix QR decoding...');

    setTimeout(() => {
      setIsScanning(false);
      if (products.length > 0) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const generatedVal = `product-id:${randomProduct.id};sku:${randomProduct.sku};qty:${randomProduct.quantity}`;
        setScannedResult(generatedVal);
        setSelectedProduct(randomProduct);
        toast.success(`DECODED SUCCESS! Matches product catalog: ${randomProduct.name}`);
      }
    }, 2000);
  };

  const handleGenerateCustomQR = () => {
    if (!customText.trim()) {
      toast.error('Please input a valid custom payload string.');
      return;
    }
    setCustomQRValue(customText);
    toast.success('Generated dynamic QR code payload with high-density blocks.');
  };

  const handleBulkPrint = () => {
    if (bulkList.length === 0) {
      toast.error('Select at least one product QR label.');
      return;
    }
    toast.success(`Queued ${bulkList.length} matrix QR labels to high-contrast printers.`);
  };

  const handleBulkExport = () => {
    if (bulkList.length === 0) {
      toast.error('Select at least one product QR label.');
      return;
    }
    toast.success(`Downloaded ${bulkList.length} high-density QR images as PNG folder.`);
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
          <QrCode className="w-5 h-5 text-indigo-500 animate-pulse" /> Material QR Station
        </h1>
        <p className="text-xs text-slate-400 font-light mt-0.5">
          Design high-density matrix QR stickers, simulate optical scanning arrays, and bind custom serialization strings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none">
        {/* Main Content Areas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Simulated optical camera scanner */}
          <div className="p-5 bg-white border border-slate-150 rounded-2xl shadow-2xs space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-450 font-mono flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-indigo-500" /> Simulate QR Viewfinder Matrix
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Virtual viewfinder box with green targeted corners */}
              <div className="relative h-44 bg-slate-950 rounded-xl overflow-hidden flex flex-col items-center justify-center border-2 border-slate-850">
                {/* Simulated targeted box corners */}
                <span className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-500" />
                <span className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-500" />
                <span className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-500" />
                <span className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-500" />

                {isScanning && (
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-emerald-500 shadow-[0_0_12px_#10b981] animate-[bounce_1.5s_infinite]" />
                )}

                <QrCode className={`w-16 h-16 transition-colors duration-500
                  ${isScanning ? 'text-emerald-500' : 'text-slate-700'}`} />

                <span className="text-[9px] font-mono font-bold text-slate-500 mt-2">
                  {isScanning ? 'DECODING IMAGE...' : 'POSITION DECAL IN FRONT'}
                </span>
              </div>

              {/* Controls */}
              <div className="space-y-3.5 text-xs text-left">
                <p className="font-light text-slate-500 leading-relaxed">
                  Trigger virtual camera frame decoders to extract string tags and serialize IDs to physical storage nodes.
                </p>

                <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-150 font-mono">
                  <span className="block text-[8px] font-black uppercase text-slate-400">DECODED QR PAYLOAD</span>
                  <span className="font-bold text-slate-700 text-[10px] truncate max-w-xs block">
                    {scannedResult || "AWAITING MATRIX ALIGNMENT..."}
                  </span>
                </div>

                <button
                  onClick={handleSimulateScan}
                  disabled={isScanning}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} /> Scan QR Code Decal
                </button>
              </div>
            </div>
          </div>

          {/* Custom QR Payload Manager */}
          <div className="p-5 bg-white border border-slate-150 rounded-2xl shadow-2xs space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-450 font-mono flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-indigo-500" /> Custom QR Payload Manager
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-left">
              <div className="space-y-3">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Payload Schema</label>
                  <select
                    value={payloadType}
                    onChange={(e) => setPayloadType(e.target.value)}
                    className="p-2 border rounded-xl font-bold bg-transparent"
                  >
                    <option value="URL">Secure URL Link</option>
                    <option value="JSON">Raw JSON Schema</option>
                    <option value="Text">String Asset ID</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Payload Content</label>
                  <textarea
                    rows={3}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="p-2.5 border rounded-xl outline-none font-mono font-bold resize-none leading-relaxed"
                  />
                </div>

                <button
                  onClick={handleGenerateCustomQR}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4.5 h-4.5" /> Compile Payload
                </button>
              </div>

              {/* QR Preview Output */}
              <div className="flex items-center justify-center">
                {customQRValue && (
                  <QRPreview sku="CUSTOM-PAYLOAD" name="Matrix Code Label" value={customQRValue} />
                )}
              </div>
            </div>
          </div>

          {/* Bulk checklist queue */}
          <div className="p-5 bg-white border border-slate-150 rounded-2xl shadow-2xs space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="text-xs font-black uppercase text-slate-450 font-mono">Bulk QR Code Print Queue</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkPrint}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[9px] font-mono font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3 h-3" /> Print Queue ({bulkList.length})
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

        {/* Live Right preview sidebar */}
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
                <QRPreview 
                  sku={selectedProduct.sku} 
                  name={selectedProduct.name} 
                  value={`product-id:${selectedProduct.id};sku:${selectedProduct.sku};stock:${selectedProduct.quantity}`} 
                />
              ) : (
                <div className="p-10 border border-dashed rounded-xl text-center text-xs text-slate-400">
                  Select a product SKU to preview matrix QRs.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
