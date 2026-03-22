import api from './api';
import { PaginatedReports, Report } from '@/utils/types';

export const reportService = {
  analyze: (githubUsername: string, platforms: Record<string, string> = {}) =>
    api.post<{ jobId: string }>('/report', { githubUsername, platforms })
      .then(r => r.data),

  getReports: (page = 1, limit = 10) =>
    api.get<PaginatedReports>('/report', { params: { page, limit } }).then(r => r.data),

  getReport: (id: number) =>
    api.get<Report>(`/report/${id}`).then(r => r.data),
};
