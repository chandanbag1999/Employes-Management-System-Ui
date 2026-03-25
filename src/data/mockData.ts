import type { Employee, Department, Designation, AttendanceRecord, LeaveRequest, LeaveBalance, PayrollRecord, PerformanceGoal, PerformanceReview, Activity, DashboardStats } from '@/types';

export const mockDepartments: Department[] = [
  { id: 'dept-1', name: 'Engineering', description: 'Software development team', headName: 'James Wilson', employeeCount: 42 },
  { id: 'dept-2', name: 'Human Resources', description: 'People management', headName: 'Sarah Chen', employeeCount: 12 },
  { id: 'dept-3', name: 'Marketing', description: 'Brand & growth', headName: 'Lisa Park', employeeCount: 18 },
  { id: 'dept-4', name: 'Finance', description: 'Accounting & finance', headName: 'Robert Kim', employeeCount: 15 },
  { id: 'dept-5', name: 'Operations', description: 'Business operations', headName: 'Mike Brown', employeeCount: 22 },
  { id: 'dept-6', name: 'Design', description: 'UI/UX and product design', headName: 'Anna Lee', employeeCount: 10 },
];

export const mockDesignations: Designation[] = [
  { id: 'des-1', name: 'Software Engineer', departmentId: 'dept-1', departmentName: 'Engineering', level: 2 },
  { id: 'des-2', name: 'Senior Software Engineer', departmentId: 'dept-1', departmentName: 'Engineering', level: 3 },
  { id: 'des-3', name: 'Tech Lead', departmentId: 'dept-1', departmentName: 'Engineering', level: 4 },
  { id: 'des-4', name: 'HR Executive', departmentId: 'dept-2', departmentName: 'Human Resources', level: 2 },
  { id: 'des-5', name: 'Marketing Manager', departmentId: 'dept-3', departmentName: 'Marketing', level: 3 },
  { id: 'des-6', name: 'Financial Analyst', departmentId: 'dept-4', departmentName: 'Finance', level: 2 },
  { id: 'des-7', name: 'UX Designer', departmentId: 'dept-6', departmentName: 'Design', level: 2 },
];

export const mockEmployees: Employee[] = [
  { id: 'emp-1', employeeCode: 'EMP001', firstName: 'Emily', lastName: 'Davis', email: 'emily@ems.com', phone: '+1-555-0101', departmentId: 'dept-1', departmentName: 'Engineering', designationId: 'des-2', designationName: 'Senior Software Engineer', dateOfJoining: '2022-03-15', status: 'Active', salary: 95000 },
  { id: 'emp-2', employeeCode: 'EMP002', firstName: 'Michael', lastName: 'Johnson', email: 'michael@ems.com', phone: '+1-555-0102', departmentId: 'dept-1', departmentName: 'Engineering', designationId: 'des-1', designationName: 'Software Engineer', dateOfJoining: '2023-01-10', status: 'Active', salary: 75000 },
  { id: 'emp-3', employeeCode: 'EMP003', firstName: 'Sarah', lastName: 'Williams', email: 'sarah@ems.com', phone: '+1-555-0103', departmentId: 'dept-2', departmentName: 'Human Resources', designationId: 'des-4', designationName: 'HR Executive', dateOfJoining: '2021-06-20', status: 'Active', salary: 65000 },
  { id: 'emp-4', employeeCode: 'EMP004', firstName: 'David', lastName: 'Brown', email: 'david@ems.com', phone: '+1-555-0104', departmentId: 'dept-3', departmentName: 'Marketing', designationId: 'des-5', designationName: 'Marketing Manager', dateOfJoining: '2020-11-05', status: 'Active', salary: 82000 },
  { id: 'emp-5', employeeCode: 'EMP005', firstName: 'Jessica', lastName: 'Taylor', email: 'jessica@ems.com', phone: '+1-555-0105', departmentId: 'dept-4', departmentName: 'Finance', designationId: 'des-6', designationName: 'Financial Analyst', dateOfJoining: '2022-08-12', status: 'OnLeave', salary: 70000 },
  { id: 'emp-6', employeeCode: 'EMP006', firstName: 'Chris', lastName: 'Martinez', email: 'chris@ems.com', phone: '+1-555-0106', departmentId: 'dept-1', departmentName: 'Engineering', designationId: 'des-3', designationName: 'Tech Lead', dateOfJoining: '2019-04-01', status: 'Active', salary: 120000 },
  { id: 'emp-7', employeeCode: 'EMP007', firstName: 'Amanda', lastName: 'Lee', email: 'amanda@ems.com', phone: '+1-555-0107', departmentId: 'dept-6', departmentName: 'Design', designationId: 'des-7', designationName: 'UX Designer', dateOfJoining: '2023-05-18', status: 'Active', salary: 78000 },
  { id: 'emp-8', employeeCode: 'EMP008', firstName: 'Robert', lastName: 'Garcia', email: 'robert@ems.com', phone: '+1-555-0108', departmentId: 'dept-5', departmentName: 'Operations', designationId: 'des-1', designationName: 'Software Engineer', dateOfJoining: '2021-09-30', status: 'Inactive', salary: 68000 },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: 'att-1', employeeId: 'emp-1', employeeName: 'Emily Davis', date: '2024-01-15', clockIn: '09:02', clockOut: '18:15', status: 'Present', totalHours: 9.2 },
  { id: 'att-2', employeeId: 'emp-2', employeeName: 'Michael Johnson', date: '2024-01-15', clockIn: '09:30', clockOut: '18:00', status: 'Late', totalHours: 8.5 },
  { id: 'att-3', employeeId: 'emp-3', employeeName: 'Sarah Williams', date: '2024-01-15', clockIn: '08:55', clockOut: '17:45', status: 'Present', totalHours: 8.8 },
  { id: 'att-4', employeeId: 'emp-4', employeeName: 'David Brown', date: '2024-01-15', status: 'Absent' },
  { id: 'att-5', employeeId: 'emp-5', employeeName: 'Jessica Taylor', date: '2024-01-15', status: 'OnLeave' },
  { id: 'att-6', employeeId: 'emp-6', employeeName: 'Chris Martinez', date: '2024-01-15', clockIn: '08:45', clockOut: '19:00', status: 'Present', totalHours: 10.25 },
  { id: 'att-7', employeeId: 'emp-7', employeeName: 'Amanda Lee', date: '2024-01-15', clockIn: '09:10', clockOut: '13:00', status: 'HalfDay', totalHours: 3.8 },
];

