import api from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { EmployeeResponseDto, CreateEmployeeDto, UpdateEmployeeDto } from '@/types/backend';

interface EmployeeFilter {
    page?: number;
    pageSize?: number;
    search?: string;
    departmentId?: number;
    designationId?: number;
    status?: string;
    gender?: string;
}

interface PaginatedResult<T> {
    data: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// Helper to extract data from paginated response
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

export const employeeService = {
    // GET /api/v1/employees
    getAll: async (filter: EmployeeFilter = {}): Promise<PaginatedResult<EmployeeResponseDto>> => {
        const params = new URLSearchParams();
        if (filter.page) params.append('page', filter.page.toString());
        if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());
        if (filter.search) params.append('search', filter.search);
        if (filter.departmentId) params.append('departmentId', filter.departmentId.toString());
        if (filter.designationId) params.append('designationId', filter.designationId.toString());
        if (filter.status) params.append('status', filter.status);
        if (filter.gender) params.append('gender', filter.gender);

        const response = await api.get<any>(`/employees?${params}`);
        return extractPaginatedData<EmployeeResponseDto>(response);
    },

    // GET /api/v1/employees/:id
    getById: async (id: number): Promise<EmployeeResponseDto> => {
        const response = await api.get<any>(`/employees/${id}`);
        return response.data.data || response.data;
    },

    // POST /api/v1/employees
    create: async (data: CreateEmployeeDto): Promise<EmployeeResponseDto> => {
        const response = await api.post<any>('/employees', data);
        return response.data.data || response.data;
    },

    // PUT /api/v1/employees/:id
    update: async (id: number, data: UpdateEmployeeDto): Promise<EmployeeResponseDto> => {
        const response = await api.put<any>(`/employees/${id}`, data);
        return response.data.data || response.data;
    },

    // DELETE /api/v1/employees/:id
    delete: async (id: number): Promise<void> => {
        await api.delete(`/employees/${id}`);
    },
};
