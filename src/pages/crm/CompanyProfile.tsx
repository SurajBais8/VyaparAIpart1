/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { companyService } from '../../services/company.service';
import { Card } from '../../components/ui';
import {
  ArrowLeft,
  Building2,
  Users,
  DollarSign,
  Contact2,
  FileText,
  BadgeAlert,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

export const CompanyProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>(null);

  const fetchCompany = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await companyService.getCompanyById(id);
      if (data) {
        setCompany(data);
      } else {
        toast.error('Company not found in directory.');
        navigate('/crm/companies');
      }
    } catch (err) {
      toast.error('Failed to parse corporate parameters.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 text-left animate-pulse">
        <div className="h-6 w-32 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-100 rounded-2xl" />
          <div className="lg:col-span-2 h-96 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!company) return null;

  const contactsList = company.profile?.contactsList || [];
  const dealsList = company.profile?.deals || [];

  return (
    <div className="space-y-6 text-left">
      
      {/* Navigation action back */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/crm/companies')}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Organization Corporate Index</span>
          <h1 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono mt-0.5">
            {company.name}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Company Summary Card */}
        <Card variant="glass" className="p-5 border border-slate-200/50 dark:border-slate-850 space-y-4 h-fit">
          <div className="w-12 h-12 rounded-xl overflow-hidden border bg-slate-100 flex items-center justify-center">
            {company.logo ? (
              <img referrerPolicy="no-referrer" src={company.logo} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-6 h-6 text-slate-400" />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-850 dark:text-slate-50">{company.name}</h3>
            <span className="text-[10px] font-mono text-slate-400 font-bold block">ID: {company.id}</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-900 pt-3 space-y-3.5 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-450">Sector Industry</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">{company.industry}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-450">Employee Count</span>
              <span className="font-bold font-mono">{company.employees} staff</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-450">Account Valuation</span>
              <span className="font-bold text-emerald-600 font-mono">₹{company.revenue?.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Linked Accounts and Deals lists */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Linked key personnel */}
          <Card variant="glass" className="p-5 border border-slate-200/50 dark:border-slate-850">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono tracking-widest mb-4 flex items-center gap-1.5">
              <Contact2 className="w-4 h-4 text-indigo-500" /> Key Personnel & Contacts
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-900 space-y-3">
              {contactsList.map((con: any, i: number) => (
                <div key={i} className="flex justify-between items-center py-2 text-xs">
                  <div className="text-left">
                    <span className="font-bold text-slate-750 dark:text-slate-250 block">{con.name}</span>
                    <span className="text-[10px] text-slate-400 block">{con.role}</span>
                  </div>
                  <span className="font-mono text-slate-500 font-medium">{con.email}</span>
                </div>
              ))}
              {contactsList.length === 0 && (
                <p className="text-xs text-slate-450 italic py-4">No key personnel linked.</p>
              )}
            </div>
          </Card>

          {/* Connected Sales Deals */}
          <Card variant="glass" className="p-5 border border-slate-200/50 dark:border-slate-850">
            <h3 className="text-xs font-black uppercase text-slate-400 font-mono tracking-widest mb-4 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-500" /> Linked Deal Opportunities
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-900 space-y-3">
              {dealsList.map((dl: any, i: number) => (
                <div key={i} className="flex justify-between items-center py-2 text-xs">
                  <div className="text-left space-y-0.5">
                    <span className="font-bold text-slate-750 dark:text-slate-250 block">{dl.name}</span>
                    <span className="text-[10px] text-slate-400 block font-mono capitalize">Stage: {dl.stage}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400 font-mono block">₹{dl.value?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
              {dealsList.length === 0 && (
                <p className="text-xs text-slate-450 italic py-4">No open sales deal opportunities.</p>
              )}
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};