export const mockLeaveRequests: LeaveRequest[] = [
  { id: 'lv-1', employeeId: 'emp-1', employeeName: 'Emily Davis', leaveType: 'Annual', startDate: '2024-02-10', endDate: '2024-02-14', reason: 'Family vacation', status: 'Approved', approvedBy: 'James Wilson', days: 5 },
  { id: 'lv-2', employeeId: 'emp-2', employeeName: 'Michael Johnson', leaveType: 'Sick', startDate: '2024-01-20', endDate: '2024-01-21', reason: 'Fever', status: 'Approved', approvedBy: 'James Wilson', days: 2 },
  { id: 'lv-3', employeeId: 'emp-5', employeeName: 'Jessica Taylor', leaveType: 'Casual', startDate: '2024-01-15', endDate: '2024-01-16', reason: 'Personal work', status: 'Pending', days: 2 },
  { id: 'lv-4', employeeId: 'emp-4', employeeName: 'David Brown', leaveType: 'Annual', startDate: '2024-03-01', endDate: '2024-03-05', reason: 'Travel', status: 'Pending', days: 5 },
  { id: 'lv-5', employeeId: 'emp-7', employeeName: 'Amanda Lee', leaveType: 'Sick', startDate: '2024-01-18', endDate: '2024-01-18', reason: 'Doctor appointment', status: 'Rejected', comments: 'Please reschedule', days: 1 },
];

export const mockLeaveBalances: LeaveBalance[] = [
  { type: 'Annual', total: 20, used: 5, remaining: 15 },
  { type: 'Sick', total: 12, used: 2, remaining: 10 },
  { type: 'Casual', total: 8, used: 3, remaining: 5 },
  { type: 'Maternity', total: 90, used: 0, remaining: 90 },
];

