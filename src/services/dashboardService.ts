import api from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { DashboardStats, Activity } from '@/types';

interface DepartmentHeadcountDto {
    departmentName: string;
    employeeCount: number;
}

export const dashboardService = {
    // GET /api/v1/dashboard/stats
    getStats: async (): Promise<DashboardStats> => {
        const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
        return response.data.data;
    },

    // GET /api/v1/dashboard/headcount
    getDepartmentHeadcount: async (): Promise<DepartmentHeadcountDto[]> => {
        const response = await api.get<ApiResponse<DepartmentHeadcountDto[]>>('/dashboard/headcount');
        return response.data.data;
    },

    // GET /api/v1/dashboard/activities
    getRecentActivities: async (count: number = 10): Promise<Activity[]> => {
        const response = await api.get<ApiResponse<Activity[]>>(`/dashboard/activities?count=${count}`);
        return response.data.data;
    },
};
