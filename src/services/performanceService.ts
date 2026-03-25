import api from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { GoalResponseDto, ReviewResponseDto } from '@/types/backend';

interface PerformanceFilter {
    employeeId?: number;
    status?: string;
    page?: number;
    pageSize?: number;
}

export const performanceService = {
    // GET /api/v1/performance/goals
    getGoals: async (filter: PerformanceFilter = {}): Promise<any> => {
        const params = new URLSearchParams();
        if (filter.employeeId) params.append('employeeId', filter.employeeId.toString());
        if (filter.status) params.append('status', filter.status);
        if (filter.page) params.append('page', filter.page.toString());
        if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());

        const response = await api.get<ApiResponse<any>>(`/performance/goals?${params}`);
        return response.data.data;
    },

    // POST /api/v1/performance/goals
    createGoal: async (data: {
        employeeId: number;
        title: string;
        description: string;
        dueDate: string;
    }): Promise<GoalResponseDto> => {
        const response = await api.post<ApiResponse<GoalResponseDto>>('/performance/goals', data);
        return response.data.data;
    },

    // PUT /api/v1/performance/goals/:id
    updateGoalProgress: async (id: number, data: { progress: number }): Promise<GoalResponseDto> => {
        const response = await api.put<ApiResponse<GoalResponseDto>>(`/performance/goals/${id}`, data);
        return response.data.data;
    },

    // GET /api/v1/performance/reviews
    getReviews: async (filter: PerformanceFilter = {}): Promise<any> => {
        const params = new URLSearchParams();
        if (filter.employeeId) params.append('employeeId', filter.employeeId.toString());
        if (filter.status) params.append('status', filter.status);
        if (filter.page) params.append('page', filter.page.toString());
        if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());

        const response = await api.get<ApiResponse<any>>(`/performance/reviews?${params}`);
        return response.data.data;
    },

    // POST /api/v1/performance/reviews
    createReview: async (data: {
        employeeId: number;
        period: string;
        rating: number;
        comments: string;
        selfComments?: string;
    }): Promise<ReviewResponseDto> => {
        const response = await api.post<ApiResponse<ReviewResponseDto>>('/performance/reviews', data);
        return response.data.data;
    },
};