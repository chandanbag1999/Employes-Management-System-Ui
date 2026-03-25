import api from '@/lib/api';
import type { ApiResponse } from '@/types/api';

// Backend returns flat structure
interface LoginResponse {
    token: string;
    userName: string;
    email: string;
    role: string;
    expiresAt: string;
}

export const authService = {
    // POST /api/v1/auth/login
    // Backend returns data directly, not wrapped in "data" property
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/login', {
            email,
            password,
        });
        return response.data;
    },

    // POST /api/v1/auth/register
    register: async (data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone?: string;
    }): Promise<LoginResponse> => {
        const response = await api.post<ApiResponse<LoginResponse>>('/auth/register', data);
        return response.data.data;
    },

    // GET /api/v1/users/me
    getCurrentUser: async () => {
        const response = await api.get<ApiResponse<any>>('/users/me');
        return response.data.data;
    },
};
