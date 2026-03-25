import { describe, it, expect, vi, beforeEach } from 'vitest';
import { leaveService } from '@/services/leaveService';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import api from '@/lib/api';

describe('leaveService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all leave records', async () => {
      const mockLeaves = [
        { id: 1, employeeId: 1, status: 'Pending' },
        { id: 2, employeeId: 2, status: 'Approved' },
      ];

      vi.mocked(api.get).mockResolvedValue({ data: { data: mockLeaves } });

      const result = await leaveService.getAll();

      expect(api.get).toHaveBeenCalled();
      expect(result).toEqual(mockLeaves);
    });
  });

  describe('getTypes', () => {
    it('should fetch leave types', async () => {
      const mockTypes = [
        { id: 1, name: 'Casual Leave', maxDays: 10 },
        { id: 2, name: 'Sick Leave', maxDays: 5 },
      ];

      vi.mocked(api.get).mockResolvedValue({ data: { data: mockTypes } });

      const result = await leaveService.getTypes();

      expect(api.get).toHaveBeenCalledWith('/leave/types');
      expect(result).toEqual(mockTypes);
    });
  });

  describe('apply', () => {
    it('should apply for leave', async () => {
      const leaveData = {
        leaveTypeId: 1,
        startDate: '2024-01-15',
        endDate: '2024-01-17',
        reason: 'Personal',
      };
      const mockLeave = { id: 1, ...leaveData, status: 'Pending' };

      vi.mocked(api.post).mockResolvedValue({ data: { data: mockLeave } });

      const result = await leaveService.apply(leaveData);

      expect(api.post).toHaveBeenCalledWith('/leave', leaveData);
      expect(result).toEqual(mockLeave);
    });
  });

  describe('updateStatus', () => {
    it('should update leave status to approved', async () => {
      const mockLeave = { id: 1, status: 'Approved' };

      vi.mocked(api.put).mockResolvedValue({ data: { data: mockLeave } });

      const result = await leaveService.updateStatus(1, { status: 'Approved' });

      expect(api.put).toHaveBeenCalledWith('/leave/1/action', { status: 'Approved' });
      expect(result).toEqual(mockLeave);
    });

    it('should update leave status to rejected', async () => {
      const mockLeave = { id: 1, status: 'Rejected' };

      vi.mocked(api.put).mockResolvedValue({ data: { data: mockLeave } });

      const result = await leaveService.updateStatus(1, { status: 'Rejected' });

      expect(api.put).toHaveBeenCalledWith('/leave/1/action', { status: 'Rejected' });
      expect(result).toEqual(mockLeave);
    });
  });
});