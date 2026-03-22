import api from './api';
import { ChatMessage, ConnectedAccount, Notification, PublicProfile } from '@/utils/types';

// ── Chat ──────────────────────────────────────────────────────────────────
export const chatService = {
  send:       (message: string, reportId?: number) =>
    api.post<{ reply: string; reportId: number | null }>('/chat', { message, reportId }),
  getHistory: (reportId?: number) =>
    api.get<ChatMessage[]>('/chat', { params: reportId ? { reportId } : {} }),
  clear:      (reportId?: number) =>
    api.delete('/chat', { params: reportId ? { reportId } : {} }),
};

// ── Notifications ─────────────────────────────────────────────────────────
export const notificationService = {
  getAll:   () => api.get<{ notifications: Notification[]; unread: number }>('/notifications'),
  markRead: () => api.patch('/notifications/read'),
};

// ── Platform connections ──────────────────────────────────────────────────
export const platformService = {
  getAll:     () => api.get<ConnectedAccount[]>('/platforms'),
  connect:    (data: { provider: string; username: string; displayName?: string }) =>
    api.post('/platforms', data),
  disconnect: (provider: string) => api.delete(`/platforms/${provider}`),
};

// ── Public profile ────────────────────────────────────────────────────────
export const publicService = {
  getProfile:     (slug: string) => api.get<PublicProfile>(`/public/${slug}`),
  updateSettings: (data: { isPublic: boolean; slug?: string }) =>
    api.patch('/public/settings', data),
};
