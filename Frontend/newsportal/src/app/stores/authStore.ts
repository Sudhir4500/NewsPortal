'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getCookie, setCookie, removeCookie } from '@/app/api/cookie';
import { apiPost, apiGet } from '../api/api';
import { AuthResponse, User } from '@/app/types/auth';
import { useRouter } from 'next/navigation';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  refreshAccessToken: () => Promise<void>;
  checkTokenValidity: () => Promise<boolean>;
}

// Helper function to decode JWT and check if it's expired
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiry;
  } catch (error) {
    return true; // If token is invalid or malformed, treat as expired
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      login: async (email: string, password: string) => {
        try {
          const response = await apiPost<AuthResponse>('/auth/login/', { email, password });
          set({
            isAuthenticated: true,
            user: response.user,
            accessToken: response.access,
            refreshToken: response.refresh,
          });
          setCookie('access_token', response.access, { path: '/', secure: true, sameSite: 'strict' });
          setCookie('refresh_token', response.refresh, { path: '/', secure: true, sameSite: 'strict' });
        } catch (error: any) {
          const message = error.response?.data?.detail || 'Login failed. Please check your credentials.';
          throw new Error(message);
        }
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        });
        removeCookie('access_token', { path: '/' });
        removeCookie('refresh_token', { path: '/' });
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      },
      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },
      refreshAccessToken: async () => {
        try {
          const { refreshToken } = get();
          if (!refreshToken || isTokenExpired(refreshToken)) {
            get().logout();
            throw new Error('No valid refresh token available');
          }
          const response = await apiPost<AuthResponse>('/auth/refresh/', { refresh: refreshToken });
          set({
            isAuthenticated: true,
            accessToken: response.access,
          });
          setCookie('access_token', response.access, { path: '/', secure: true, sameSite: 'strict' });
        } catch (error: any) {
          get().logout();
          throw new Error('Session expired. Please log in again.');
        }
      },
      checkTokenValidity: async () => {
        const { accessToken, refreshAccessToken } = get();
        if (!accessToken || isTokenExpired(accessToken)) {
          try {
            await refreshAccessToken();
            return true;
          } catch (error) {
            get().logout();
            return false;
          }
        }
        // Verify user session with backend
        try {
          await apiGet('/auth/me/'); // Endpoint to verify user session
          return true;
        } catch (error: any) {
          get().logout();
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Periodic token check for background validation
export const startTokenCheck = () => {
  const interval = setInterval(async () => {
    const { checkTokenValidity } = useAuthStore.getState();
    await checkTokenValidity();
  }, 60 * 1000); // Check every 1 minute
  return () => clearInterval(interval);
};