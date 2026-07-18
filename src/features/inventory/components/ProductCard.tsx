import React from 'react';
import { motion } from 'motion/react';
import { Package, ShieldAlert, Layers, MapPin } from 'lucide-react';
import { Product } from '../services/inventory.service';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const isLowStock = product.quantity < 10;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`p-5 rounded-2xl bg-white dark:bg-slate-950 border transition-shadow cursor-pointer select-none text-left flex flex-col justify-between h-full
        ${isLowStock 
          ? 'border-rose-100 dark:border-rose-950 hover:shadow-lg hover:shadow-rose-500/5' 
          : 'border-slate-150 dark:border-slate-850 hover:shadow-lg hover:shadow-indigo-500/5'}`}
    >
      <div className="space-y-4">
        {/* Header: Icon & Category */}
        <div className="flex justify-between items-start">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-500">
            <Package className="w-5 h-5" />
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border font-mono uppercase tracking-wider
            ${isLowStock 
              ? 'bg-rose-500/10 text-rose-600 border-rose-500/10' 
              : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10'}`}>
            {isLowStock ? 'Low Stock' : 'In Stock'}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[9px] font-black uppercase tracking-wider">
            <span>{product.brand}</span>
            <span>•</span>
            <span>{product.sku}</span>
          </div>
          <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide truncate">
            {product.name}
          </h3>
          <span className="inline-block px-1.5 py-0.5 text-[8px] font-black uppercase font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 rounded">
            {product.category}
          </span>
        </div>

        {/* Stock status indicator bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
            <span>AVAILABLE STOCK</span>
            <span className={isLowStock ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}>
              {product.quantity} units
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300
                ${isLowStock ? 'bg-rose-500' : 'bg-indigo-600'}`} 
              style={{ width: `${Math.min(100, (product.quantity / 150) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-900 flex justify-between items-center">
        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate max-w-28">{product.warehouseName}</span>
        </div>
        <div className="text-right font-mono font-black text-slate-800 dark:text-slate-200">
          ₹{product.sellingPrice.toLocaleString()}
        </div>
      </div>
    </motion.div>
  );
};
