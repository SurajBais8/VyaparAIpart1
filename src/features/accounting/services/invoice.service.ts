import { Invoice } from '../../../types/accounting';
import invoicesMock from '../../../mock/invoices.json';

const STORAGE_KEY = 'crm_v3_invoices';

export const invoiceService = {
  getInvoices: async (): Promise<Invoice[]> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with mock
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoicesMock));
    return invoicesMock as Invoice[];
  },

  getInvoiceById: async (id: string): Promise<Invoice | null> => {
    const list = await invoiceService.getInvoices();
    return list.find(inv => inv.id === id) || null;
  },

  createInvoice: async (invoice: Omit<Invoice, 'id'>): Promise<Invoice> => {
    const list = await invoiceService.getInvoices();
    const newId = `INV-2026-${String(list.length + 1).padStart(3, '0')}`;
    const newInvoice: Invoice = {
      ...invoice,
      id: newId
    };
    list.unshift(newInvoice);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newInvoice;
  },

  updateInvoice: async (id: string, updates: Partial<Invoice>): Promise<Invoice> => {
    const list = await invoiceService.getInvoices();
    const idx = list.findIndex(inv => inv.id === id);
    if (idx === -1) throw new Error('Invoice not found');
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list[idx];
  },

  deleteInvoice: async (id: string): Promise<void> => {
    const list = await invoiceService.getInvoices();
    const filtered = list.filter(inv => inv.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
