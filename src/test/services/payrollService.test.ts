import { describe, it, expect, vi, beforeEach } from 'vitest';
import { payrollService } from '@/services/payrollService';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import api from '@/lib/api';

describe('payrollService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all payroll records', async () => {
      const mockRecords = [
        { id: 1, employeeId: 1, month: 'January', year: 2024 },
        { id: 2, employeeId: 2, month: 'January', year: 2024 },
      ];

      vi.mocked(api.get).mockResolvedValue({ data: { data: mockRecords } });

      const result = await payrollService.getAll();

      expect(api.get).toHaveBeenCalled();
      expect(result).toEqual(mockRecords);
    });
  });

  describe('getById', () => {
    it('should fetch payroll by id', async () => {
      const mockRecord = { id: 1, employeeId: 1, month: 'January', year: 2024 };

      vi.mocked(api.get).mockResolvedValue({ data: { data: mockRecord } });

      const result = await payrollService.getById(1);

      expect(api.get).toHaveBeenCalledWith('/payroll/1');
      expect(result).toEqual(mockRecord);
    });
  });

  describe('runPayroll', () => {
    it('should run payroll for employees', async () => {
      const mockResult = [{ id: 1, grossSalary: 50000, netSalary: 40000 }];

      vi.mocked(api.post).mockResolvedValue({ data: { data: mockResult } });

      const result = await payrollService.runPayroll({ month: 1, year: 2024 });

      expect(api.post).toHaveBeenCalledWith('/payroll/run', { month: 1, year: 2024 });
      expect(result).toEqual(mockResult);
    });
  });
});