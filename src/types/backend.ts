// These types match the backend DTOs exactly

export interface EmployeeResponseDto {
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
    createdAt: string;
}

export interface CreateEmployeeDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: 'Male' | 'Female' | 'Other';
    dateOfBirth: string;
    joiningDate: string;
    departmentId: number;
    designationId?: number;
    reportingManagerId?: number;
}

export interface UpdateEmployeeDto extends CreateEmployeeDto {
    status: 'Active' | 'Inactive' | 'OnLeave';
}

export interface DepartmentResponseDto {
    id: number;
    name: string;
    code?: string;
    description?: string;
    headId?: number;
    headName?: string;
    employeeCount?: number;
}

export interface DesignationResponseDto {
    id: number;
    title: string;
    departmentId: number;
    departmentName?: string;
    level: number;
}

export interface AttendanceResponseDto {
    id: number;
    employeeId: number;
    employeeName: string;
    date: string;
    clockIn?: string;
    clockOut?: string;
    status: string;
    totalHours?: number;
}

export interface LeaveResponseDto {
    id: number;
    employeeId: number;
    employeeName: string;
    leaveTypeId: number;
    leaveTypeName: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: string;
    approvedBy?: string;
    comments?: string;
    days: number;
    createdAt: string;
}

export interface LeaveTypeResponseDto {
    id: number;
    name: string;
    description?: string;
    maxDays: number;
    isActive: boolean;
}

export interface LeaveBalanceDto {
    leaveTypeName: string;
    totalDays: number;
    usedDays: number;
    remainingDays: number;
}

export interface PayrollRecordResponseDto {
    id: number;
    employeeId: number;
    employeeName: string;
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

export interface GoalResponseDto {
    id: number;
    employeeId: number;
    title: string;
    description: string;
    progress: number;
    status: string;
    dueDate: string;
}

export interface ReviewResponseDto {
    id: number;
    employeeId: number;
    employeeName: string;
    reviewerId: number;
    reviewerName: string;
    period: string;
    rating: number;
    comments: string;
    selfComments?: string;
    status: string;
    createdAt: string;
}

// Department DTOs
export interface CreateDepartmentDto {
    name: string;
    description?: string;
    code?: string;
    headId?: number;
}

export interface UpdateDepartmentDto extends CreateDepartmentDto { }

// Designation DTOs  
export interface CreateDesignationDto {
    title: string;
    departmentId: number;
    level: number;
}