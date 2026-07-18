/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  gstRate: number;
  amount: number;
}

export interface InvoiceTimelineItem {
  status: string;
  date: string;
  details: string;
}

export interface Invoice {
  id: string;
  customerName: string;
  customerEmail: string;
  gstNumber: string;
  invoiceDate: string;
  dueDate: string;
  subTotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  status: 'Draft' | 'Paid' | 'Unpaid' | 'Overdue' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending' | 'Unpaid' | 'Failed';
  paymentMethod: string;
  items: InvoiceItem[];
  timeline: InvoiceTimelineItem[];
  notes?: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  customerName: string;
  amount: number;
  method: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  date: string;
  referenceNo?: string;
  notes?: string;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  status: 'Approved' | 'Pending Approval' | 'Rejected';
  approvedBy?: string;
  receipt?: string;
  gstAmount: number;
}

export interface Ledger {
  id: string;
  name: string;
  type: 'General Ledger' | 'Customer Ledger' | 'Supplier Ledger' | 'Cash Ledger' | 'Bank Ledger';
  balance: number;
  debit: number;
  credit: number;
  lastUpdated: string;
  description: string;
}

export interface GSTSummary {
  gstCollected: number;
  gstPaid: number;
  pendingGst: number;
  filingStatus: string;
}

export interface GSTFiling {
  period: string;
  gstr1Status: string;
  gstr1Date: string;
  gstr2Status: string;
  gstr2Date: string;
  gstr3bStatus: string;
  gstr3bDate: string;
  taxCollected: number;
  taxPaid: number;
  netLiability: number;
}

export interface HsnSummaryItem {
  hsnCode: string;
  description: string;
  value: number;
  gstRate: number;
  tax: number;
}

export interface GSTData {
  summary: GSTSummary;
  filings: GSTFiling[];
  hsnSummary: HsnSummaryItem[];
}

export interface Transaction {
  id: string;
  type: 'Income' | 'Expense' | 'Transfer' | 'Refund' | 'Journal Entry';
  category: string;
  amount: number;
  date: string;
  sourceAccount: string;
  destAccount: string;
  status: string;
}
