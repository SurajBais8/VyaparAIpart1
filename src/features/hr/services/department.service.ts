/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import departmentsJson from '../../../mock/departments.json';
import { Department } from '../../../types/hr';

const STORAGE_KEY = 'saas-hr-departments';

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(departmentsJson));
  }
};

export const departmentService = {
  getDepartments: async (): Promise<Department[]> => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  getDepartmentById: async (id: string): Promise<Department | null> => {
    const list = await departmentService.getDepartments();
    return list.find((d) => d.id === id) || null;
  },

  createDepartment: async (dept: Partial<Department>): Promise<Department> => {
    initLocalStorage();
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    const newDept: Department = {
      id: `DEP-${String(list.length + 1).padStart(3, '0')}`,
      name: dept.name || 'New Department',
      manager: dept.manager || 'N/A',
      employeeCount: dept.employeeCount || 0,
      budget: dept.budget || 1000000,
      performance: dept.performance || 85
    };

    list.push(newDept);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newDept;
  },

  updateDepartment: async (id: string, data: Partial<Department>): Promise<Department | null> => {
    initLocalStorage();
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const idx = list.findIndex((d: Department) => d.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return list[idx];
    }
    return null;
  }
};
