/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EmployeePersonalInfo {
  dob: string;
  gender: string;
  maritalStatus: string;
  pan: string;
  aadhaar: string;
  address: string;
}

export interface EmployeeJobDetails {
  manager: string;
  workLocation: string;
  probationPeriod: string;
  noticePeriod: string;
}

export interface EmployeeDocument {
  name: string;
  uploadedAt: string;
  size: string;
  url: string;
}

export interface EmployeeNote {
  id: string;
  author: string;
  date: string;
  text: string;
}

export interface Employee {
  id: string;
  name: string;
  photo: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  joiningDate: string;
  employmentType: string;
  status: 'Active' | 'On Leave' | 'Terminated' | 'Suspended';
  personalInfo: EmployeePersonalInfo;
  jobDetails: EmployeeJobDetails;
  documents: EmployeeDocument[];
  notes: EmployeeNote[];
  performanceRating: number;
  salary: number;
  aiSummary: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Absent' | 'Late' | 'On Leave';
  overtimeHours: number;
  workHours: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  bonus: number;
  tax: number;
  netPayable: number;
  status: 'Paid' | 'Pending' | 'Processing';
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
  budget: number;
  performance: number; // 0 - 100
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  status: 'Open' | 'Closed';
  experience: string;
  location: string;
  candidatesCount: number;
  postedDate: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobId: string;
  jobTitle: string;
  experience: string;
  stage: 'Applied' | 'HR Screening' | 'Technical Round' | 'Management Interview' | 'Offered' | 'Rejected';
  appliedDate: string;
  resume: string;
  notes: EmployeeNote[];
  documents: { name: string; uploadedAt: string; size: string }[];
  aiEvaluation: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  reviewer: string;
  reviewPeriod: string;
  rating: number;
  selfRating: number;
  strengths: string;
  improvements: string;
  status: 'Completed' | 'Draft';
}

export interface PerformanceGoal {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  targetDate: string;
  progress: number; // 0 - 100
  status: 'Not Started' | 'On Track' | 'Ahead' | 'Delayed' | 'Completed';
}

export interface Promotion {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  currentDesignation: string;
  proposedDesignation: string;
  justification: string;
  status: 'Pending Review' | 'Approved' | 'Rejected';
  effectiveDate: string;
}

export interface HRDashboardSummary {
  totalEmployees: number;
  activeEmployees: number;
  newJoiners: number;
  onLeave: number;
  attendanceToday: number; // % present
  payrollPending: number; // count of pending payrolls
  openJobs: number;
  departmentCount: number;
}
