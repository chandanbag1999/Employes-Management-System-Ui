import api from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { PayrollRecordResponseDto } from '@/types/backend';

interface PayrollFilter {
    employeeId?: number;
    month?: number;
    year?: number;
    status?: string;
    page?: number;
    pageSize?: number;
}

export const payrollService = {
    // GET /api/v1/payroll
    getAll: async (filter: PayrollFilter = {}): Promise<any> => {
        const params = new URLSearchParams();
        if (filter.employeeId) params.append('employeeId', filter.employeeId.toString());
        if (filter.month) params.append('month', filter.month.toString());
        if (filter.year) params.append('year', filter.year.toString());
        if (filter.status) params.append('status', filter.status);
        if (filter.page) params.append('page', filter.page.toString());
        if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());

        const response = await api.get<ApiResponse<any>>(`/payroll?${params}`);
        return response.data.data;
    },

    // GET /api/v1/payroll/:id
    getById: async (id: number): Promise<PayrollRecordResponseDto> => {
        const response = await api.get<ApiResponse<PayrollRecordResponseDto>>(`/payroll/${id}`);
        return response.data.data;
    },

    // POST /api/v1/payroll/run
    runPayroll: async (data: { month: number; year: number; employeeIds?: number[] }): Promise<any> => {
        const response = await api.post<ApiResponse<any>>('/payroll/run', data);
        return response.data.data;
    },

    // GET /api/v1/payroll/payslips/:employeeId
    getAllPayslips: async (employeeId: number): Promise<any[]> => {
        try {
            const response = await api.get<any>(`/payroll/payslips/${employeeId}`);
            return response.data?.data || [];
        } catch (err) {
            console.error('getAllPayslips error:', err);
            return [];
        }
    },
};
