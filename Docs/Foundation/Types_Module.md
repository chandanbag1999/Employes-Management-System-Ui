# Types Module

## Overview

The Types Module provides TypeScript type definitions used throughout the application. These types ensure type safety and provide a consistent interface between frontend and backend.

## Files

| File | Purpose |
|------|---------|
| [`src/types/index.ts`](../../src/types/index.ts:1) | Core application types |
| [`src/types/api.ts`](../../src/types/api.ts:1) | API request/response types |
| [`src/types/backend.ts`](../../src/types/backend.ts:1) | Backend DTO types |

---

## Core Types

### [`src/types/index.ts`](../../src/types/index.ts:1)

**Purpose**: Application-wide types used across components and pages.

### User Types

```typescript
export type Role = 'SuperAdmin' | 'HRAdmin' | 'Manager' | 'Employee';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  departmentId?: string;
}
```

### Employee Types

```typescript
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
```

### Department Types

```typescript
export interface Department {
  id: number;
  name: string;
  description?: string;
  headId?: number;
  headName?: string;
  employeeCount?: number;
}
```

### Designation Types

```typescript
export interface Designation {
  id: number;
  title: string;
  departmentId: number;
  departmentName?: string;
  level: number;
}
```

### Attendance Types

```typescript
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
```

### Leave Types

```typescript
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
```

### Payroll Types

```typescript
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
```

### Performance Types

```typescript
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
```

### Dashboard Types

```typescript
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
```

---

## API Types

### [`src/types/api.ts`](../../src/types/api.ts:1)

**Purpose**: Types for API request/response handling.

### Response Types

```typescript
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
```

### Auth Types

```typescript
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
```

### Filter Types

```typescript
export interface EmployeeFilter {
    page?: number;
    pageSize?: number;
    search?: string;
    departmentId?: number;
    designationId?: number;
    status?: string;
    gender?: string;
}

export interface LeaveFilter {
    employeeId?: number;
    status?: string;
    page?: number;
    pageSize?: number;
}

export interface AttendanceFilter {
    employeeId?: number;
    date?: string;
    status?: string;
    page?: number;
    pageSize?: number;
}

export interface PayrollFilter {
    employeeId?: number;
    month?: number;
    year?: number;
    status?: string;
    page?: number;
    pageSize?: number;
}

export interface PerformanceFilter {
    employeeId?: number;
    status?: string;
    page?: number;
    pageSize?: number;
}
```

---

## Backend Types

### [`src/types/backend.ts`](../../src/types/backend.ts:1)

**Purpose**: TypeScript types that match backend DTOs exactly.

### Employee DTOs

```typescript
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
    phone?: string;
    gender: number;  // 1=Male, 2=Female, 3=Other
    dateOfBirth: string;
    joiningDate: string;
    departmentId: number;
    designationId?: number;
    reportingManagerId?: number;
}

export interface UpdateEmployeeDto extends CreateEmployeeDto {
    status: number;  // 1=Active, 2=Inactive, 3=OnLeave
}
```

### Department DTOs

```typescript
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

export interface CreateDepartmentDto {
    name: string;
    description?: string;
    code?: string;
    headId?: number;
}

export interface UpdateDepartmentDto extends CreateDepartmentDto {}
```

### Designation DTOs

```typescript
export interface DesignationResponseDto {
    id: number;
    title: string;
    description?: string;
    departmentId: number;
    departmentName?: string;
    createdAt?: string;
}

export interface CreateDesignationDto {
    title: string;
    departmentId: number;
    description?: string;
}
```

### Leave DTOs

```typescript
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
```

### Payroll DTOs

```typescript
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
```

### Performance DTOs

```typescript
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
```

---

## Enum Values

### Gender Enum (Backend Numeric)

| Value | Gender |
|-------|--------|
| 1 | Male |
| 2 | Female |
| 3 | Other |

### Employment Status Enum (Backend Numeric)

| Value | Status |
|-------|--------|
| 1 | Active |
| 2 | Inactive |
| 3 | OnLeave |

### Attendance Status

| Status | Description |
|--------|-------------|
| Present | Employee present |
| Absent | Employee absent |
| Late | Employee late |
| HalfDay | Half day worked |

### Leave Status

| Status | Description |
|--------|-------------|
| Pending | Awaiting approval |
| Approved | Leave approved |
| Rejected | Leave rejected |

---

## Related Documentation

- [Services Module](./Services_Module.md)
- [Stores Module](./Stores_Module.md)

---

*Last Updated: 2026-03-31*
