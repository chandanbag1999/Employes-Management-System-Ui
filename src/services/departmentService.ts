import api from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { DepartmentResponseDto, CreateDepartmentDto, UpdateDepartmentDto } from '@/types/backend';

export const departmentService = {
    // GET /api/v1/departments
    getAll: async (): Promise<DepartmentResponseDto[]> => {
        const response = await api.get<any>('/departments');
        // Backend returns paginated: { data: { data: [...], totalCount, page, ... }, success, message }
        // Extract the actual array from the nested data
        const paginatedData = response.data.data;
        const departments = paginatedData?.data || paginatedData || [];
        return Array.isArray(departments) ? departments : [];
    },

    // GET /api/v1/departments/:id
    getById: async (id: number): Promise<DepartmentResponseDto> => {
        const response = await api.get<any>(`/departments/${id}`);
        return response.data.data || response.data;
    },

    // POST /api/v1/departments
    create: async (data: CreateDepartmentDto): Promise<DepartmentResponseDto> => {
        const response = await api.post<any>('/departments', data);
        return response.data.data || response.data;
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
