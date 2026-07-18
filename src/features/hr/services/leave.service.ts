/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import leaveRequestsJson from '../../../mock/leaveRequests.json';
import { LeaveRequest } from '../../../types/hr';

const STORAGE_KEY = 'saas-hr-leave';

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leaveRequestsJson));
  }
};

export const leaveService = {
  getLeaveRequests: async (): Promise<LeaveRequest[]> => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  getLeaveRequestsByEmployeeId: async (employeeId: string): Promise<LeaveRequest[]> => {
    const list = await leaveService.getLeaveRequests();
    return list.filter((l) => l.employeeId === employeeId);
  },

  createLeaveRequest: async (req: Partial<LeaveRequest>): Promise<LeaveRequest> => {
    initLocalStorage();
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    // Calculate days between dates
    let days = 1;
    if (req.startDate && req.endDate) {
      const start = new Date(req.startDate);
      const end = new Date(req.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    const newRequest: LeaveRequest = {
      id: `LR-${String(list.length + 1).padStart(3, '0')}`,
      employeeId: req.employeeId || 'EMP-UNKNOWN',
      employeeName: req.employeeName || 'Unknown Employee',
      department: req.department || 'General',
      leaveType: req.leaveType || 'Casual Leave',
      startDate: req.startDate || new Date().toISOString().split('T')[0],
      endDate: req.endDate || new Date().toISOString().split('T')[0],
      days: req.days || days,
      reason: req.reason || 'Personal reasons',
      status: 'Pending'
    };

    list.unshift(newRequest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newRequest;
  },

  updateLeaveRequestStatus: async (id: string, status: LeaveRequest['status']): Promise<LeaveRequest | null> => {
    initLocalStorage();
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const idx = list.findIndex((l: LeaveRequest) => l.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return list[idx];
    }
    return null;
  }
};
