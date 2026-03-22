'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES, REFRESH_TOKEN_KEY } from '@/constants';
import Cookies from 'js-cookie';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const { setAuth, clearAuth } = useAuthStore();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success(`Welcome back, ${data.user.name}!`);
      router.push(ROUTES.DASHBOARD);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const data = await authService.signup({ name, email, password });
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Account created! Welcome 🎉');
      router.push(ROUTES.DASHBOARD);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Signup failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      await authService.logout(refreshToken).catch(() => {});
    }
    clearAuth();
    toast.success('Logged out');
    router.push(ROUTES.LOGIN);
  };

  return { login, signup, logout, loading };
};
