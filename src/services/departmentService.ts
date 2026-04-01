import api from '@/lib/api';
import type {
    DepartmentResponseDto,
    CreateDepartmentDto,
    UpdateDepartmentDto
} from '@/types/backend';

// ✅ Filter interface add kiya - EmployeesPage getAll({ pageSize: 200 }) call karta hai
interface DepartmentFilter {
    page?: number;
    pageSize?: number;
    search?: string;
}

interface PaginatedResult<T> {
    data: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export const departmentService = {

    // GET /api/v1/departments
    // ✅ Ab filter object accept karta hai - EmployeesPage compatible
    getAll: async (filter: DepartmentFilter = {}): Promise<PaginatedResult<DepartmentResponseDto>> => {
        const params = new URLSearchParams();
        params.append('page', (filter.page ?? 1).toString());
        params.append('pageSize', (filter.pageSize ?? 100).toString());
        if (filter.search) params.append('search', filter.search);

        const response = await api.get<any>(`/departments?${params}`);
        const paginatedData = response.data.data;

        return {
            data: paginatedData?.data || paginatedData || [],
            totalCount: paginatedData?.totalCount || 0,
            page: paginatedData?.page || 1,
            pageSize: paginatedData?.pageSize || 100,
            totalPages: paginatedData?.totalPages || 1,
        };
    },

    // ✅ Simple array return - OrganizationPage ke liye backward compatible
    getAllSimple: async (): Promise<DepartmentResponseDto[]> => {
        const result = await departmentService.getAll({ pageSize: 200 });
        return result.data;
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
        const response = await api.put<any>(`/departments/${id}`, data);
        return response.data.data || response.data;
    },

    // DELETE /api/v1/departments/:id
    delete: async (id: number): Promise<void> => {
        await api.delete(`/departments/${id}`);
    },

    // GET /api/v1/departments/deleted
    getDeleted: async (): Promise<DepartmentResponseDto[]> => {
        const response = await api.get<any>('/departments/deleted');
        const data = response.data.data || [];
        return Array.isArray(data) ? data : [];
    },

    // POST /api/v1/departments/:id/restore
    restore: async (id: number): Promise<void> => {
        await api.post(`/departments/${id}/restore`);
    },

    // DELETE /api/v1/departments/purge?months=12
    purge: async (months: number = 12): Promise<number> => {
        const response = await api.delete<any>(`/departments/purge?months=${months}`);
        return response.data?.data || 0;
    },
};