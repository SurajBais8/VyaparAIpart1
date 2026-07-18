import { Transaction } from '../../../types/accounting';
import transactionsMock from '../../../mock/transactions.json';

const STORAGE_KEY = 'crm_v3_transactions';

export const accountingService = {
  getTransactions: async (): Promise<Transaction[]> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactionsMock));
    return transactionsMock as Transaction[];
  },

  createTransaction: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const list = await accountingService.getTransactions();
    const newId = `TXN-2026-${String(list.length + 1).padStart(3, '0')}`;
    const newTxn: Transaction = {
      ...transaction,
      id: newId
    };
    list.unshift(newTxn);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newTxn;
  },

  updateTransaction: async (id: string, updates: Partial<Transaction>): Promise<Transaction> => {
    const list = await accountingService.getTransactions();
    const idx = list.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Transaction not found');
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list[idx];
  },

  deleteTransaction: async (id: string): Promise<void> => {
    const list = await accountingService.getTransactions();
    const filtered = list.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
