/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import attendanceJson from '../../../mock/attendance.json';
import { Attendance } from '../../../types/hr';

const STORAGE_KEY = 'saas-hr-attendance';

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attendanceJson));
  }
};

export const attendanceService = {
  getAttendance: async (): Promise<Attendance[]> => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  getAttendanceByEmployeeId: async (employeeId: string): Promise<Attendance[]> => {
    const list = await attendanceService.getAttendance();
    return list.filter((a) => a.employeeId === employeeId);
  },

  checkIn: async (employeeId: string, employeeName: string, department: string, time: string = '09:00'): Promise<Attendance> => {
    initLocalStorage();
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Check if check-in already exists
    const existingIdx = list.findIndex((a: Attendance) => a.employeeId === employeeId && a.date === todayStr);
    
    let record: Attendance;
    const isLate = parseInt(time.split(':')[0]) >= 9 && parseInt(time.split(':')[1]) > 15;
    
    if (existingIdx !== -1) {
      list[existingIdx].checkIn = time;
      list[existingIdx].status = isLate ? 'Late' : 'Present';
      record = list[existingIdx];
    } else {
      record = {
        id: `ATT-${String(list.length + 1).padStart(3, '0')}`,
        employeeId,
        employeeName,
        department,
        date: todayStr,
        checkIn: time,
        checkOut: '',
        status: isLate ? 'Late' : 'Present',
        overtimeHours: 0,
        workHours: 0
      };
      list.unshift(record);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return record;
  },

  checkOut: async (employeeId: string, time: string = '18:00'): Promise<Attendance | null> => {
    initLocalStorage();
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const todayStr = new Date().toISOString().split('T')[0];
    
    const idx = list.findIndex((a: Attendance) => a.employeeId === employeeId && a.date === todayStr);
    if (idx !== -1) {
      list[idx].checkOut = time;
      
      // Calculate work hours
      const checkInTime = list[idx].checkIn || '09:00';
      const [inH, inM] = checkInTime.split(':').map(Number);
      const [outH, outM] = time.split(':').map(Number);
      
      const totalHours = (outH + outM/60) - (inH + inM/60);
      list[idx].workHours = Math.max(0, parseFloat(totalHours.toFixed(1)));
      
      // Overtime (> 9 hours)
      if (totalHours > 9) {
        list[idx].overtimeHours = parseFloat((totalHours - 9).toFixed(1));
      } else {
        list[idx].overtimeHours = 0;
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return list[idx];
    }
    return null;
  },

  updateAttendance: async (id: string, data: Partial<Attendance>): Promise<Attendance | null> => {
    initLocalStorage();
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const idx = list.findIndex((a: Attendance) => a.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return list[idx];
    }
    return null;
  }
};
