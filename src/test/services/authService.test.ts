import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '@/services/authService';

// Mock the api module
vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import api from '@/lib/api';

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockResponse = {
        token: 'mock-jwt-token',
        user: {
          id: 1,
          email: 'admin@ems.com',
          name: 'Alex Morgan',
          role: 'SuperAdmin',
        },
      };

      vi.mocked(api.post).mockResolvedValue({ data: { data: mockResponse } });

      const result = await authService.login('admin@ems.com', 'password123');

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'admin@ems.com',
        password: 'password123',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error with invalid credentials', async () => {
      vi.mocked(api.post).mockRejectedValue(new Error('Invalid credentials'));

      await expect(authService.login('invalid@ems.com', 'wrongpassword')).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'newuser@ems.com',
        name: 'New User',
        role: 'Employee',
      };

      vi.mocked(api.post).mockResolvedValue({ data: { data: mockUser } });

      const result = await authService.register({
        email: 'newuser@ems.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      });

      expect(api.post).toHaveBeenCalledWith('/auth/register', expect.any(Object));
      expect(result).toEqual(mockUser);
    });

    it('should throw error when registration fails', async () => {
      vi.mocked(api.post).mockRejectedValue(new Error('Email already exists'));

      await expect(
        authService.register({
          email: 'existing@ems.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        })
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'admin@ems.com',
        name: 'Alex Morgan',
        role: 'SuperAdmin',
      };

      vi.mocked(api.get).mockResolvedValue({ data: { data: mockUser } });

      const result = await authService.getCurrentUser();

      expect(api.get).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(mockUser);
    });

    it('should throw error when user fetch fails', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('Unauthorized'));

      await expect(authService.getCurrentUser()).rejects.toThrow('Unauthorized');
    });
  });
});
