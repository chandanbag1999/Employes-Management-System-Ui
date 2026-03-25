import api from '@/lib/api';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { EmployeeResponseDto, CreateEmployeeDto, UpdateEmployeeDto } from '@/types/backend';
import type { Employee } from '@/types';

interface EmployeeFilter {
    page?: number;
    pageSize?: number;
    search?: string;
    departmentId?: number;
    designationId?: number;
    status?: string;
    gender?: string;
}

export const employeeService = {
    // GET /api/v1/employees
    getAll: async (filter: EmployeeFilter = {}): Promise<PaginatedResponse<EmployeeResponseDto>> => {
        const params = new URLSearchParams();
        if (filter.page) params.append('page', filter.page.toString());
        if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());
        if (filter.search) params.append('search', filter.search);
        if (filter.departmentId) params.append('departmentId', filter.departmentId.toString());
        if (filter.designationId) params.append('designationId', filter.designationId.toString());
        if (filter.status) params.append('status', filter.status);
        if (filter.gender) params.append('gender', filter.gender);

        const response = await api.get<ApiResponse<PaginatedResponse<EmployeeResponseDto>>>(`/employees?${params}`);
        return response.data.data;
    },

    // GET /api/v1/employees/:id
    getById: async (id: number): Promise<EmployeeResponseDto> => {
        const response = await api.get<ApiResponse<EmployeeResponseDto>>(`/employees/${id}`);
        return response.data.data;
    },

    // POST /api/v1/employees
    create: async (data: CreateEmployeeDto): Promise<EmployeeResponseDto> => {
        const response = await api.post<ApiResponse<EmployeeResponseDto>>('/employees', data);
        return response.data.data;
    },

    // PUT /api/v1/employees/:id
    update: async (id: number, data: UpdateEmployeeDto): Promise<EmployeeResponseDto> => {
        const response = await api.put<ApiResponse<EmployeeResponseDto>>(`/employees/${id}`, data);
        return response.data.data;
    },

    // DELETE /api/v1/employees/:id
    delete: async (id: number): Promise<void> => {
        await api.delete(`/employees/${id}`);
    },
};