import { describe, it, expect, vi, beforeEach } from 'vitest';
import { performanceService } from '@/services/performanceService';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import api from '@/lib/api';

describe('performanceService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getGoals', () => {
    it('should fetch performance goals', async () => {
      const mockGoals = [
        { id: 1, employeeId: 1, title: 'Complete Project', progress: 50 },
      ];

      vi.mocked(api.get).mockResolvedValue({ data: { data: mockGoals } });

      const result = await performanceService.getGoals({ employeeId: 1 });

      expect(api.get).toHaveBeenCalled();
      expect(result).toEqual(mockGoals);
    });
  });

  describe('getReviews', () => {
    it('should fetch performance reviews', async () => {
      const mockReviews = [
        { id: 1, employeeId: 1, rating: 4, period: 'Q1 2024' },
      ];

      vi.mocked(api.get).mockResolvedValue({ data: { data: mockReviews } });

      const result = await performanceService.getReviews({ employeeId: 1 });

      expect(api.get).toHaveBeenCalled();
      expect(result).toEqual(mockReviews);
    });
  });

  describe('createGoal', () => {
    it('should create a new goal', async () => {
      const goalData = { 
        employeeId: 1,
        title: 'New Goal', 
        description: 'Description', 
        dueDate: '2024-12-31' 
      };
      const mockGoal = { id: 1, ...goalData, progress: 0, status: 'InProgress' };

      vi.mocked(api.post).mockResolvedValue({ data: { data: mockGoal } });

      const result = await performanceService.createGoal(goalData);

      expect(api.post).toHaveBeenCalledWith('/performance/goals', goalData);
      expect(result).toEqual(mockGoal);
    });
  });
});