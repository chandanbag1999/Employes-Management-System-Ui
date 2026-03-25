import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dashboardService } from '@/services/dashboardService';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

import api from '@/lib/api';

describe('dashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getStats', () => {
    it('should fetch dashboard stats', async () => {
      const mockStats = {
        totalEmployees: 100,
        presentToday: 85,
        onLeave: 5,
        pendingLeaves: 3,
        totalPayroll: 500000,
        attendanceRate: 85.5,
      };

      vi.mocked(api.get).mockResolvedValue({
        data: { data: mockStats }
      });

      const result = await dashboardService.getStats();

      expect(api.get).toHaveBeenCalledWith('/dashboard/stats');
      expect(result).toEqual(mockStats);
    });
  });

  describe('getDepartmentHeadcount', () => {
    it('should fetch department headcount', async () => {
      const mockHeadcount = [
        { departmentName: 'Engineering', employeeCount: 50 },
        { departmentName: 'HR', employeeCount: 10 },
      ];

      vi.mocked(api.get).mockResolvedValue({
        data: { data: mockHeadcount }
      });

      const result = await dashboardService.getDepartmentHeadcount();

      expect(api.get).toHaveBeenCalledWith('/dashboard/headcount');
      expect(result).toEqual(mockHeadcount);
    });
  });

  describe('getRecentActivities', () => {
    it('should fetch recent activities', async () => {
      const mockActivities = [
        { id: '1', message: 'New employee joined', type: 'employee', timestamp: '2024-01-01' },
      ];

      vi.mocked(api.get).mockResolvedValue({
        data: { data: mockActivities }
      });

      const result = await dashboardService.getRecentActivities(10);

      expect(api.get).toHaveBeenCalledWith('/dashboard/activities?count=10');
      expect(result).toEqual(mockActivities);
    });
  });
});
