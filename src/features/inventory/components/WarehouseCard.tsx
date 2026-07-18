import React from 'react';
import { motion } from 'motion/react';
import { Building2, MapPin, User, AlertTriangle } from 'lucide-react';
import { Warehouse } from '../services/warehouse.service';

interface WarehouseCardProps {
  warehouse: Warehouse;
  onClick?: () => void;
}

export const WarehouseCard: React.FC<WarehouseCardProps> = ({ warehouse, onClick }) => {
  const usagePercent = Math.min(100, Math.round((warehouse.capacityLevel / warehouse.maxCapacity) * 100));
  const isCritical = usagePercent >= 90;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 hover:border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer transition-shadow select-none text-left flex flex-col justify-between h-full space-y-4"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <span className="font-mono text-[9px] font-black uppercase tracking-widest text-indigo-500 px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-500/10 rounded">
              {warehouse.code}
            </span>
            <h3 className="text-xs font-black uppercase text-slate-800 dark:text-slate-100 font-mono tracking-wide mt-2 block">
              {warehouse.name}
            </h3>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border font-mono tracking-wider uppercase
            ${warehouse.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' : ''}
            ${warehouse.status === 'Full' ? 'bg-rose-500/10 text-rose-600 border-rose-500/10' : ''}
            ${warehouse.status === 'Under Maintenance' ? 'bg-amber-500/10 text-amber-600 border-amber-500/10' : ''}
          `}>
            {warehouse.status}
          </span>
        </div>

        {/* Info Items */}
        <div className="space-y-1.5 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{warehouse.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Manager: <strong className="font-bold text-slate-700 dark:text-slate-350">{warehouse.manager}</strong></span>
          </div>
        </div>

        {/* Capacity utilization indicator */}
        <div className="space-y-1.5 select-none pt-1">
          <div className="flex justify-between items-center text-[10px] font-mono font-bold">
            <span className="text-slate-400">STORAGE UTILIZATION</span>
            <span className={isCritical ? 'text-rose-500 font-black' : 'text-indigo-500'}>
              {warehouse.capacityLevel} / {warehouse.maxCapacity} ({usagePercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300
                ${isCritical ? 'bg-rose-500' : 'bg-indigo-600'}`} 
              style={{ width: `${usagePercent}%` }} 
            />
          </div>

          {isCritical && (
            <div className="flex items-center gap-1 text-[9px] text-rose-500 font-mono font-bold uppercase mt-1 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" /> Capacity limit imminent
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-900 flex justify-between items-center text-[9px] font-mono font-black text-slate-400">
        <span>ID: {warehouse.id}</span>
        <span>{warehouse.employees?.length || 0} STAFF REGISTERED</span>
      </div>
    </motion.div>
  );
};
