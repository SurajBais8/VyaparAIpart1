import { Expense } from '../../../types/accounting';
import expensesMock from '../../../mock/expenses.json';

const STORAGE_KEY = 'crm_v3_expenses';

export const expenseService = {
  getExpenses: async (): Promise<Expense[]> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expensesMock));
    return expensesMock as Expense[];
  },

  createExpense: async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
    const list = await expenseService.getExpenses();
    const newId = `EXP-2026-${String(list.length + 1).padStart(3, '0')}`;
    const newExpense: Expense = {
      ...expense,
      id: newId
    };
    list.unshift(newExpense);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newExpense;
  },

  updateExpense: async (id: string, updates: Partial<Expense>): Promise<Expense> => {
    const list = await expenseService.getExpenses();
    const idx = list.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Expense not found');
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list[idx];
  },

  deleteExpense: async (id: string): Promise<void> => {
    const list = await expenseService.getExpenses();
    const filtered = list.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
