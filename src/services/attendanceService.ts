import api from '@/lib/api';
import type { AttendanceResponseDto } from '@/types/backend';

interface AttendanceFilter {
    employeeId?: number;
    departmentId?: number;
    fromDate?: string;
    toDate?: string;
    status?: string;
    page?: number;
    pageSize?: number;
}

interface PaginatedResult<T> {
    data: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

const extractPaginated = <T>(response: any): PaginatedResult<T> => {
    const d = response.data?.data;
    return {
        data: d?.data || d || [],
        totalCount: d?.totalCount || 0,
        page: d?.page || 1,
        pageSize: d?.pageSize || 10,
        totalPages: d?.totalPages || 1,
    };
};

export const attendanceService = {

    // ✅ GET /api/v1/attendance/my/today — apna aaj ka record
    getMyToday: async (): Promise<AttendanceResponseDto | null> => {
        try {
            const response = await api.get<any>('/attendance/my/today');
            return response.data?.data || null;
        } catch (err) {
            console.error('getMyToday error:', err);
            return null;
        }
    },

    // ✅ GET /api/v1/attendance/my/summary
    getMySummary: async (
        month: number,
        year: number
    ): Promise<any | null> => {
        try {
            const response = await api.get<any>(
                `/attendance/my/summary?month=${month}&year=${year}`
            );
            return response.data?.data || null;
        } catch (err) {
            console.error('getMySummary error:', err);
            return null;
        }
    },

    // ✅ POST /api/v1/attendance/clock-in — body mein kuch nahi chahiye
    clockIn: async (remarks?: string): Promise<AttendanceResponseDto> => {
        const response = await api.post<any>('/attendance/clock-in', {
            remarks: remarks || null
        });
        if (!response.data?.success) {
            throw new Error(response.data?.message || 'Clock in failed');
        }
        return response.data.data;
    },

    // ✅ POST /api/v1/attendance/clock-out
    clockOut: async (remarks?: string): Promise<AttendanceResponseDto> => {
        const response = await api.post<any>('/attendance/clock-out', {
            remarks: remarks || null
        });
        if (!response.data?.success) {
            throw new Error(response.data?.message || 'Clock out failed');
        }
        return response.data.data;
    },

    // GET /api/v1/attendance — Admin/Manager ke liye
    getAll: async (
        filter: AttendanceFilter = {}
    ): Promise<PaginatedResult<AttendanceResponseDto>> => {
        const params = new URLSearchParams();
        if (filter.employeeId)
            params.append('employeeId', filter.employeeId.toString());
        if (filter.departmentId)
            params.append('departmentId', filter.departmentId.toString());
        if (filter.fromDate) params.append('fromDate', filter.fromDate);
        if (filter.toDate) params.append('toDate', filter.toDate);
        if (filter.status) params.append('status', filter.status);
        if (filter.page) params.append('page', filter.page.toString());
        if (filter.pageSize)
            params.append('pageSize', filter.pageSize.toString());

        const response = await api.get<any>(`/attendance?${params}`);
        return extractPaginated<AttendanceResponseDto>(response);
    },

    // GET /api/v1/attendance/summary/:employeeId — Admin ke liye
    getMonthlySummary: async (
        employeeId: number,
        month: number,
        year: number
    ): Promise<any | null> => {
        try {
            const response = await api.get<any>(
                `/attendance/summary/${employeeId}?month=${month}&year=${year}`
            );
            return response.data?.data || null;
        } catch (err) {
            console.error('getMonthlySummary error:', err);
            return null;
        }
    },

    // POST /api/v1/attendance/manual — Admin only
    markManual: async (data: {
        employeeId: number;
        date: string;
        status: number;
        clockIn?: string;
        clockOut?: string;
        remarks?: string;
    }): Promise<AttendanceResponseDto> => {
        const response = await api.post<any>('/attendance/manual', data);
        if (!response.data?.success) {
            throw new Error(response.data?.message || 'Manual marking failed');
        }
        return response.data.data;
    },
};