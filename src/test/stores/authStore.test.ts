import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '@/store/authStore';

// Mock the authService
vi.mock('@/services/authService', () => ({
  authService: {
    login: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

import { authService } from '@/services/authService';

describe('authStore', () => {
  beforeEach(() => {
    // Reset the store state
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have null user initially', () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
    });

    it('should not be authenticated initially', () => {
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should not be loading initially', () => {
      const state = useAuthStore.getState();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('login', () => {
    it('should set user and token on successful login', async () => {
      // Backend returns flat structure directly (not wrapped in ApiResponse)
      vi.mocked(authService.login).mockResolvedValue({
        token: 'mock-jwt-token',
        userName: 'Lucifer',
        email: 'lucifer123@email.com',
        role: 'SuperAdmin',
        expiresAt: '2024-01-01T00:00:00Z',
      });

      const result = await useAuthStore.getState().login('lucifer123@email.com', 'Password@123');

      expect(result).toBe(true);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().user).toEqual(expect.objectContaining({
        email: 'lucifer123@email.com',
        name: 'Lucifer',
        role: 'SuperAdmin',
      }));
    });

    it('should set error on failed login', async () => {
      vi.mocked(authService.login).mockRejectedValue(new Error('Invalid credentials'));

      const result = await useAuthStore.getState().login('wrong@ems.com', 'wrong');

      expect(result).toBe(false);
      expect(useAuthStore.getState().error).toBe('Invalid credentials');
    });

    it('should set isLoading during login', async () => {
      vi.mocked(authService.login).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({
          token: 'test-token',
          userName: 'Test User',
          email: 'test@test.com',
          role: 'Employee',
          expiresAt: '2024-01-01T00:00:00Z',
        }), 100))
      );

      const loginPromise = useAuthStore.getState().login('test@test.com', 'password');
      
      await loginPromise;
      
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear user and token on logout', async () => {
      // First login to set state
      vi.mocked(authService.login).mockResolvedValue({
        token: 'mock-token',
        userName: 'Admin',
        email: 'admin@ems.com',
        role: 'SuperAdmin',
        expiresAt: '2024-01-01T00:00:00Z',
      });
      
      await useAuthStore.getState().login('admin@ems.com', 'password');
      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      // Then logout
      useAuthStore.getState().logout();
      
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().token).toBe(null);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('should clear localStorage on logout', () => {
      localStorage.setItem('ems-token', 'test-token');
      
      useAuthStore.getState().logout();
      
      expect(localStorage.getItem('ems-token')).toBeNull();
    });
  });

  describe('switchRole', () => {
    it('should change user role', async () => {
      // First login
      vi.mocked(authService.login).mockResolvedValue({
        token: 'mock-token',
        userName: 'Admin',
        email: 'admin@ems.com',
        role: 'SuperAdmin',
        expiresAt: '2024-01-01T00:00:00Z',
      });
      
      await useAuthStore.getState().login('admin@ems.com', 'password');
      
      // Then switch role
      useAuthStore.getState().switchRole('HRAdmin');
      
      expect(useAuthStore.getState().user?.role).toBe('HRAdmin');
    });
  });

  describe('clearError', () => {
    it('should clear error state', async () => {
      // Set an error first
      vi.mocked(authService.login).mockRejectedValue(new Error('Failed'));
      
      await useAuthStore.getState().login('test@test.com', 'password').catch(() => {});
      expect(useAuthStore.getState().error).not.toBeNull();

      // Clear error
      useAuthStore.getState().clearError();
      
      expect(useAuthStore.getState().error).toBeNull();
    });
  });
});
