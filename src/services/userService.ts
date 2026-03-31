import api from '@/lib/api';
import type { ApiResponse } from '@/types/backend'; // backend.ts wala use karo

// Backend UserResponseDto se exactly match karta hai
export interface UserDto {
    id: number;
    userName: string;
    email: string;
    role: string;           // "SuperAdmin", "HRAdmin", "Manager", "Employee"
    isActive: boolean;
    isEmailVerified: boolean;
    isLockedOut: boolean;
    createdAt: string;
    lastLogin: string | null;
}

// Role number mapping — backend UserRole enum se match karta hai
export const ROLE_TO_NUMBER: Record<string, number> = {
    'SuperAdmin': 1,
    'HRAdmin': 2,
    'Manager': 3,
    'Employee': 4,
};

export const userService = {

    // GET /api/v1/users — SuperAdmin, HRAdmin only
    getAll: async (): Promise<UserDto[]> => {
        const response = await api.get<ApiResponse<UserDto[]>>('/users');

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.message || 'Failed to fetch users');
        }

        return response.data.data;
    },

    // GET /api/v1/users/:id — SuperAdmin, HRAdmin only
    getById: async (id: number): Promise<UserDto> => {
        const response = await api.get<ApiResponse<UserDto>>(`/users/${id}`);

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.message || 'User not found');
        }

        return response.data.data;
    },

    // GET /api/v1/users/me — Koi bhi authenticated user
    getMe: async (): Promise<UserDto> => {
        const response = await api.get<ApiResponse<UserDto>>('/users/me');

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.message || 'Failed to fetch profile');
        }

        return response.data.data;
    },

    // PATCH /api/v1/users/:id/deactivate — SuperAdmin only
    // Backend sirf deactivate karta hai, toggle nahi — isliye naam 'deactivate' hai
    deactivate: async (id: number): Promise<void> => {
        const response = await api.patch<ApiResponse<string>>(`/users/${id}/deactivate`);

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to deactivate user');
        }
    },

    // PATCH /api/v1/users/:id/role — SuperAdmin only
    changeRole: async (id: number, roleName: string): Promise<void> => {
        const roleNumber = ROLE_TO_NUMBER[roleName];

        if (!roleNumber) {
            throw new Error(`Invalid role: ${roleName}`);
        }

        const response = await api.patch<ApiResponse<string>>(`/users/${id}/role`, {
            role: roleNumber  // Backend ChangeRoleDto: { Role: int }
        });

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to change role');
        }
    },
};