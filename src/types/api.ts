// Generic API Response wrapper from backend
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errors: string[];
}

// Pagination Response
export interface PaginatedResponse<T> {
    data: T[];
    totalCount: number;
    page: number;
    pageSize: number;
}

// Auth Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        email: string;
        name: string;
        role: string;
    };
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

// Employee Types
export interface EmployeeFilter {
    page?: number;
    pageSize?: number;
    search?: string;
    departmentId?: number;
    designationId?: number;
    status?: string;
    gender?: string;
}

export interface CreateEmployeeRequest {
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

export interface UpdateEmployeeRequest extends CreateEmployeeRequest {
    status: 'Active' | 'Inactive' | 'OnLeave';
}

// Department Types
export interface CreateDepartmentRequest {
    name: string;
    description?: string;
    headId?: number;
}

export interface UpdateDepartmentRequest extends CreateDepartmentRequest { }

// Designation Types
export interface CreateDesignationRequest {
    title: string;
    departmentId: number;
    level: number;
}

// Leave Types
export interface ApplyLeaveRequest {
    leaveTypeId: number;
    startDate: string;
    endDate: string;
    reason: string;
}

export interface LeaveActionRequest {
    status: 'Approved' | 'Rejected';
    comments?: string;
}

// Attendance Types
export interface ClockInRequest {
    employeeId: number;
}

export interface ClockOutRequest {
    recordId: number;
}

export interface ManualAttendanceRequest {
    employeeId: number;
    date: string;
    clockIn?: string;
    clockOut?: string;
}

// Payroll Types
export interface RunPayrollRequest {
    month: number;
    year: number;
    employeeIds?: number[];
}