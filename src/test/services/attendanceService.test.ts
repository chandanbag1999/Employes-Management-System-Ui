import { describe, it, expect, vi, beforeEach } from 'vitest';
import { attendanceService } from '@/services/attendanceService';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import api from '@/lib/api';

describe('attendanceService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all attendance records', async () => {
      const mockRecords = [
        { id: 1, employeeId: 1, date: '2024-01-01', status: 'Present' },
        { id: 2, employeeId: 2, date: '2024-01-01', status: 'Absent' },
      ];

      vi.mocked(api.get).mockResolvedValue({ data: { data: mockRecords } });

      const result = await attendanceService.getAll();

      expect(api.get).toHaveBeenCalled();
      expect(result).toEqual(mockRecords);
    });
  });

  describe('clockIn', () => {
    it('should clock in successfully', async () => {
      const mockRecord = { id: 1, employeeId: 1, clockIn: '09:00:00', status: 'Present' };

      vi.mocked(api.post).mockResolvedValue({ data: { data: mockRecord } });

      const result = await attendanceService.clockIn(1);

      expect(api.post).toHaveBeenCalledWith('/attendance/clock-in', { employeeId: 1 });
      expect(result).toEqual(mockRecord);
    });
  });

  describe('clockOut', () => {
    it('should clock out successfully', async () => {
      const mockRecord = { id: 1, employeeId: 1, clockOut: '18:00:00' };

      vi.mocked(api.post).mockResolvedValue({ data: { data: mockRecord } });

      const result = await attendanceService.clockOut(1);

      expect(api.post).toHaveBeenCalledWith('/attendance/clock-out', { recordId: 1 });
      expect(result).toEqual(mockRecord);
    });
  });
});