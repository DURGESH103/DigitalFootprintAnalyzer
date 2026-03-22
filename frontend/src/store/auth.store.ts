import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User } from '@/utils/types';
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/constants';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) => {
        Cookies.set(TOKEN_KEY, accessToken, { secure: true, sameSite: 'strict', expires: 1 / 96 }); // 15min
        Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { secure: true, sameSite: 'strict', expires: 7 });
        set({ user, accessToken, isAuthenticated: true });
      },

      clearAuth: () => {
        Cookies.remove(TOKEN_KEY);
        Cookies.remove(REFRESH_TOKEN_KEY);
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'dfa-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
