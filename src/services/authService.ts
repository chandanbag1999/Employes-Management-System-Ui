import api from '@/lib/api';
import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    UserProfile,
    ApiResponse
} from '@/types/backend';

export const authService = {

    // POST /api/v1/auth/login
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);

        // Backend ka ApiResponse<T> wrapper check karo
        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.message || 'Login failed');
        }

        return response.data.data;
    },

    // POST /api/v1/auth/register
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.message || 'Registration failed');
        }

        return response.data.data;
    },

    // POST /api/v1/auth/logout
    logout: async (): Promise<void> => {
        const refreshToken = localStorage.getItem('ems-refresh-token');
        if (!refreshToken) return; // Kuch nahi karna agar token hai hi nahi

        await api.post('/auth/logout', { refreshToken });
    },

    // GET /api/v1/users/me — Koi bhi authenticated user apna profile dekh sakta hai
    getMe: async (): Promise<UserProfile> => {
        const response = await api.get<ApiResponse<UserProfile>>('/users/me');

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.message || 'Failed to fetch profile');
        }

        return response.data.data;
    },

};