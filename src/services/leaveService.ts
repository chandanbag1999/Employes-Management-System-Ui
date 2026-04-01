import api from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { LeaveResponseDto, LeaveTypeResponseDto, LeaveBalanceDto } from '@/types/backend';

interface LeaveFilter {
    employeeId?: number;
    status?: string;
    page?: number;
    pageSize?: number;
}

export const leaveService = {
    // GET /api/v1/leave
    getAll: async (filter: LeaveFilter = {}): Promise<any> => {
        const params = new URLSearchParams();
        if (filter.employeeId) params.append('employeeId', filter.employeeId.toString());
        if (filter.status) params.append('status', filter.status);
        if (filter.page) params.append('page', filter.page.toString());
        if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());

        const response = await api.get<ApiResponse<any>>(`/leave?${params}`);
        return response.data.data;
    },

    // GET /api/v1/leave/types
    getTypes: async (): Promise<LeaveTypeResponseDto[]> => {
        const response = await api.get<ApiResponse<LeaveTypeResponseDto[]>>('/leave/types');
        return response.data.data;
    },

    // GET /api/v1/leave/balance/:employeeId
    getBalance: async (employeeId: number): Promise<any[]> => {
        try {
            const response = await api.get<any>(`/leave/balance/${employeeId}`);
            return response.data?.data || [];
        } catch (err) {
            console.error('getBalance error:', err);
            return [];
        }
    },

    // POST /api/v1/leave
    apply: async (data: {
        leaveTypeId: number;
        startDate: string;
        endDate: string;
        reason: string;
    }): Promise<LeaveResponseDto> => {
        const response = await api.post<ApiResponse<LeaveResponseDto>>('/leave', data);
        return response.data.data;
    },

    // PUT /api/v1/leave/:id/action
    updateStatus: async (id: number, data: { status: string; comments?: string }): Promise<LeaveResponseDto> => {
        const response = await api.put<ApiResponse<LeaveResponseDto>>(`/leave/${id}/action`, data);
        return response.data.data;
    },
};
