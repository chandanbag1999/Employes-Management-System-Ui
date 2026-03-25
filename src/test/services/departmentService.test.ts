import { describe, it, expect, vi, beforeEach } from 'vitest';
import { departmentService } from '@/services/departmentService';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import api from '@/lib/api';

describe('departmentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all departments', async () => {
      const mockDepartments = [
        { id: 1, name: 'Engineering', description: 'Tech team' },
        { id: 2, name: 'HR', description: 'Human Resources' },
      ];

      vi.mocked(api.get).mockResolvedValue({ data: { data: mockDepartments } });

      const result = await departmentService.getAll();

      expect(api.get).toHaveBeenCalledWith('/departments');
      expect(result).toEqual(mockDepartments);
    });

    it('should return empty array when no departments', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { data: [] } });

      const result = await departmentService.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should fetch department by id', async () => {
      const mockDepartment = { id: 1, name: 'Engineering' };

      vi.mocked(api.get).mockResolvedValue({ data: { data: mockDepartment } });

      const result = await departmentService.getById(1);

      expect(api.get).toHaveBeenCalledWith('/departments/1');
      expect(result).toEqual(mockDepartment);
    });
  });

  describe('create', () => {
    it('should create new department', async () => {
      const newDept = { name: 'Marketing', description: 'Marketing team' };
      const createdDept = { id: 1, ...newDept };

      vi.mocked(api.post).mockResolvedValue({ data: { data: createdDept } });

      const result = await departmentService.create(newDept);

      expect(api.post).toHaveBeenCalledWith('/departments', newDept);
      expect(result).toEqual(createdDept);
    });
  });

  describe('update', () => {
    it('should update department', async () => {
      const updatedDept = { id: 1, name: 'Marketing Updated' };

      vi.mocked(api.put).mockResolvedValue({ data: { data: updatedDept } });

      const result = await departmentService.update(1, { name: 'Marketing Updated' });

      expect(api.put).toHaveBeenCalledWith('/departments/1', { name: 'Marketing Updated' });
      expect(result).toEqual(updatedDept);
    });
  });

  describe('delete', () => {
    it('should delete department', async () => {
      vi.mocked(api.delete).mockResolvedValue({ data: { data: true } });

      const result = await departmentService.delete(1);

      expect(api.delete).toHaveBeenCalledWith('/departments/1');
      expect(result).toBeUndefined();
    });
  });
});