/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { CrmSidebar } from './CrmSidebar';
import { CrmHeader } from './CrmHeader';
import { CommandPalette } from './CommandPalette';
import { Button, Input } from '../ui';
import { toast } from 'sonner';
import { customerService } from '../../services/customer.service';
import { leadService } from '../../services/lead.service';
import { dealService } from '../../services/deal.service';

export const CrmLayout: React.FC = () => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [quickFormType, setQuickFormType] = useState<'customer' | 'lead' | 'deal' | null>(null);

  // Form Inputs State
  const [customerForm, setCustomerForm] = useState({ name: '', company: '', email: '', mobile: '', city: '', state: '', totalPurchase: '' });
  const [leadForm, setLeadForm] = useState({ name: '', company: '', email: '', source: 'Inbound Web', score: '75', owner: 'John Doe', stage: 'New' });
  const [dealForm, setDealForm] = useState({ name: '', company: '', value: '', stage: 'Prospect', owner: 'John Doe', probability: '50' });

  // Add keydown listener for Ctrl+K
  React.useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const handleOpenQuickForm = (type: 'customer' | 'lead' | 'deal') => {
    setQuickFormType(type);
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerForm.name || !customerForm.company) {
      toast.error('Name and Company fields are required.');
      return;
    }

    try {
      await customerService.createCustomer({
        name: customerForm.name,
        company: customerForm.company,
        email: customerForm.email || 'noreply@company.com',
        mobile: customerForm.mobile || '9999999999',
        city: customerForm.city || 'Mumbai',
        state: customerForm.state || 'Maharashtra',
        totalPurchase: Number(customerForm.totalPurchase) || 0
      });
      toast.success(`Successfully saved customer record for ${customerForm.name}!`);
      setCustomerForm({ name: '', company: '', email: '', mobile: '', city: '', state: '', totalPurchase: '' });
      setQuickFormType(null);
      // Trigger a refresh event if pages are listening
      window.dispatchEvent(new Event('crm-data-refresh'));
    } catch (err) {
      toast.error('Failed to register customer.');
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.company) {
      toast.error('Name and Company are required.');
      return;
    }

    try {
      await leadService.createLead({
        name: leadForm.name,
        company: leadForm.company,
        email: leadForm.email || 'inbound@lead.com',
        source: leadForm.source,
        score: Number(leadForm.score),
        owner: leadForm.owner,
        stage: leadForm.stage
      });
      toast.success(`Registered new lead: ${leadForm.name}!`);
      setLeadForm({ name: '', company: '', email: '', source: 'Inbound Web', score: '75', owner: 'John Doe', stage: 'New' });
      setQuickFormType(null);
      window.dispatchEvent(new Event('crm-data-refresh'));
    } catch (err) {
      toast.error('Failed to capture lead.');
    }
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealForm.name || !dealForm.company || !dealForm.value) {
      toast.error('Name, Company and Value are required.');
      return;
    }

    try {
      await dealService.createDeal({
        name: dealForm.name,
        company: dealForm.company,
        value: Number(dealForm.value),
        stage: dealForm.stage,
        owner: dealForm.owner,
        probability: Number(dealForm.probability)
      });
      toast.success(`Created deal opportunity: ${dealForm.name}!`);
      setDealForm({ name: '', company: '', value: '', stage: 'Prospect', owner: 'John Doe', probability: '50' });
      setQuickFormType(null);
      window.dispatchEvent(new Event('crm-data-refresh'));
    } catch (err) {
      toast.error('Failed to create sales deal.');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900/10">
      
      {/* Collapsible Sidebar */}
      <CrmSidebar />

      {/* Main Workspace Stream */}
      <div className="flex flex-col flex-grow overflow-hidden">
        
        {/* Dynamic header */}
        <CrmHeader
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenQuickForm={handleOpenQuickForm}
        />

        {/* Content canvas */}
        <main className="flex-grow overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/20">
          <Outlet />
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenQuickForm={handleOpenQuickForm}
      />

      {/* Form Dialog Modals */}
      {quickFormType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setQuickFormType(null)} />
          
          <div className="relative w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl text-left space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono">
                Add {quickFormType === 'customer' ? 'Customer Profile' : quickFormType === 'lead' ? 'Lead Prospect' : 'Deal Opportunity'}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-light mt-0.5">
                Register a new record in local memory databases.
              </p>
            </div>

            {/* Quick Customer Form */}
            {quickFormType === 'customer' && (
              <form onSubmit={handleCreateCustomer} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Name" placeholder="John Doe" value={customerForm.name} onChange={(val) => setCustomerForm({ ...customerForm, name: val })} required />
                  <Input label="Company" placeholder="TechVantage" value={customerForm.company} onChange={(val) => setCustomerForm({ ...customerForm, company: val })} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Email" placeholder="john@example.com" value={customerForm.email} onChange={(val) => setCustomerForm({ ...customerForm, email: val })} />
                  <Input label="Mobile" placeholder="9876543210" value={customerForm.mobile} onChange={(val) => setCustomerForm({ ...customerForm, mobile: val })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="City" placeholder="Mumbai" value={customerForm.city} onChange={(val) => setCustomerForm({ ...customerForm, city: val })} />
                  <Input label="State" placeholder="Maharashtra" value={customerForm.state} onChange={(val) => setCustomerForm({ ...customerForm, state: val })} />
                </div>
                <Input label="Purchase Amount (INR)" placeholder="50000" type="number" value={customerForm.totalPurchase} onChange={(val) => setCustomerForm({ ...customerForm, totalPurchase: val })} />
                <div className="flex gap-3 justify-end pt-3">
                  <Button variant="outline" className="py-2 text-xs font-bold" type="button" onClick={() => setQuickFormType(null)}>Cancel</Button>
                  <Button variant="primary" className="py-2 text-xs font-bold" type="submit">Save Profile</Button>
                </div>
              </form>
            )}

            {/* Quick Lead Form */}
            {quickFormType === 'lead' && (
              <form onSubmit={handleCreateLead} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Lead Name" placeholder="Sneha Iyer" value={leadForm.name} onChange={(val) => setLeadForm({ ...leadForm, name: val })} required />
                  <Input label="Company" placeholder="Cognitive Solutions" value={leadForm.company} onChange={(val) => setLeadForm({ ...leadForm, company: val })} required />
                </div>
                <Input label="Email Address" placeholder="sneha@example.com" value={leadForm.email} onChange={(val) => setLeadForm({ ...leadForm, email: val })} />
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Lead Source</label>
                    <select value={leadForm.source} onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })} className="w-full mt-1 p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent">
                      <option>Inbound Web</option>
                      <option>Outbound Email</option>
                      <option>Google Search</option>
                      <option>Partner Referral</option>
                    </select>
                  </div>
                  <Input label="Lead Score (1-100)" placeholder="75" type="number" value={leadForm.score} onChange={(val) => setLeadForm({ ...leadForm, score: val })} />
                </div>
                <div className="flex gap-3 justify-end pt-3">
                  <Button variant="outline" className="py-2 text-xs font-bold" type="button" onClick={() => setQuickFormType(null)}>Cancel</Button>
                  <Button variant="primary" className="py-2 text-xs font-bold" type="submit">Capture Lead</Button>
                </div>
              </form>
            )}

            {/* Quick Deal Form */}
            {quickFormType === 'deal' && (
              <form onSubmit={handleCreateDeal} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Deal Name" placeholder="SaaS Subscription Enterprise" value={dealForm.name} onChange={(val) => setDealForm({ ...dealForm, name: val })} required />
                  <Input label="Company" placeholder="TechVantage" value={dealForm.company} onChange={(val) => setDealForm({ ...dealForm, company: val })} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Deal Value (INR)" placeholder="150000" type="number" value={dealForm.value} onChange={(val) => setDealForm({ ...dealForm, value: val })} required />
                  <Input label="Win Probability %" placeholder="60" type="number" value={dealForm.probability} onChange={(val) => setDealForm({ ...dealForm, probability: val })} />
                </div>
                <div className="text-xs">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Sales Stage</label>
                  <select value={dealForm.stage} onChange={(e) => setDealForm({ ...dealForm, stage: e.target.value })} className="w-full mt-1 p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent">
                    <option>Prospect</option>
                    <option>Qualified</option>
                    <option>Proposal</option>
                    <option>Negotiation</option>
                    <option>Won</option>
                    <option>Lost</option>
                  </select>
                </div>
                <div className="flex gap-3 justify-end pt-3">
                  <Button variant="outline" className="py-2 text-xs font-bold" type="button" onClick={() => setQuickFormType(null)}>Cancel</Button>
                  <Button variant="primary" className="py-2 text-xs font-bold" type="submit">Create Deal</Button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
