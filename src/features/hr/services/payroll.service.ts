/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import payrollJson from '../../../mock/payroll.json';
import { Payroll } from '../../../types/hr';

const STORAGE_KEY = 'saas-hr-payroll';

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payrollJson));
  }
};

export const payrollService = {
  getPayrollRecords: async (): Promise<Payroll[]> => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  getPayrollByEmployeeId: async (employeeId: string): Promise<Payroll[]> => {
    const list = await payrollService.getPayrollRecords();
    return list.filter((p) => p.employeeId === employeeId);
  },

  updatePayrollRecord: async (id: string, data: Partial<Payroll>): Promise<Payroll | null> => {
    initLocalStorage();
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const idx = list.findIndex((p: Payroll) => p.id === id);
    if (idx !== -1) {
      const basic = data.basicSalary ?? list[idx].basicSalary;
      const allowances = data.allowances ?? list[idx].allowances;
      const bonus = data.bonus ?? list[idx].bonus;
      const deductions = data.deductions ?? list[idx].deductions;
      const tax = data.tax ?? list[idx].tax;
      
      const netPayable = basic + allowances + bonus - deductions - tax;
      
      list[idx] = { 
        ...list[idx], 
        ...data,
        basicSalary: basic,
        allowances,
        bonus,
        deductions,
        tax,
        netPayable: parseFloat(netPayable.toFixed(2))
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return list[idx];
    }
    return null;
  },

  createPayrollRecord: async (record: Partial<Payroll>): Promise<Payroll> => {
    initLocalStorage();
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    const basic = record.basicSalary || 50000;
    const allowances = record.allowances || 0;
    const bonus = record.bonus || 0;
    const deductions = record.deductions || 0;
    const tax = record.tax || 0;
    const netPayable = basic + allowances + bonus - deductions - tax;

    const newRecord: Payroll = {
      id: `PAY-${String(list.length + 1).padStart(3, '0')}`,
      employeeId: record.employeeId || 'EMP-001',
      employeeName: record.employeeName || 'Unknown',
      department: record.department || 'Engineering',
      month: record.month || 'July 2026',
      basicSalary: basic,
      allowances,
      deductions,
      bonus,
      tax,
      netPayable: parseFloat(netPayable.toFixed(2)),
      status: record.status || 'Pending'
    };

    list.unshift(newRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newRecord;
  },

  bulkPaySalary: async (ids: string[]): Promise<boolean> => {
    initLocalStorage();
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = list.map((p: Payroll) => {
      if (ids.includes(p.id)) {
        return { ...p, status: 'Paid' };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  }
};
