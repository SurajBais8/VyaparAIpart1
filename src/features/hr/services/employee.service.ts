/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import employeesJson from '../../../mock/employees.json';
import { Employee } from '../../../types/hr';

const STORAGE_KEY = 'saas-hr-employees';

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employeesJson));
  }
};

export const employeeService = {
  getEmployees: async (): Promise<Employee[]> => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  getEmployeeById: async (id: string): Promise<Employee | null> => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 50));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return list.find((e: Employee) => e.id === id) || null;
  },

  createEmployee: async (employee: Partial<Employee>): Promise<Employee> => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 150));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    const newId = `EMP-${String(list.length + 1).padStart(3, '0')}`;
    const newEmployee: Employee = {
      id: newId,
      name: employee.name || 'New Employee',
      photo: employee.photo || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
      department: employee.department || 'Engineering',
      designation: employee.designation || 'Associate',
      email: employee.email || `${newId.toLowerCase()}@enterprise.com`,
      phone: employee.phone || '+91 00000 00000',
      joiningDate: employee.joiningDate || new Date().toISOString().split('T')[0],
      employmentType: employee.employmentType || 'Full-time',
      status: employee.status || 'Active',
      personalInfo: {
        dob: employee.personalInfo?.dob || '1995-01-01',
        gender: employee.personalInfo?.gender || 'Male',
        maritalStatus: employee.personalInfo?.maritalStatus || 'Single',
        pan: employee.personalInfo?.pan || 'ABCDE1234F',
        aadhaar: employee.personalInfo?.aadhaar || '0000-0000-0000',
        address: employee.personalInfo?.address || 'N/A'
      },
      jobDetails: {
        manager: employee.jobDetails?.manager || 'HR Manager',
        workLocation: employee.jobDetails?.workLocation || 'Office',
        probationPeriod: employee.jobDetails?.probationPeriod || 'Completed',
        noticePeriod: employee.jobDetails?.noticePeriod || '60 Days'
      },
      documents: employee.documents || [],
      notes: employee.notes || [],
      performanceRating: employee.performanceRating || 4.0,
      salary: employee.salary || 50000,
      aiSummary: employee.aiSummary || 'A fresh addition to the team. Active learning is ongoing.'
    };

    list.unshift(newEmployee);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newEmployee;
  },

  updateEmployee: async (id: string, data: Partial<Employee>): Promise<Employee | null> => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const idx = list.findIndex((e: Employee) => e.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return list[idx];
    }
    return null;
  },

  deleteEmployee: async (id: string): Promise<boolean> => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = list.filter((e: Employee) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  bulkDelete: async (ids: string[]): Promise<boolean> => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = list.filter((e: Employee) => !ids.includes(e.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  bulkAssignDepartment: async (ids: string[], department: string): Promise<boolean> => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = list.map((e: Employee) => {
      if (ids.includes(e.id)) {
        return { ...e, department };
      }
      return e;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  },

  bulkChangeStatus: async (ids: string[], status: Employee['status']): Promise<boolean> => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = list.map((e: Employee) => {
      if (ids.includes(e.id)) {
        return { ...e, status };
      }
      return e;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  }
};
