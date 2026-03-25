import { describe, it, expect, vi, beforeEach } from 'vitest';
import { designationService } from '@/services/designationService';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import api from '@/lib/api';

describe('designationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all designations', async () => {
      const mockDesignations = [
        { id: 1, title: 'Software Engineer', departmentId: 1, level: 1 },
        { id: 2, title: 'Senior Engineer', departmentId: 1, level: 2 },
      ];

      vi.mocked(api.get).mockResolvedValue({ data: { data: mockDesignations } });

      const result = await designationService.getAll();

      expect(api.get).toHaveBeenCalledWith('/designations');
      expect(result).toEqual(mockDesignations);
    });
  });

  describe('getById', () => {
    it('should fetch designation by id', async () => {
      const mockDesignation = { id: 1, title: 'Software Engineer' };

      vi.mocked(api.get).mockResolvedValue({ data: { data: mockDesignation } });

      const result = await designationService.getById(1);

      expect(api.get).toHaveBeenCalled();
      expect(result).toEqual(mockDesignation);
    });
  });

  describe('create', () => {
    it('should create new designation', async () => {
      const newDesignation = { title: 'Tech Lead', departmentId: 1, level: 3 };
      const createdDesignation = { id: 1, ...newDesignation };

      vi.mocked(api.post).mockResolvedValue({ data: { data: createdDesignation } });

      const result = await designationService.create(newDesignation);

      expect(api.post).toHaveBeenCalledWith('/designations', newDesignation);
      expect(result).toEqual(createdDesignation);
    });
  });

  describe('delete', () => {
    it('should delete designation', async () => {
      vi.mocked(api.delete).mockResolvedValue({ data: { data: true } });

      const result = await designationService.delete(1);

      expect(api.delete).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });
});