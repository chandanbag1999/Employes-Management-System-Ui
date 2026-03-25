import api from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { AttendanceResponseDto } from '@/types/backend';

interface AttendanceFilter {
    employeeId?: number;
    date?: string;
    status?: string;
    page?: number;
    pageSize?: number;
}

export const attendanceService = {
    // GET /api/v1/attendance
    getAll: async (filter: AttendanceFilter = {}): Promise<any> => {
        const params = new URLSearchParams();
        if (filter.employeeId) params.append('employeeId', filter.employeeId.toString());
        if (filter.date) params.append('date', filter.date);
        if (filter.status) params.append('status', filter.status);
        if (filter.page) params.append('page', filter.page.toString());
        if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());

        const response = await api.get<ApiResponse<any>>(`/attendance?${params}`);
        return response.data.data;
    },

    // POST /api/v1/attendance/clock-in
    clockIn: async (employeeId: number): Promise<AttendanceResponseDto> => {
        const response = await api.post<ApiResponse<AttendanceResponseDto>>('/attendance/clock-in', { employeeId });
        return response.data.data;
    },

    // POST /api/v1/attendance/clock-out
    clockOut: async (recordId: number): Promise<AttendanceResponseDto> => {
        const response = await api.post<ApiResponse<AttendanceResponseDto>>('/attendance/clock-out', { recordId });
        return response.data.data;
    },

    // POST /api/v1/attendance/manual
    addManual: async (data: {
        employeeId: number;
        date: string;
        clockIn?: string;
        clockOut?: string;
    }): Promise<AttendanceResponseDto> => {
        const response = await api.post<ApiResponse<AttendanceResponseDto>>('/attendance/manual', data);
        return response.data.data;
    },
};