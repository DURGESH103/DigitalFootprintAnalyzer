import api from './api';
import { PaginatedReports } from '@/utils/types';

export const githubService = {
  fetchProfile: (username: string) =>
    api.get(`/github/${username}`).then((r) => r.data),
};

export const reportService = {
  analyze: (githubUsername: string) =>
    api.post<{ jobId: string; message: string }>('/report/analyze', { githubUsername }).then((r) => r.data),

  getReports: (userId: number, page = 1, limit = 10) =>
    api.get<PaginatedReports>(`/report/${userId}`, { params: { page, limit } }).then((r) => r.data),
};
