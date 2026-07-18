import { Payment } from '../../../types/accounting';
import paymentsMock from '../../../mock/payments.json';

const STORAGE_KEY = 'crm_v3_payments';

export const paymentService = {
  getPayments: async (): Promise<Payment[]> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(paymentsMock));
    return paymentsMock as Payment[];
  },

  getPaymentById: async (id: string): Promise<Payment | null> => {
    const list = await paymentService.getPayments();
    return list.find(pay => pay.id === id) || null;
  },

  createPayment: async (payment: Omit<Payment, 'id'>): Promise<Payment> => {
    const list = await paymentService.getPayments();
    const newId = `PAY-${list.length + 1001}`;
    const newPayment: Payment = {
      ...payment,
      id: newId
    };
    list.unshift(newPayment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newPayment;
  },

  updatePayment: async (id: string, updates: Partial<Payment>): Promise<Payment> => {
    const list = await paymentService.getPayments();
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Payment not found');
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list[idx];
  },

  deletePayment: async (id: string): Promise<void> => {
    const list = await paymentService.getPayments();
    const filtered = list.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
