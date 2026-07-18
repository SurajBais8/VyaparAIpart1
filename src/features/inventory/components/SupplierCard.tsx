import React from 'react';
import { motion } from 'motion/react';
import { Star, Mail, Phone, MapPin, Award } from 'lucide-react';
import { Supplier } from '../services/supplier.service';

interface SupplierCardProps {
  supplier: Supplier;
  onClick?: () => void;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({ supplier, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 hover:border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer transition-all select-none text-left flex flex-col justify-between h-full space-y-4"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <span className="font-mono text-[9px] font-black uppercase tracking-widest text-indigo-500 px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-500/10 rounded">
              {supplier.code}
            </span>
            <h3 className="text-xs font-black uppercase text-slate-800 dark:text-slate-100 font-mono tracking-wide mt-2 block">
              {supplier.name}
            </h3>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border font-mono tracking-wider uppercase
            ${supplier.status === 'Preferred' ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/10' : ''}
            ${supplier.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' : ''}
            ${supplier.status === 'Reviewing' ? 'bg-rose-500/10 text-rose-600 border-rose-500/10' : ''}
          `}>
            {supplier.status}
          </span>
        </div>

        {/* Rating & Contact Person */}
        <div className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
          <div className="text-left">
            <span className="block text-[8px] font-black uppercase text-slate-400 font-mono">CONTACT PERSON</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{supplier.contactPerson}</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold">
            <Star className="w-3 h-3 fill-amber-500 shrink-0" />
            <span>{supplier.rating}</span>
          </div>
        </div>

        {/* Info Items */}
        <div className="space-y-1.5 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{supplier.email}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{supplier.phone}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{supplier.address}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-900 flex justify-between items-center text-[9px] font-mono font-black text-slate-400">
        <span>ID: {supplier.id}</span>
        <span className="flex items-center gap-1 text-indigo-500 uppercase">
          <Award className="w-3.5 h-3.5" /> AI Verified
        </span>
      </div>
    </motion.div>
  );
};
