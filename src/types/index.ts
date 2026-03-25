export type Role = 'SuperAdmin' | 'HRAdmin' | 'Manager' | 'Employee';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  departmentId?: string;
}

// Backend uses integers for IDs
export interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  joiningDate: string;
  profilePhotoUrl?: string;
  status: string;
  departmentId: number;
  departmentName: string;
  designationId?: number;
  designationTitle?: string;
  reportingManagerId?: number;
  reportingManagerName?: string;
  userId?: number;
  salary?: number;
  createdAt?: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  headId?: number;
  headName?: string;
  employeeCount?: number;
}

export interface Designation {
  id: number;
  title: string;
  departmentId: number;
  departmentName?: string;
  level: number;
}

export interface AttendanceRecord {
  id: number;
  employeeId: number;
  employeeName?: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  status: string;
  totalHours?: number;
}

export interface LeaveApplication {
  id: number;
  employeeId: number;
  employeeName?: string;
  leaveTypeId: number;
  leaveTypeName?: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  approvedBy?: string;
  approvedByName?: string;
  comments?: string;
  days: number;
  createdAt?: string;
}

export interface LeaveType {
  id: number;
  name: string;
  description?: string;
  maxDays: number;
  isActive: boolean;
}

export interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  remaining: number;
}

export interface PayrollRecord {
  id: number;
  employeeId: number;
  employeeName?: string;
  month: string;
  year: number;
  basic: number;
  hra: number;
  da: number;
  ta: number;
  otherAllowances: number;
  pf: number;
  tax: number;
  otherDeductions: number;
  grossSalary: number;
  netSalary: number;
  status: string;
}

export interface SalaryStructure {
  id: number;
  employeeId: number;
  basic: number;
  hra: number;
  da: number;
  ta: number;
  otherAllowances: number;
  pf: number;
  tax: number;
}

export interface PerformanceGoal {
  id: number;
  employeeId: number;
  title: string;
  description: string;
  progress: number;
  status: string;
  dueDate: string;
}

export interface PerformanceReview {
  id: number;
  employeeId: number;
  employeeName?: string;
  reviewerId: number;
  reviewerName?: string;
  period: string;
  rating: number;
  comments: string;
  selfComments?: string;
  status: string;
  createdAt: string;
}

export interface Activity {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  userId: number;
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  pendingLeaves: number;
  totalPayroll: number;
  attendanceRate: number;
}

export interface SidebarItem {
  title: string;
  icon: string;
  path: string;
  roles: Role[];
  badge?: number;
}