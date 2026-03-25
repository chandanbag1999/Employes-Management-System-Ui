import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Role } from '@/types';
import { authService } from '@/services';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authService.login(email, password);

          if (!response || !response.token) {
            throw new Error('Invalid response from server');
          }

          localStorage.setItem('ems-token', response.token);

          const user: User = {
            id: '1',
            email: response.email,
            name: response.userName,
            role: response.role as Role,
            avatar: '',
          };

          set({ user, token: response.token, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Login failed';
          set({
            error: errorMessage,
            isLoading: false
          });
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('ems-token');
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      switchRole: (role: Role) => {
        set((state) => ({
          user: state.user ? { ...state.user, role } : null,
        }));
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    { name: 'ems-auth' }
  )
);
