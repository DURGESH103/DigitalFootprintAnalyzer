'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useReportStore } from '@/store/report.store';
import { reportService } from '@/services/report.service';
import { extractApiError } from '@/utils/helpers';

export const useReports = (page = 1) => {
  const { user } = useAuthStore();
  const { setReports, setCurrentReport } = useReportStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, pagination } = await reportService.getReports(user.id, page);
      setReports(data);
      setTotalPages(pagination.totalPages);
      setTotal(pagination.total);
      if (page === 1 && data.length) setCurrentReport(data[0]);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }, [user, page, setReports, setCurrentReport]);

  useEffect(() => { fetch(); }, [fetch]);

  return { loading, error, totalPages, total, retry: fetch };
};
