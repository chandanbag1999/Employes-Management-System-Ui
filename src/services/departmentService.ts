import api from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { DepartmentResponseDto, CreateDepartmentDto, UpdateDepartmentDto } from '@/types/backend';

export const departmentService = {
    // GET /api/v1/departments
    getAll: async (): Promise<DepartmentResponseDto[]> => {
        const response = await api.get<any>('/departments');
        // Backend may return data directly or wrapped
        const data = response.data.data || response.data;
        return Array.isArray(data) ? data : [];
    },

    // GET /api/v1/departments/:id
    getById: async (id: number): Promise<DepartmentResponseDto> => {
        const response = await api.get<any>(`/departments/${id}`);
        return response.data.data || response.data;
    },

    // POST /api/v1/departments
    create: async (data: CreateDepartmentDto): Promise<DepartmentResponseDto> => {
        const response = await api.post<ApiResponse<DepartmentResponseDto>>('/departments', data);
        return response.data.data;
    },

    // PUT /api/v1/departments/:id
    update: async (id: number, data: UpdateDepartmentDto): Promise<DepartmentResponseDto> => {
        const response = await api.put<ApiResponse<DepartmentResponseDto>>(`/departments/${id}`, data);
        return response.data.data;
    },

    // DELETE /api/v1/departments/:id
    delete: async (id: number): Promise<void> => {
        await api.delete(`/departments/${id}`);
    },
};
