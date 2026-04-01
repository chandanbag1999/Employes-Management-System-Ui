import api from '@/lib/api';
import type {
    DesignationResponseDto,
    CreateDesignationDto
} from '@/types/backend';

// ✅ Filter interface add kiya
interface DesignationFilter {
    page?: number;
    pageSize?: number;
    departmentId?: number;
    search?: string;
}

interface PaginatedResult<T> {
    data: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export const designationService = {

    // GET /api/v1/designations
    // ✅ Ab filter object accept karta hai - EmployeesPage compatible
    getAll: async (filter: DesignationFilter = {}): Promise<PaginatedResult<DesignationResponseDto>> => {
        const params = new URLSearchParams();
        params.append('page', (filter.page ?? 1).toString());
        params.append('pageSize', (filter.pageSize ?? 100).toString());
        if (filter.departmentId) params.append('departmentId', filter.departmentId.toString());
        if (filter.search) params.append('search', filter.search);

        const response = await api.get<any>(`/designations?${params}`);
        const paginatedData = response.data.data;

        return {
            data: paginatedData?.data || paginatedData || [],
            totalCount: paginatedData?.totalCount || 0,
            page: paginatedData?.page || 1,
            pageSize: paginatedData?.pageSize || 100,
            totalPages: paginatedData?.totalPages || 1,
        };
    },

    // ✅ Simple array - OrganizationPage ke liye backward compatible
    getAllSimple: async (): Promise<DesignationResponseDto[]> => {
        const result = await designationService.getAll({ pageSize: 200 });
        return result.data;
    },

    // GET /api/v1/designations/deleted
    getAllDeleted: async (): Promise<DesignationResponseDto[]> => {
        const response = await api.get<any>('/designations/deleted');
        const paginatedData = response.data.data;
        const designations = paginatedData?.data || paginatedData || [];
        return Array.isArray(designations) ? designations : [];
    },

    // GET /api/v1/designations/:id
    getById: async (id: number): Promise<DesignationResponseDto> => {
        const response = await api.get<any>(`/designations/${id}`);
        return response.data.data || response.data;
    },

    // POST /api/v1/designations
    create: async (data: CreateDesignationDto): Promise<DesignationResponseDto> => {
        const response = await api.post<any>('/designations', data);
        return response.data.data || response.data;
    },

    // PUT /api/v1/designations/:id
    update: async (
        id: number,
        data: CreateDesignationDto
    ): Promise<DesignationResponseDto> => {
        const response = await api.put<any>(`/designations/${id}`, data);
        return response.data.data || response.data;
    },

    // DELETE /api/v1/designations/:id
    delete: async (id: number): Promise<void> => {
        await api.delete(`/designations/${id}`);
    },

    // POST /api/v1/designations/:id/restore
    restore: async (id: number): Promise<void> => {
        await api.post(`/designations/${id}/restore`);
    },

    // DELETE /api/v1/designations/purge?months=12
    purge: async (months: number = 12): Promise<number> => {
        const response = await api.delete(`/designations/purge?months=${months}`);
        return (response.data as any)?.data || 0;
    },
};