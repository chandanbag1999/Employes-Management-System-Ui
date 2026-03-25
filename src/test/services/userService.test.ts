import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userService } from '@/services/userService';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

import api from '@/lib/api';

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all users', async () => {
      const mockUsers = [
        { id: 1, userName: 'Lucifer', email: 'lucifer@email.com', role: 'SuperAdmin', isActive: true },
        { id: 2, userName: 'Sarah', email: 'sarah@email.com', role: 'HRAdmin', isActive: true },
      ];

      vi.mocked(api.get).mockResolvedValue({
        data: { data: mockUsers }
      });

      const result = await userService.getAll();

      expect(api.get).toHaveBeenCalledWith('/users');
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getById', () => {
    it('should fetch user by id', async () => {
      const mockUser = { id: 1, userName: 'Lucifer', email: 'lucifer@email.com', role: 'SuperAdmin', isActive: true };

      vi.mocked(api.get).mockResolvedValue({
        data: { data: mockUser }
      });

      const result = await userService.getById(1);

      expect(api.get).toHaveBeenCalledWith('/users/1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('deactivate', () => {
    it('should deactivate user', async () => {
      vi.mocked(api.patch).mockResolvedValue({});

      await userService.deactivate(1);

      expect(api.patch).toHaveBeenCalledWith('/users/1/deactivate');
    });
  });
});
