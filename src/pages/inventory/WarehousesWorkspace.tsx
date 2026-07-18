/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { warehouseService, Warehouse } from '../../services/warehouse.service';
import { Card, Button, Input } from '../../components/ui';
import { 
  Warehouse as WHIcon, 
  Plus, 
  MapPin, 
  User, 
  CheckCircle, 
  AlertTriangle,
  Server,
  Activity,
  HardDrive
} from 'lucide-react';
import { toast } from 'sonner';

export const WarehousesWorkspace: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newWH, setNewWH] = useState({
    name: '',
    code: '',
    location: '',
    maxCapacity: 1000,
    capacityLevel: 0,
    manager: '',
    status: 'Active' as 'Active' | 'Under Maintenance' | 'Full'
  });

  const loadWarehouses = async () => {
    setLoading(true);
    try {
      const data = await warehouseService.getWarehouses();
      setWarehouses(data);
    } catch {
      toast.error('Failed to parse warehouses schema.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWarehouses();
  }, []);

  const handleCreateWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWH.name || !newWH.code) {
      toast.error('Warehouse Name and Code are required.');
      return;
    }

    try {
      await warehouseService.createWarehouse({
        name: newWH.name,
        code: newWH.code.toUpperCase(),
        location: newWH.location || 'Mumbai',
        maxCapacity: Number(newWH.maxCapacity),
        capacityLevel: Number(newWH.capacityLevel),
        manager: newWH.manager || 'Unassigned',
        status: newWH.status
      });

      toast.success(`Successfully provisioned Warehouse: ${newWH.name}`);
      setIsAddOpen(false);
      setNewWH({
        name: '',
        code: '',
        location: '',
        maxCapacity: 1000,
        capacityLevel: 0,
        manager: '',
        status: 'Active'
      });
      loadWarehouses();
    } catch {
      toast.error('Failed to register storage hub.');
    }
  };

  const handleDeleteWarehouse = async (id: string, name: string) => {
    if (confirm(`Decommission storage hub "${name}" permanently?`)) {
      await warehouseService.deleteWarehouse(id);
      toast.success('Warehouse decommissioned.');
      loadWarehouses();
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-5 select-none">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <WHIcon className="w-5 h-5 text-indigo-500" /> Storage Hubs & Warehouses
          </h1>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Physical material silos, node capacities, local SLA managers, and hardware router arrays.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Provision Storage Node
        </button>
      </div>

      {/* Grid of Warehouse cards */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
        </div>
      ) : warehouses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warehouses.map((wh) => {
            const usagePercent = Math.min(100, Math.round((wh.capacityLevel / wh.maxCapacity) * 100));
            const isCritical = usagePercent >= 90;

            return (
              <Card
                key={wh.id}
                variant="glass"
                className="p-5 border border-slate-200/50 dark:border-slate-850 hover:border-indigo-500/25 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-5"
              >
                {/* Header info */}
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5 text-left">
                    <span className="font-mono text-[9px] font-black uppercase tracking-widest text-indigo-500 px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-500/10 rounded">
                      {wh.code}
                    </span>
                    <h3 className="text-xs font-black uppercase text-slate-800 dark:text-slate-100 font-mono tracking-wide mt-2 block">
                      {wh.name}
                    </h3>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border font-mono tracking-wider uppercase
                    ${wh.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' : ''}
                    ${wh.status === 'Full' ? 'bg-rose-500/10 text-rose-600 border-rose-500/10' : ''}
                    ${wh.status === 'Under Maintenance' ? 'bg-amber-500/10 text-amber-600 border-amber-500/10' : ''}
                  `}>
                    {wh.status}
                  </span>
                </div>

                {/* Details list */}
                <div className="space-y-2 text-xs text-slate-550 dark:text-slate-400 select-none">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{wh.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Manager: <strong className="font-bold text-slate-700 dark:text-slate-350">{wh.manager}</strong></span>
                  </div>
                </div>

                {/* Capacity Gauge representation */}
                <div className="space-y-2 select-none">
                  <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                    <span className="text-slate-400">STORAGE UTILIZATION</span>
                    <span className={isCritical ? 'text-rose-500 font-black' : 'text-indigo-500'}>
                      {wh.capacityLevel} / {wh.maxCapacity} units ({usagePercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500
                        ${isCritical ? 'bg-rose-500' : 'bg-indigo-600'}`} 
                      style={{ width: `${usagePercent}%` }} 
                    />
                  </div>

                  {isCritical && (
                    <div className="flex items-center gap-1 text-[9px] text-rose-500 font-mono font-bold uppercase mt-1">
                      <AlertTriangle className="w-3.5 h-3.5 animate-bounce" /> Warning: Capacity limit imminent
                    </div>
                  )}
                </div>

                {/* Actions footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-850/60 flex justify-between items-center">
                  <span className="text-[10px] font-mono font-black uppercase text-slate-400">
                    Node ID: {wh.id}
                  </span>
                  <button
                    onClick={() => handleDeleteWarehouse(wh.id, wh.name)}
                    className="p-1 rounded text-slate-400 hover:text-rose-500 cursor-pointer text-[10px] font-black uppercase font-mono tracking-wider border border-slate-150 hover:border-rose-500/20"
                  >
                    Decommission
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center bg-white border border-slate-200/50 rounded-2xl">
          <span className="text-xs text-slate-400">No active storage nodes registered in storage directories.</span>
        </div>
      )}

      {/* Add Warehouse Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setIsAddOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl text-left space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono">
                Provision Storage Zone
              </h3>
              <p className="text-xs text-slate-400 font-light mt-0.5">
                Register a new physical storage warehouse in enterprise memory databases.
              </p>
            </div>

            <form onSubmit={handleCreateWarehouse} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  label="Warehouse Name" 
                  placeholder="Chennai Storage Vault" 
                  value={newWH.name} 
                  onChange={(val) => setNewWH({ ...newWH, name: val })} 
                  required 
                />
                <Input 
                  label="Storage Code" 
                  placeholder="CHN-VAULT-03" 
                  value={newWH.code} 
                  onChange={(val) => setNewWH({ ...newWH, code: val })} 
                  required 
                />
              </div>

              <Input 
                label="Physical Address" 
                placeholder="Guindy Highway, Chennai" 
                value={newWH.location} 
                onChange={(val) => setNewWH({ ...newWH, location: val })} 
              />

              <div className="grid grid-cols-2 gap-3">
                <Input 
                  label="Max Storage Unit Capacity" 
                  type="number" 
                  placeholder="1000" 
                  value={newWH.maxCapacity.toString()} 
                  onChange={(val) => setNewWH({ ...newWH, maxCapacity: Number(val) })} 
                />
                <Input 
                  label="Current Logged Storage Level" 
                  type="number" 
                  placeholder="150" 
                  value={newWH.capacityLevel.toString()} 
                  onChange={(val) => setNewWH({ ...newWH, capacityLevel: Number(val) })} 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input 
                  label="Assigned Site Manager" 
                  placeholder="Karthik Raja" 
                  value={newWH.manager} 
                  onChange={(val) => setNewWH({ ...newWH, manager: val })} 
                />
                <div className="text-xs flex flex-col justify-end">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status</label>
                  <select 
                    value={newWH.status} 
                    onChange={(e) => setNewWH({ ...newWH, status: e.target.value as any })} 
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent outline-none text-slate-750 dark:text-slate-250 font-bold"
                  >
                    <option>Active</option>
                    <option>Under Maintenance</option>
                    <option>Full</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <Button variant="outline" className="py-2 text-xs font-bold" type="button" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button variant="primary" className="py-2 text-xs font-bold" type="submit">Provision Node</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
