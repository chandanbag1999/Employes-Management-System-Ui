import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Role } from '@/types/index';
import { authService } from '@/services/authService';
import type { AuthResponse } from '@/types/backend';

// Internal helper — Zustand state ke bahar rakha taaki TypeScript happy rahe
const buildUserFromAuthResponse = (data: AuthResponse): User => ({
  // AuthResponse mein ID nahi hoti, isliye email ko temporary ID banate hain
  // getMe() call ke baad proper ID aa jayegi (future enhancement)
  id: data.email,
  email: data.email,
  name: data.userName,
  role: data.role as Role,
});

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Public Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (userName: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({ email, password });

          // localStorage mein daalo — Axios interceptor ke liye
          localStorage.setItem('ems-token', response.accessToken);
          localStorage.setItem('ems-refresh-token', response.refreshToken);

          set({
            user: buildUserFromAuthResponse(response),
            token: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'Login failed. Please check your credentials.';
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      register: async (userName: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register({ userName, email, password });

          localStorage.setItem('ems-token', response.accessToken);
          localStorage.setItem('ems-refresh-token', response.refreshToken);

          set({
            user: buildUserFromAuthResponse(response),
            token: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'Registration failed. Please try again.';
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      logout: async () => {
        // Backend se refresh token revoke karo
        try {
          await authService.logout();
        } catch (error) {
          // Logout API fail ho toh bhi local clear karo — user stuck nahi rehna chahiye
          console.error('Logout API failed, forcing local logout', error);
        } finally {
          localStorage.removeItem('ems-token');
          localStorage.removeItem('ems-refresh-token');
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'ems-auth',
      // Sirf yeh fields persist karo localStorage mein
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);