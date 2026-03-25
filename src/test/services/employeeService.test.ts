import { describe, it, expect, vi, beforeEach } from 'vitest';
import { employeeService } from '@/services/employeeService';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import api from '@/lib/api';

describe('employeeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all employees', async () => {
      const mockEmployees = [
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@ems.com' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@ems.com' },
      ];

      vi.mocked(api.get).mockResolvedValue({ data: { data: mockEmployees } });

      const result = await employeeService.getAll();

      expect(api.get).toHaveBeenCalled();
      expect(result).toEqual(mockEmployees);
    });

    it('should return empty array when no employees', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { data: [] } });

      const result = await employeeService.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should fetch employee by id', async () => {
      const mockEmployee = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@ems.com' };

      vi.mocked(api.get).mockResolvedValue({ data: { data: mockEmployee } });

      const result = await employeeService.getById(1);

      expect(api.get).toHaveBeenCalledWith('/employees/1');
      expect(result).toEqual(mockEmployee);
    });

    it('should throw error when employee not found', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('Not Found'));

      await expect(employeeService.getById(999)).rejects.toThrow('Not Found');
    });
  });

  describe('create', () => {
    it('should create new employee', async () => {
      const newEmployee = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@ems.com',
        phone: '1234567890',
        gender: 'Male' as 'Male' | 'Female' | 'Other',
        dateOfBirth: '1990-01-01',
        joiningDate: '2024-01-01',
        departmentId: 1,
      };
      const createdEmployee = { id: 1, ...newEmployee, status: 'Active' };

      vi.mocked(api.post).mockResolvedValue({ data: { data: createdEmployee } });

      const result = await employeeService.create(newEmployee);

      expect(api.post).toHaveBeenCalledWith('/employees', newEmployee);
      expect(result).toEqual(createdEmployee);
    });
  });

  describe('update', () => {
    it('should update existing employee', async () => {
      const updatedEmployee = {
        id: 1,
        firstName: 'John Updated',
        lastName: 'Doe',
        email: 'john@ems.com',
        phone: '1234567890',
        gender: 'Male' as 'Male' | 'Female' | 'Other',
        dateOfBirth: '1990-01-01',
        joiningDate: '2024-01-01',
        departmentId: 1,
        status: 'Active' as 'Active' | 'Inactive' | 'OnLeave',
      };

      vi.mocked(api.put).mockResolvedValue({ data: { data: updatedEmployee } });

      const result = await employeeService.update(1, updatedEmployee);

      expect(api.put).toHaveBeenCalledWith('/employees/1', updatedEmployee);
      expect(result).toEqual(updatedEmployee);
    });
  });

  describe('delete', () => {
    it('should delete employee by id', async () => {
      vi.mocked(api.delete).mockResolvedValue({ data: { data: true } });

      const result = await employeeService.delete(1);

      expect(api.delete).toHaveBeenCalledWith('/employees/1');
      expect(result).toBeUndefined();
    });
  });
});