export const mockPayroll: PayrollRecord[] = [
  { id: 'pay-1', employeeId: 'emp-1', employeeName: 'Emily Davis', month: 'January', year: 2024, basic: 50000, hra: 20000, da: 10000, ta: 5000, otherAllowances: 10000, pf: 6000, tax: 8500, otherDeductions: 500, grossSalary: 95000, netSalary: 80000, status: 'Paid' },
  { id: 'pay-2', employeeId: 'emp-2', employeeName: 'Michael Johnson', month: 'January', year: 2024, basic: 40000, hra: 15000, da: 8000, ta: 4000, otherAllowances: 8000, pf: 4800, tax: 5200, otherDeductions: 500, grossSalary: 75000, netSalary: 64500, status: 'Paid' },
  { id: 'pay-3', employeeId: 'emp-6', employeeName: 'Chris Martinez', month: 'January', year: 2024, basic: 65000, hra: 25000, da: 12000, ta: 6000, otherAllowances: 12000, pf: 7800, tax: 12000, otherDeductions: 700, grossSalary: 120000, netSalary: 99500, status: 'Processed' },
  { id: 'pay-4', employeeId: 'emp-3', employeeName: 'Sarah Williams', month: 'January', year: 2024, basic: 35000, hra: 12000, da: 7000, ta: 3500, otherAllowances: 7500, pf: 4200, tax: 4300, otherDeductions: 500, grossSalary: 65000, netSalary: 56000, status: 'Draft' },
];

export const mockGoals: PerformanceGoal[] = [
  { id: 'goal-1', employeeId: 'emp-1', title: 'Complete React Migration', description: 'Migrate legacy jQuery components to React', progress: 75, status: 'InProgress', dueDate: '2024-03-31' },
  { id: 'goal-2', employeeId: 'emp-1', title: 'Improve Test Coverage', description: 'Achieve 80% code coverage', progress: 45, status: 'InProgress', dueDate: '2024-06-30' },
  { id: 'goal-3', employeeId: 'emp-2', title: 'Learn TypeScript', description: 'Complete TypeScript certification', progress: 100, status: 'Completed', dueDate: '2024-01-31' },
  { id: 'goal-4', employeeId: 'emp-6', title: 'Mentor Junior Devs', description: 'Conduct weekly mentoring sessions', progress: 60, status: 'InProgress', dueDate: '2024-12-31' },
];

export const mockReviews: PerformanceReview[] = [
  { id: 'rev-1', employeeId: 'emp-1', employeeName: 'Emily Davis', reviewerId: '3', reviewerName: 'James Wilson', period: 'Q4 2023', rating: 4.2, comments: 'Excellent performance, strong technical skills.', selfComments: 'I focused on improving code quality and mentoring.', status: 'Completed', createdAt: '2024-01-05' },
  { id: 'rev-2', employeeId: 'emp-2', employeeName: 'Michael Johnson', reviewerId: '3', reviewerName: 'James Wilson', period: 'Q4 2023', rating: 3.8, comments: 'Good progress, needs improvement in communication.', status: 'Pending', createdAt: '2024-01-10' },
];

export const mockActivities: Activity[] = [
  { id: 'act-1', type: 'employee', message: 'New employee Amanda Lee joined Design team', timestamp: '2024-01-15T10:30:00', userId: '2' },
  { id: 'act-2', type: 'leave', message: 'Jessica Taylor applied for casual leave', timestamp: '2024-01-15T09:15:00', userId: '4' },
  { id: 'act-3', type: 'attendance', message: 'Michael Johnson clocked in late', timestamp: '2024-01-15T09:30:00', userId: '3' },
  { id: 'act-4', type: 'payroll', message: 'January payroll processed for Engineering', timestamp: '2024-01-14T16:00:00', userId: '2' },
  { id: 'act-5', type: 'performance', message: 'Q4 2023 reviews completed for Engineering', timestamp: '2024-01-13T14:00:00', userId: '3' },
  { id: 'act-6', type: 'employee', message: 'Robert Garcia status changed to Inactive', timestamp: '2024-01-12T11:00:00', userId: '2' },
];

export const mockDashboardStats: DashboardStats = {
  totalEmployees: 119,
  presentToday: 98,
  onLeave: 8,
  pendingLeaves: 5,
  totalPayroll: 892000,
  attendanceRate: 82.4,
};

export const mockAttendanceTrend = [
  { day: 'Mon', present: 95, absent: 5, late: 8 },
  { day: 'Tue', present: 102, absent: 3, late: 5 },
  { day: 'Wed', present: 98, absent: 7, late: 6 },
  { day: 'Thu', present: 100, absent: 4, late: 4 },
  { day: 'Fri', present: 88, absent: 12, late: 10 },
];

export const mockDepartmentHeadcount = [
  { name: 'Engineering', count: 42 },
  { name: 'HR', count: 12 },
  { name: 'Marketing', count: 18 },
  { name: 'Finance', count: 15 },
  { name: 'Operations', count: 22 },
  { name: 'Design', count: 10 },
];
