/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  invoiceService 
} from '../services/invoice.service';
import { 
  paymentService 
} from '../services/payment.service';
import { 
  expenseService 
} from '../services/expense.service';
import { 
  ledgerService 
} from '../services/ledger.service';
import { 
  gstService 
} from '../services/gst.service';
import { 
  accountingService 
} from '../services/accounting.service';

import { 
  Invoice, 
  Payment, 
  Expense, 
  Ledger, 
  GSTData, 
  Transaction 
} from '../../../types/accounting';

import { 
  InvoiceCard 
} from '../components/InvoiceCard';
import { 
  InvoicePreview 
} from '../components/InvoicePreview';
import { 
  PaymentCard 
} from '../components/PaymentCard';
import { 
  ExpenseCard 
} from '../components/ExpenseCard';
import { 
  LedgerCard 
} from '../components/LedgerCard';
import { 
  GSTCard 
} from '../components/GSTCard';
import { 
  TaxSummaryCard 
} from '../components/TaxSummaryCard';
import { 
  FinancialChart 
} from '../components/FinancialChart';

import { 
  Coins, 
  Receipt, 
  Layers, 
  FileText, 
  FolderLock, 
  Sparkles, 
  Plus, 
  X, 
  TrendingUp, 
  ClipboardList, 
  ShieldCheck, 
  Search,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

type ActiveTab = 'dashboard' | 'invoices' | 'payments' | 'expenses' | 'ledger' | 'gst' | 'transactions';

export default function AccountingWorkspace() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  
  // Data State
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [gstData, setGstData] = useState<GSTData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Detail Modal / Forms
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showCreatePayment, setShowCreatePayment] = useState(false);
  const [showCreateExpense, setShowCreateExpense] = useState(false);
  const [showCreateTxn, setShowCreateTxn] = useState(false);

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState('');

  // New Invoice Form State
  const [newInvCustomer, setNewInvCustomer] = useState('');
  const [newInvEmail, setNewInvEmail] = useState('');
  const [newInvGst, setNewInvGst] = useState('');
  const [newInvDesc, setNewInvDesc] = useState('');
  const [newInvRate, setNewInvRate] = useState(10000);
  const [newInvQty, setNewInvQty] = useState(1);
  const [newInvGstRate, setNewInvGstRate] = useState(18);

  // New Payment Form State
  const [newPayInvoice, setNewPayInvoice] = useState('');
  const [newPayCustomer, setNewPayCustomer] = useState('');
  const [newPayAmount, setNewPayAmount] = useState(0);
  const [newPayMethod, setNewPayMethod] = useState('UPI');

  // New Expense Form State
  const [newExpCategory, setNewExpCategory] = useState('Rent');
  const [newExpDesc, setNewExpDesc] = useState('');
  const [newExpAmount, setNewExpAmount] = useState(0);

  // New Transaction Form State
  const [newTxnType, setNewTxnType] = useState<Transaction['type']>('Income');
  const [newTxnCat, setNewTxnCat] = useState('');
  const [newTxnAmount, setNewTxnAmount] = useState(0);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const invs = await invoiceService.getInvoices();
      const pays = await paymentService.getPayments();
      const exps = await expenseService.getExpenses();
      const leds = await ledgerService.getLedgers();
      const gst = await gstService.getGstData();
      const txns = await accountingService.getTransactions();

      setInvoices(invs);
      setPayments(pays);
      setExpenses(exps);
      setLedgers(leds);
      setGstData(gst);
      setTransactions(txns);
    } catch (err) {
      console.error('Error fetching accounting workspace registers', err);
      toast.error('Failed to boot accounting ledgers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Form Handlers
  const handleCreateInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvCustomer || !newInvDesc) {
      toast.error('Customer name and description required');
      return;
    }

    const subTotal = newInvRate * newInvQty;
    const isInterstate = newInvGst.startsWith('27') ? false : true; 
    const gstVal = subTotal * (newInvGstRate / 100);

    const cgst = isInterstate ? 0 : gstVal / 2;
    const sgst = isInterstate ? 0 : gstVal / 2;
    const igst = isInterstate ? gstVal : 0;
    const totalAmount = subTotal + gstVal;

    const body: Omit<Invoice, 'id'> = {
      customerName: newInvCustomer,
      customerEmail: newInvEmail || 'accounts@client.com',
      gstNumber: newInvGst || '27AAACA1122C1Z1',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      subTotal,
      cgst,
      sgst,
      igst,
      totalAmount,
      status: 'Unpaid',
      paymentStatus: 'Pending',
      paymentMethod: 'UPI',
      items: [
        {
          description: newInvDesc,
          quantity: newInvQty,
          rate: newInvRate,
          gstRate: newInvGstRate,
          amount: subTotal
        }
      ],
      timeline: [
        { status: 'Draft', date: new Date().toISOString(), details: 'Created via console panel' }
      ]
    };

    try {
      const created = await invoiceService.createInvoice(body);
      // Create automatic general transaction log
      await accountingService.createTransaction({
        type: 'Income',
        category: 'Product Sale',
        amount: totalAmount,
        date: body.invoiceDate,
        sourceAccount: `Customer - ${body.customerName}`,
        destAccount: 'SBI Corporate Bank Account',
        status: 'Completed'
      });

      toast.success(`Invoice ${created.id} compiled successfully`);
      setShowCreateInvoice(false);
      loadAllData();
      
      // Reset form
      setNewInvCustomer('');
      setNewInvEmail('');
      setNewInvGst('');
      setNewInvDesc('');
      setNewInvRate(10000);
      setNewInvQty(1);
    } catch (err) {
      toast.error('Failed to write invoice');
    }
  };

  const handleCreatePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayCustomer || newPayAmount <= 0) {
      toast.error('Customer name and valid amount required');
      return;
    }

    const body: Omit<Payment, 'id'> = {
      invoiceId: newPayInvoice || 'INV-2026-NUL',
      customerName: newPayCustomer,
      amount: newPayAmount,
      method: newPayMethod,
      status: 'Completed',
      date: new Date().toISOString().split('T')[0],
      notes: 'Payment booked inside accounting desk'
    };

    try {
      await paymentService.createPayment(body);
      
      // Update invoice if matched
      if (newPayInvoice) {
        await invoiceService.updateInvoice(newPayInvoice, {
          status: 'Paid',
          paymentStatus: 'Paid',
          paymentMethod: newPayMethod
        });
      }

      toast.success('Payment voucher recorded');
      setShowCreatePayment(false);
      loadAllData();

      setNewPayCustomer('');
      setNewPayInvoice('');
      setNewPayAmount(0);
    } catch (err) {
      toast.error('Payment ledger update failed');
    }
  };

  const handleCreateExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpDesc || newExpAmount <= 0) {
      toast.error('Valid description and amount required');
      return;
    }

    const gstAmount = Math.round(newExpAmount * 0.18);

    const body: Omit<Expense, 'id'> = {
      category: newExpCategory,
      description: newExpDesc,
      amount: newExpAmount,
      date: new Date().toISOString().split('T')[0],
      status: 'Approved',
      approvedBy: 'Financial Officer',
      gstAmount
    };

    try {
      await expenseService.createExpense(body);
      
      // Auto register operational expense transaction log
      await accountingService.createTransaction({
        type: 'Expense',
        category: newExpCategory,
        amount: newExpAmount,
        date: body.date,
        sourceAccount: 'SBI Corporate Bank Account',
        destAccount: `Vendor - ${newExpCategory}`,
        status: 'Completed'
      });

      toast.success('Corporate expense booked');
      setShowCreateExpense(false);
      loadAllData();

      setNewExpDesc('');
      setNewExpAmount(0);
    } catch (err) {
      toast.error('Expense logging failed');
    }
  };

  const handleCreateTxnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTxnCat || newTxnAmount <= 0) {
      toast.error('Category and positive transaction amount required');
      return;
    }

    const body: Omit<Transaction, 'id'> = {
      type: newTxnType,
      category: newTxnCat,
      amount: newTxnAmount,
      date: new Date().toISOString().split('T')[0],
      sourceAccount: newTxnType === 'Income' ? 'Client Remittance Desk' : 'SBI Corporate Bank Account',
      destAccount: newTxnType === 'Income' ? 'SBI Corporate Bank Account' : 'General Operating Pool',
      status: 'Completed'
    };

    try {
      await accountingService.createTransaction(body);
      toast.success('Double-entry journal transaction recorded');
      setShowCreateTxn(false);
      loadAllData();

      setNewTxnCat('');
      setNewTxnAmount(0);
    } catch (err) {
      toast.error('Transaction log failed');
    }
  };

  const handleInvoiceDelete = async (id: string) => {
    if (confirm(`Wipe invoice ${id} from corporate registers?`)) {
      await invoiceService.deleteInvoice(id);
      toast.success(`Invoice ${id} cleared`);
      loadAllData();
    }
  };

  const handleExpenseApproval = async (id: string) => {
    await expenseService.updateExpense(id, { status: 'Approved', approvedBy: 'Audit Director' });
    toast.success('Operating expense voucher authorized');
    loadAllData();
  };

  const handleExpenseRejection = async (id: string) => {
    await expenseService.updateExpense(id, { status: 'Rejected' });
    toast.error('Voucher rejected');
    loadAllData();
  };

  // Computations
  const totalInvoiced = invoices.reduce((sum, i) => sum + (i.status === 'Paid' ? i.totalAmount : 0), 0);
  const pendingInvoiced = invoices.reduce((sum, i) => sum + (i.status !== 'Paid' ? i.totalAmount : 0), 0);
  const totalExp = expenses.filter(e => e.status === 'Approved').reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalInvoiced - totalExp;

  const currentGstPayable = gstData?.summary.pendingGst || 0;

  // Chart Mappings
  const chartData = [
    { month: 'May 2026', revenue: 1450000, expenses: 750000, profit: 700000 },
    { month: 'Jun 2026', revenue: 1750000, expenses: 980000, profit: 770000 },
    { month: 'Jul 2026', revenue: totalInvoiced + 1500000, expenses: totalExp + 600000, profit: (totalInvoiced + 1500000) - (totalExp + 600000) }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 select-none pb-12">
      
      {/* Header section with modern title pairings */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-5">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-indigo-500 animate-pulse" /> SaaS Financial Audit Console
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">
            Accounting Workspace
          </h1>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowCreateInvoice(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" /> Bill Invoice
          </button>
          <button
            onClick={() => setShowCreateExpense(true)}
            className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <Plus className="w-4 h-4" /> Book Expense
          </button>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex gap-1.5 overflow-x-auto pb-1.5 border-b border-slate-100 dark:border-slate-850">
        {(['dashboard', 'invoices', 'payments', 'expenses', 'ledger', 'gst', 'transactions'] as ActiveTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSearchQuery('');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider font-mono cursor-pointer transition-all border shrink-0
              ${activeTab === tab
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:hover:text-slate-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-xs animate-pulse">
          Computing company balances...
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-6"
          >
            
            {/* TAB CONTENT: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* 4 Dashboard Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl text-left">
                    <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest">Revenue (Invoiced)</span>
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-150 font-mono mt-2">₹{totalInvoiced.toLocaleString()}</h3>
                    <span className="text-[9px] font-mono text-emerald-600 font-bold block mt-1">▲ Net Growth +18.5%</span>
                  </div>
                  <div className="p-5 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl text-left">
                    <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest">Operating Expenses</span>
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-150 font-mono mt-2">₹{totalExp.toLocaleString()}</h3>
                    <span className="text-[9px] font-mono text-slate-400 block mt-1">Within allocated budgets</span>
                  </div>
                  <div className="p-5 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl text-left">
                    <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest">Net Cash Flow Profit</span>
                    <h3 className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-2">₹{netProfit.toLocaleString()}</h3>
                    <span className="text-[9px] font-mono text-emerald-500 font-bold block mt-1">Margin: 47.6%</span>
                  </div>
                  <div className="p-5 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl text-left">
                    <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest">Regulatory GST Balance</span>
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-150 font-mono mt-2">₹{currentGstPayable.toLocaleString()}</h3>
                    <span className="text-[9px] font-mono text-indigo-500 font-bold block mt-1">Filing status: In Progress</span>
                  </div>
                </div>

                {/* Charts and AI Widgets split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Financial graphs */}
                  <div className="lg:col-span-2 space-y-4 text-left">
                    <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-100">
                      Revenue vs Expense Core Outlines
                    </h3>
                    <FinancialChart data={chartData} type="revenue_expense" />
                  </div>

                  {/* AI Financial insights widget */}
                  <div className="space-y-4 text-left">
                    <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-purple-500" /> AI Corporate Insights
                    </h3>
                    
                    <div className="p-5 bg-gradient-to-br from-indigo-950 via-slate-950 to-indigo-900 border border-slate-850 rounded-2xl text-white space-y-4 shadow-lg">
                      <div className="flex justify-between items-center select-none">
                        <span className="text-[9px] font-mono font-black text-indigo-400 uppercase tracking-widest">Liquidity Index</span>
                        <span className="text-xs font-black font-mono text-indigo-300">Strong</span>
                      </div>
                      <div className="space-y-2 text-xs font-light text-slate-300 select-text leading-relaxed">
                        <p>• Cash reserves can cover operational costs for over 18 months.</p>
                        <p>• High margin cloud security licensing sales account for 65% of net profits.</p>
                        <p>• Suggested: Draft purchase orders for low-stock routers to prevent potential delivery SLA violations.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent corporate transfers panel */}
                <div className="space-y-4 text-left">
                  <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-100">
                    Recent Corporate Ledger Postings
                  </h3>
                  <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850/60 rounded-2xl overflow-hidden shadow-2xs">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-850 text-slate-400 font-mono font-bold uppercase select-none text-[10px]">
                          <th className="p-3.5">ID</th>
                          <th className="p-3.5">Type</th>
                          <th className="p-3.5">Category</th>
                          <th className="p-3.5">Source</th>
                          <th className="p-3.5">Gross Amount</th>
                          <th className="p-3.5">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-900 select-text font-mono">
                        {transactions.slice(0, 4).map((txn) => (
                          <tr key={txn.id} className="hover:bg-slate-50/50">
                            <td className="p-3.5 font-black text-indigo-500">{txn.id}</td>
                            <td className="p-3.5">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border
                                ${txn.type === 'Income' 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                  : 'bg-rose-50 text-rose-500 border-rose-100'}`}
                              >
                                {txn.type}
                              </span>
                            </td>
                            <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300">{txn.category}</td>
                            <td className="p-3.5 text-slate-500 truncate max-w-[150px]">{txn.sourceAccount}</td>
                            <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">₹{txn.amount.toLocaleString()}</td>
                            <td className="p-3.5 text-slate-400">{txn.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: INVOICES */}
            {activeTab === 'invoices' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center select-none bg-white p-4 border rounded-2xl">
                  <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search Client Invoices..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/40"
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Records Count: {invoices.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {invoices
                    .filter(i => i.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((inv) => (
                      <InvoiceCard
                        key={inv.id}
                        invoice={inv}
                        onView={(id) => setSelectedInvoice(inv)}
                        onDelete={handleInvoiceDelete}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: PAYMENTS */}
            {activeTab === 'payments' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center select-none bg-white p-4 border rounded-2xl">
                  <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search Client Payments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/40"
                    />
                  </div>
                  <button
                    onClick={() => setShowCreatePayment(true)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Book Payment
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {payments
                    .filter(p => p.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((pay) => (
                      <PaymentCard
                        key={pay.id}
                        payment={pay}
                        onView={(id) => toast.info(`Remittance Reference Code: ${pay.referenceNo || 'None'}`)}
                        onRefund={(id) => toast.success('Refund voucher initiated')}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: EXPENSES */}
            {activeTab === 'expenses' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center select-none bg-white p-4 border rounded-2xl">
                  <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search Operational Expenses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/40"
                    />
                  </div>
                  <button
                    onClick={() => setShowCreateExpense(true)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Book Expense
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {expenses
                    .filter(e => e.description.toLowerCase().includes(searchQuery.toLowerCase()) || e.category.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((exp) => (
                      <ExpenseCard
                        key={exp.id}
                        expense={exp}
                        onApprove={handleExpenseApproval}
                        onReject={handleExpenseRejection}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: LEDGER */}
            {activeTab === 'ledger' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ledgers.map((led) => (
                  <LedgerCard key={led.id} ledger={led} />
                ))}
              </div>
            )}

            {/* TAB CONTENT: GST REGULATORY */}
            {activeTab === 'gst' && (
              <div className="space-y-6">
                {gstData && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <TaxSummaryCard summary={gstData.summary} />
                    </div>
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {gstData.filings.map((filing, idx) => (
                        <GSTCard key={idx} filing={filing} />
                      ))}
                    </div>
                  </div>
                )}

                {/* HSN Code Summary list */}
                <div className="space-y-4 text-left">
                  <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-100">
                    Compliant HSN Code Audit Trails
                  </h3>
                  <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850/60 rounded-2xl overflow-hidden shadow-2xs">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-850 text-slate-400 font-mono font-bold uppercase select-none text-[10px]">
                          <th className="p-3.5">HSN Code</th>
                          <th className="p-3.5">Material Category description</th>
                          <th className="p-3.5">Gross Taxable Value</th>
                          <th className="p-3.5">Regulatory GST Rate</th>
                          <th className="p-3.5">Allocated Tax Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-900 select-text font-mono">
                        {gstData?.hsnSummary.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-3.5 font-black text-indigo-500">{item.hsnCode}</td>
                            <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">{item.description}</td>
                            <td className="p-3.5">₹{item.value.toLocaleString()}</td>
                            <td className="p-3.5 text-slate-500">{item.gstRate}%</td>
                            <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">₹{item.tax.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: TRANSACTIONS */}
            {activeTab === 'transactions' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center select-none bg-white p-4 border rounded-2xl">
                  <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search Double Entry Logs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/40"
                    />
                  </div>
                  <button
                    onClick={() => setShowCreateTxn(true)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Book Journal Entry
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850/60 rounded-2xl overflow-hidden shadow-2xs text-left">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-850 text-slate-400 font-mono font-bold uppercase select-none text-[10px]">
                        <th className="p-3.5">Transaction ID</th>
                        <th className="p-3.5">Type</th>
                        <th className="p-3.5">Category description</th>
                        <th className="p-3.5">Origin Ledger</th>
                        <th className="p-3.5">Destination Ledger</th>
                        <th className="p-3.5">Amount</th>
                        <th className="p-3.5">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-900 select-text font-mono">
                      {transactions
                        .filter(t => t.category.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((txn) => (
                          <tr key={txn.id} className="hover:bg-slate-50/50">
                            <td className="p-3.5 font-black text-indigo-500">{txn.id}</td>
                            <td className="p-3.5">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border
                                ${txn.type === 'Income' 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                  : 'bg-rose-50 text-rose-500 border-rose-100'}`}
                              >
                                {txn.type}
                              </span>
                            </td>
                            <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300">{txn.category}</td>
                            <td className="p-3.5 text-slate-500">{txn.sourceAccount}</td>
                            <td className="p-3.5 text-slate-500">{txn.destAccount}</td>
                            <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">₹{txn.amount.toLocaleString()}</td>
                            <td className="p-3.5 text-slate-400">{txn.date}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      )}

      {/* MODAL WINDOWS */}
      
      {/* 1. Invoice Detail Viewer */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-4xl"
          >
            <InvoicePreview 
              invoice={selectedInvoice} 
              onClose={() => setSelectedInvoice(null)} 
            />
          </motion.div>
        </div>
      )}

      {/* 2. Bill Invoice Form */}
      {showCreateInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-white rounded-3xl p-6 border text-left shadow-2xl relative"
          >
            <button 
              onClick={() => setShowCreateInvoice(false)} 
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-base font-black uppercase font-mono tracking-wider text-slate-800 mb-4 flex items-center gap-1.5">
              <FileText className="w-5 h-5 text-indigo-500" /> Compile Sales Invoice
            </h3>

            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[8px] uppercase text-slate-400 font-bold mb-1">Customer Account Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corporation"
                  value={newInvCustomer}
                  onChange={(e) => setNewInvCustomer(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[8px] uppercase text-slate-400 font-bold mb-1">Customer Email</label>
                  <input
                    type="email"
                    placeholder="accounts@client.com"
                    value={newInvEmail}
                    onChange={(e) => setNewInvEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase text-slate-400 font-bold mb-1">Client GSTIN</label>
                  <input
                    type="text"
                    placeholder="27AAACA1234A1Z1"
                    value={newInvGst}
                    onChange={(e) => setNewInvGst(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[8px] uppercase text-slate-400 font-bold mb-1">Service Description</label>
                <input
                  type="text"
                  required
                  placeholder="Enterprise Servers deployment support"
                  value={newInvDesc}
                  onChange={(e) => setNewInvDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[8px] uppercase text-slate-400 font-bold mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newInvQty}
                    onChange={(e) => setNewInvQty(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase text-slate-400 font-bold mb-1">Rate (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newInvRate}
                    onChange={(e) => setNewInvRate(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase text-slate-400 font-bold mb-1">GST Rate %</label>
                  <select
                    value={newInvGstRate}
                    onChange={(e) => setNewInvGstRate(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/50 font-bold"
                  >
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18% (Standard)</option>
                    <option value="28">28%</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer mt-2"
              >
                Compile Invoice
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 3. Book Payment Form */}
      {showCreatePayment && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white rounded-3xl p-6 border text-left shadow-2xl relative"
          >
            <button 
              onClick={() => setShowCreatePayment(false)} 
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-base font-black uppercase font-mono tracking-wider text-slate-800 mb-4 flex items-center gap-1.5">
              <Coins className="w-5 h-5 text-indigo-500" /> Book Client Remittance
            </h3>

            <form onSubmit={handleCreatePaymentSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[8px] uppercase text-slate-400 font-bold mb-1">Match Invoice ID (Optional)</label>
                <select
                  value={newPayInvoice}
                  onChange={(e) => {
                    setNewPayInvoice(e.target.value);
                    const inv = invoices.find(i => i.id === e.target.value);
                    if (inv) {
                      setNewPayCustomer(inv.customerName);
                      setNewPayAmount(inv.totalAmount);
                    }
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/50 font-bold"
                >
                  <option value="">Select Invoice...</option>
                  {invoices.filter(i => i.status !== 'Paid').map(i => (
                    <option key={i.id} value={i.id}>{i.id} - {i.customerName} (₹{i.totalAmount.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[8px] uppercase text-slate-400 font-bold mb-1">Customer Account Name</label>
                <input
                  type="text"
                  required
                  placeholder="Acme Corp"
                  value={newPayCustomer}
                  onChange={(e) => setNewPayCustomer(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[8px] uppercase text-slate-400 font-bold mb-1">Remittance Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={newPayAmount}
                    onChange={(e) => setNewPayAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase text-slate-400 font-bold mb-1">Channel Method</label>
                  <select
                    value={newPayMethod}
                    onChange={(e) => setNewPayMethod(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/50 font-bold"
                  >
                    <option value="UPI">UPI Transfer</option>
                    <option value="NetBanking">NetBanking</option>
                    <option value="Bank Transfer">Direct Wire</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer mt-2"
              >
                Record Payment Voucher
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 4. Book Expense Form */}
      {showCreateExpense && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white rounded-3xl p-6 border text-left shadow-2xl relative"
          >
            <button 
              onClick={() => setShowCreateExpense(false)} 
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-base font-black uppercase font-mono tracking-wider text-slate-800 mb-4 flex items-center gap-1.5">
              <Receipt className="w-5 h-5 text-indigo-500" /> Book Expense Voucher
            </h3>

            <form onSubmit={handleCreateExpenseSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[8px] uppercase text-slate-400 font-bold mb-1">Category Head</label>
                <select
                  value={newExpCategory}
                  onChange={(e) => setNewExpCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/50 font-bold"
                >
                  <option value="Rent">Office Space Rent</option>
                  <option value="Salaries">Core R&D Salaries</option>
                  <option value="Utilities">Broadbands & Power Utilities</option>
                  <option value="Marketing">Ads Promotions</option>
                  <option value="Software License">API & Software Licenses</option>
                </select>
              </div>

              <div>
                <label className="block text-[8px] uppercase text-slate-400 font-bold mb-1">Voucher Description</label>
                <input
                  type="text"
                  required
                  placeholder="Broadband leased line billing invoice"
                  value={newExpDesc}
                  onChange={(e) => setNewExpDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-[8px] uppercase text-slate-400 font-bold mb-1">Gross Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={newExpAmount}
                  onChange={(e) => setNewExpAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer mt-2"
              >
                Book Expense Account
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 5. Book Journal Entry Form */}
      {showCreateTxn && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white rounded-3xl p-6 border text-left shadow-2xl relative"
          >
            <button 
              onClick={() => setShowCreateTxn(false)} 
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-base font-black uppercase font-mono tracking-wider text-slate-800 mb-4 flex items-center gap-1.5">
              <BookOpen className="w-5 h-5 text-indigo-500" /> Book Double-Entry Journal
            </h3>

            <form onSubmit={handleCreateTxnSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[8px] uppercase text-slate-400 font-bold mb-1">Log Type</label>
                  <select
                    value={newTxnType}
                    onChange={(e) => setNewTxnType(e.target.value as Transaction['type'])}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/50 font-bold"
                  >
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                    <option value="Transfer">Account Transfer</option>
                    <option value="Journal Entry">Journal Entry Adjustment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[8px] uppercase text-slate-400 font-bold mb-1">Category</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Equity Adjustment"
                    value={newTxnCat}
                    onChange={(e) => setNewTxnCat(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[8px] uppercase text-slate-400 font-bold mb-1">Gross Entry Value (₹)</label>
                <input
                  type="number"
                  required
                  value={newTxnAmount}
                  onChange={(e) => setNewTxnAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer mt-2"
              >
                Log Journal Voucher
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
