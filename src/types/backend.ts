// These types match the backend DTOs exactly

// Authentication DTOs
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    userName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    userName: string;
    email: string;
    role: string;
    accessTokenExpiresAt: string;
    refreshTokenExpiresAt: string;
}

export interface UserProfile {
    id: number;
    userName: string;
    email: string;
    role: string;
    isActive: boolean;
    isEmailVerified: boolean;
    createdAt: string;
    lastLogin: string | null;
    isLockedOut: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    errors: string[];
}


export interface EmployeeResponseDto {
    id: number;
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: number | string;  // Backend sends number (1=Male, 2=Female, 3=Other)
    dateOfBirth: string;
    joiningDate: string;
    profilePhotoUrl?: string;
    status: string;           // "Active" | "Inactive" | "OnLeave"
    statusValue?: number;     // Optional for future-proofing
    departmentId: number;
    departmentName: string;
    designationId?: number;
    designationTitle?: string;
    reportingManagerId?: number;
    reportingManagerName?: string;
    userId?: number;
    createdAt: string;
}

// Employee DTOs - MATCHES BACKEND (Gender is number: Male=1, Female=2, Other=3)
export interface CreateEmployeeDto {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    gender: number;  // 1=Male, 2=Female, 3=Other
    dateOfBirth: string;
    joiningDate: string;
    departmentId: number;
    designationId?: number;
    reportingManagerId?: number;
}

export interface UpdateEmployeeDto extends CreateEmployeeDto {
    status: number;  // 1=Active, 2=Inactive, 3=OnLeave (EmploymentStatus enum)
}

export interface DepartmentResponseDto {
    id: number;
    name: string;
    code?: string;
    description?: string;
    headId?: number;
    headName?: string;
    employeeCount?: number;
    isActive?: boolean;
}

export interface DesignationResponseDto {
    id: number;
    title: string;
    description?: string;
    departmentId: number;
    departmentName?: string;
    createdAt?: string;
}

export interface AttendanceResponseDto {
    id: number;
    employeeId: number;
    employeeName: string;
    employeeCode: string;
    date: string;
    // Backend TimeSpan bhejta hai — string format "09:30:00"
    clockIn?: string | null;
    clockOut?: string | null;
    status: string;
    workingHours?: number | null;
    remarks?: string | null;
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

// Designation DTOs - MATCHES BACKEND ENTITY
export interface CreateDesignationDto {
    title: string;
    departmentId: number;
    description?: string;
}
