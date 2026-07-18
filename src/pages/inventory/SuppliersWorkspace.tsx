/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { supplierService, Supplier } from '../../services/supplier.service';
import { Card, Button, Input } from '../../components/ui';
import { 
  Users2, 
  Plus, 
  Star, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  CreditCard,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

export const SuppliersWorkspace: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSup, setNewSup] = useState({
    name: '',
    contactPerson: '',
    email: '',
    mobile: '',
    address: '',
    category: 'Hardware Systems',
    reliabilityScore: 95,
    outstandingBalance: 0,
    status: 'Active' as 'Active' | 'Blacklisted' | 'Inactive'
  });

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const data = await supplierService.getSuppliers();
      setSuppliers(data);
    } catch {
      toast.error('Failed to parse suppliers directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSup.name || !newSup.contactPerson) {
      toast.error('Supplier Name and Contact Person are required.');
      return;
    }

    try {
      await supplierService.createSupplier({
        name: newSup.name,
        contactPerson: newSup.contactPerson,
        email: newSup.email || 'noreply@vendor.com',
        mobile: newSup.mobile || '9999999999',
        address: newSup.address || 'India',
        category: newSup.category,
        reliabilityScore: Number(newSup.reliabilityScore),
        outstandingBalance: Number(newSup.outstandingBalance),
        status: newSup.status
      });

      toast.success(`Registered Supplier: ${newSup.name}`);
      setIsAddOpen(false);
      setNewSup({
        name: '',
        contactPerson: '',
        email: '',
        mobile: '',
        address: '',
        category: 'Hardware Systems',
        reliabilityScore: 95,
        outstandingBalance: 0,
        status: 'Active'
      });
      loadSuppliers();
    } catch {
      toast.error('Failed to register vendor.');
    }
  };

  const handleDeleteSupplier = async (id: string, name: string) => {
    if (confirm(`Remove supplier "${name}" from memory ledger permanently?`)) {
      await supplierService.deleteSupplier(id);
      toast.success('Supplier removed.');
      loadSuppliers();
    }
  };

  const renderStars = (score: number) => {
    // 0-100 mapped to 5 stars
    const stars = Math.round(score / 20);
    return (
      <div className="flex items-center gap-0.5 text-amber-500 select-none">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-3.5 h-3.5 ${i < stars ? 'fill-amber-500' : 'text-slate-200 dark:text-slate-800'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-5 select-none">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <Users2 className="w-5 h-5 text-indigo-500" /> Supplier Directory & Vendors
          </h1>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Audit supply line contractors, track shipping reliability indexes, and coordinate outstanding payables.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Register Vendor
        </button>
      </div>

      {/* Suppliers Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
        </div>
      ) : suppliers.length > 0 ? (
        <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850/70 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-850 select-none text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider">
                  <th className="p-4">Vendor ID</th>
                  <th className="p-4">Supplier Name</th>
                  <th className="p-4">Contact Personnel</th>
                  <th className="p-4">Product Category</th>
                  <th className="p-4 text-center">Reliability Index</th>
                  <th className="p-4 text-right">Pending Dues</th>
                  <th className="p-4 text-center">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                {suppliers.map((sup) => (
                  <tr key={sup.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="p-4 font-mono font-black text-[10px] text-slate-400">{sup.id}</td>
                    <td className="p-4">
                      <div className="flex flex-col text-left font-sans">
                        <span className="font-extrabold text-slate-800 dark:text-slate-100">{sup.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0" /> {sup.address}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-left">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-700 dark:text-slate-300 block">{sup.contactPerson}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-450 font-mono">
                          <span className="flex items-center gap-0.5"><Mail className="w-3 h-3" /> {sup.email}</span>
                          <span className="flex items-center gap-0.5"><Phone className="w-3 h-3" /> +91 {sup.mobile}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase font-mono bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 border border-indigo-500/10 rounded">
                        {sup.category}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center justify-center gap-1 font-mono text-[9px]">
                        {renderStars(sup.reliabilityScore)}
                        <span className="font-extrabold text-slate-500">{sup.reliabilityScore}% Index</span>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                      ₹{sup.outstandingBalance.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteSupplier(sup.id, sup.name)}
                        className="p-1.5 rounded-lg border border-slate-150 hover:border-rose-500/30 text-rose-500 cursor-pointer hover:bg-rose-50"
                        title="Remove Supplier"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-16 text-center bg-white border border-slate-200/50 rounded-2xl">
          <span className="text-xs text-slate-400">No vendors registered in supplier directories.</span>
        </div>
      )}

      {/* Add Supplier Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setIsAddOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl text-left space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono">
                Register Vendor Contractor
              </h3>
              <p className="text-xs text-slate-400 font-light mt-0.5">
                Onboard new suppliers into local transaction ledgers. Track compliance scorecards.
              </p>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  label="Vendor Name" 
                  placeholder="Tata Tele Infra Ltd" 
                  value={newSup.name} 
                  onChange={(val) => setNewSup({ ...newSup, name: val })} 
                  required 
                />
                <Input 
                  label="Contact Person" 
                  placeholder="Sanjay Dutt" 
                  value={newSup.contactPerson} 
                  onChange={(val) => setNewSup({ ...newSup, contactPerson: val })} 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input 
                  label="Email ID" 
                  type="email" 
                  placeholder="infra@tata.com" 
                  value={newSup.email} 
                  onChange={(val) => setNewSup({ ...newSup, email: val })} 
                />
                <Input 
                  label="Mobile ID" 
                  placeholder="9822334455" 
                  value={newSup.mobile} 
                  onChange={(val) => setNewSup({ ...newSup, mobile: val })} 
                />
              </div>

              <Input 
                label="Physical Corporate Office" 
                placeholder="Sion Fort Road, Mumbai" 
                value={newSup.address} 
                onChange={(val) => setNewSup({ ...newSup, address: val })} 
              />

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col justify-end">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
                  <select 
                    value={newSup.category} 
                    onChange={(e) => setNewSup({ ...newSup, category: e.target.value })} 
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent outline-none text-slate-750 font-bold"
                  >
                    <option>Hardware Systems</option>
                    <option>Software Systems</option>
                    <option>Hardware Routers</option>
                  </select>
                </div>

                <Input 
                  label="Reliability Score %" 
                  type="number" 
                  placeholder="95" 
                  value={newSup.reliabilityScore.toString()} 
                  onChange={(val) => setNewSup({ ...newSup, reliabilityScore: Number(val) })} 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input 
                  label="Outstanding Balance (INR)" 
                  type="number" 
                  placeholder="150000" 
                  value={newSup.outstandingBalance.toString()} 
                  onChange={(val) => setNewSup({ ...newSup, outstandingBalance: Number(val) })} 
                />

                <div className="text-xs flex flex-col justify-end">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status</label>
                  <select 
                    value={newSup.status} 
                    onChange={(e) => setNewSup({ ...newSup, status: e.target.value as any })} 
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent outline-none text-slate-750 font-bold"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Blacklisted</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <Button variant="outline" className="py-2 text-xs font-bold" type="button" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button variant="primary" className="py-2 text-xs font-bold" type="submit">Onboard Supplier</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
