import api from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { Role } from '@/types';

export interface UserDto {
    id: number;
    userName: string;
    email: string;
    role: string;
    isActive: boolean;
    lastLogin?: string;
}

export const userService = {
    // GET /api/v1/users
    getAll: async (): Promise<UserDto[]> => {
        console.log('USER SERVICE: Fetching all users...');
        const response = await api.get<any>('/users');
        console.log('USER SERVICE: Response:', response.data);
        // Backend may return data directly or wrapped
        const data = response.data.data || response.data;
        console.log('USER SERVICE: Final data:', data);
        return Array.isArray(data) ? data : [];
    },

    // GET /api/v1/users/:id
    getById: async (id: number): Promise<UserDto> => {
        const response = await api.get<any>(`/users/${id}`);
        return response.data.data || response.data;
    },

    // PATCH /api/v1/users/:id/deactivate
    deactivate: async (id: number): Promise<void> => {
        await api.patch(`/users/${id}/deactivate`);
    },
};
