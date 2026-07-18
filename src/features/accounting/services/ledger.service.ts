import { Ledger } from '../../../types/accounting';
import ledgerMock from '../../../mock/ledger.json';

const STORAGE_KEY = 'crm_v3_ledgers';

export const ledgerService = {
  getLedgers: async (): Promise<Ledger[]> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ledgerMock));
    return ledgerMock as Ledger[];
  },

  createLedger: async (ledger: Omit<Ledger, 'id'>): Promise<Ledger> => {
    const list = await ledgerService.getLedgers();
    const newId = `LED-${String(list.length + 1).padStart(3, '0')}`;
    const newLedger: Ledger = {
      ...ledger,
      id: newId
    };
    list.push(newLedger);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newLedger;
  },

  updateLedger: async (id: string, updates: Partial<Ledger>): Promise<Ledger> => {
    const list = await ledgerService.getLedgers();
    const idx = list.findIndex(l => l.id === id);
    if (idx === -1) throw new Error('Ledger not found');
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list[idx];
  }
};
