# Services Module

## Overview

The Services Module provides the API integration layer for the frontend. All HTTP requests to the backend are handled through these service modules, which abstract the API complexity and provide typed interfaces.

## Files

| File | Purpose |
|------|---------|
| [`src/services/authService.ts`](../../src/services/authService.ts:1) | Authentication API |
| [`src/services/employeeService.ts`](../../src/services/employeeService.ts:1) | Employee API |
| [`src/services/departmentService.ts`](../../src/services/departmentService.ts:1) | Department API |
| [`src/services/designationService.ts`](../../src/services/designationService.ts:1) | Designation API |
| [`src/services/attendanceService.ts`](../../src/services/attendanceService.ts:1) | Attendance API |
| [`src/services/leaveService.ts`](../../src/services/leaveService.ts:1) | Leave API |
| [`src/services/payrollService.ts`](../../src/services/payrollService.ts:1) | Payroll API |
| [`src/services/performanceService.ts`](../../src/services/performanceService.ts:1) | Performance API |
| [`src/services/dashboardService.ts`](../../src/services/dashboardService.ts:1) | Dashboard API |
| [`src/services/userService.ts`](../../src/services/userService.ts:1) | User API |
| [`src/services/index.ts`](../../src/services/index.ts:1) | Service barrel export |

---

## API Client

### [`src/lib/api.ts`](../../src/lib/api.ts:1)

**Purpose**: Centralized Axios instance with interceptors for authentication.

### Configuration

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5185/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});
```

### Request Interceptor

```typescript
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('ems-token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);
```

### Response Interceptor

```typescript
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            console.log('[API] 401 Unauthorized - clearing token');
            localStorage.removeItem('ems-auth');
            localStorage.removeItem('ems-token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
```

### Features

1. **Base URL**: Configurable via environment variable
2. **Timeout**: 30-second request timeout
3. **Auto Token**: Automatically adds JWT token to requests
4. **401 Handling**: Auto-logout on unauthorized
5. **Error Propagation**: Errors pass through to callers

---

## Service Index

### [`src/services/index.ts`](../../src/services/index.ts:1)

```typescript
export { authService } from './authService';
export { employeeService } from './employeeService';
export { departmentService } from './departmentService';
export { designationService } from './designationService';
export { attendanceService } from './attendanceService';
export { leaveService } from './leaveService';
export { payrollService } from './payrollService';
export { performanceService } from './performanceService';
export { dashboardService } from './dashboardService';
export { userService } from './userService';
```

---

## API Endpoints Summary

### Authentication (`/auth`)

| Method | Endpoint | Service |
|--------|----------|---------|
| POST | `/auth/login` | authService |
| POST | `/auth/register` | authService |
| POST | `/auth/logout` | authService |

### Users (`/users`)

| Method | Endpoint | Service |
|--------|----------|---------|
| GET | `/users` | userService |
| GET | `/users/:id` | userService |
| GET | `/users/me` | authService, userService |
| PATCH | `/users/:id/deactivate` | userService |
| PATCH | `/users/:id/role` | userService |

### Employees (`/employees`)

| Method | Endpoint | Service |
|--------|----------|---------|
| GET | `/employees` | employeeService |
| GET | `/employees/:id` | employeeService |
| POST | `/employees` | employeeService |
| PUT | `/employees/:id` | employeeService |
| DELETE | `/employees/:id` | employeeService |

### Departments (`/departments`)

| Method | Endpoint | Service |
|--------|----------|---------|
| GET | `/departments` | departmentService |
| GET | `/departments/:id` | departmentService |
| POST | `/departments` | departmentService |
| PUT | `/departments/:id` | departmentService |
| DELETE | `/departments/:id` | departmentService |

### Designations (`/designations`)

| Method | Endpoint | Service |
|--------|----------|---------|
| GET | `/designations` | designationService |
| GET | `/designations/deleted` | designationService |
| GET | `/designations/:id` | designationService |
| POST | `/designations` | designationService |
| PUT | `/designations/:id` | designationService |
| DELETE | `/designations/:id` | designationService |
| POST | `/designations/:id/restore` | designationService |
| DELETE | `/designations/purge?months=12` | designationService |

### Attendance (`/attendance`)

| Method | Endpoint | Service |
|--------|----------|---------|
| GET | `/attendance` | attendanceService |
| POST | `/attendance/clock-in` | attendanceService |
| POST | `/attendance/clock-out` | attendanceService |
| POST | `/attendance/manual` | attendanceService |

### Leave (`/leave`)

| Method | Endpoint | Service |
|--------|----------|---------|
| GET | `/leave` | leaveService |
| GET | `/leave/types` | leaveService |
| GET | `/leave/balance/:employeeId` | leaveService |
| POST | `/leave` | leaveService |
| PUT | `/leave/:id/action` | leaveService |

### Payroll (`/payroll`)

| Method | Endpoint | Service |
|--------|----------|---------|
| GET | `/payroll` | payrollService |
| GET | `/payroll/:id` | payrollService |
| POST | `/payroll/run` | payrollService |

### Performance (`/performance`)

| Method | Endpoint | Service |
|--------|----------|---------|
| GET | `/performance/goals` | performanceService |
| POST | `/performance/goals` | performanceService |
| PUT | `/performance/goals/:id` | performanceService |
| GET | `/performance/reviews` | performanceService |
| POST | `/performance/reviews` | performanceService |

### Dashboard (`/dashboard`)

| Method | Endpoint | Service |
|--------|----------|---------|
| GET | `/dashboard/stats` | dashboardService |
| GET | `/dashboard/headcount` | dashboardService |
| GET | `/dashboard/activities?count=10` | dashboardService |

---

## Common Patterns

### Pagination Handling

```typescript
const extractPaginatedData = <T>(response: any): PaginatedResult<T> => {
    const paginatedData = response.data.data;
    return {
        data: paginatedData?.data || paginatedData || [],
        totalCount: paginatedData?.totalCount || 0,
        page: paginatedData?.page || 1,
        pageSize: paginatedData?.pageSize || 10,
        totalPages: paginatedData?.totalPages || 1,
    };
};
```

### Query Parameter Building

```typescript
const params = new URLSearchParams();
if (filter.page) params.append('page', filter.page.toString());
if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());
if (filter.search) params.append('search', filter.search);
if (filter.status) params.append('status', filter.status);

const response = await api.get<any>(`/resource?${params}`);
```

### Error Handling

```typescript
try {
    const response = await api.post<any>('/resource', data);
    return response.data.data || response.data;
} catch (error: any) {
    console.error('[Service] Error:', error.response?.data);
    throw error;
}
```

---

## Related Documentation

- [Types Module](./Types_Module.md)
- [Stores Module](./Stores_Module.md)
- [Core Application Module](../Core/Core_Application_Module.md)

---

*Last Updated: 2026-03-31*
