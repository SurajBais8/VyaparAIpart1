import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, ArrowRight, CornerDownRight } from 'lucide-react';
import { Product } from '../services/inventory.service';

interface StockAlertCardProps {
  product: Product;
  onReorderClick?: () => void;
  onTransferClick?: () => void;
}

export const StockAlertCard: React.FC<StockAlertCardProps> = ({ product, onReorderClick, onTransferClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-rose-500/5 dark:bg-rose-950/10 border border-rose-200/50 dark:border-rose-950/50 rounded-xl flex items-start gap-4 text-left select-none relative overflow-hidden shadow-xs"
    >
      <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-lg shrink-0 mt-0.5 animate-pulse">
        <AlertTriangle className="w-4 h-4" />
      </div>

      <div className="space-y-3.5 flex-1 min-w-0">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 font-mono text-[9px] font-black uppercase text-rose-500 tracking-wider">
            <span>CRITICAL DEFICIT</span>
            <span>•</span>
            <span>{product.sku}</span>
          </div>
          <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide truncate">
            {product.name}
          </h4>
          <span className="block text-[10px] text-slate-400 font-medium">
            Currently: <strong className="font-bold text-rose-600 font-mono">{product.quantity}</strong> / {product.availableQuantity} units left (Min target: 10). Located at {product.warehouseName}.
          </span>
        </div>

        {/* Quick actions row */}
        <div className="flex gap-2.5">
          {onReorderClick && (
            <button
              onClick={onReorderClick}
              className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[9px] font-black uppercase font-mono tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
            >
              Raise PO <ArrowRight className="w-3 h-3" />
            </button>
          )}
          {onTransferClick && (
            <button
              onClick={onTransferClick}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-rose-200/50 dark:border-rose-950/30 rounded-lg text-[9px] font-black uppercase font-mono tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
            >
              Transfer <CornerDownRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
