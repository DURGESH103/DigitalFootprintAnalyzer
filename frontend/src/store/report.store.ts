import { create } from 'zustand';
import { Report, ProgressEvent } from '@/utils/types';

interface ReportState {
  reports: Report[];
  currentReport: Report | null;
  progress: ProgressEvent | null;
  isAnalyzing: boolean;
  isLoading: boolean;
  error: string | null;
  jobId: string | null;

  setReports: (reports: Report[]) => void;
  setCurrentReport: (report: Report | null) => void;
  setProgress: (progress: ProgressEvent) => void;
  setAnalyzing: (v: boolean, jobId?: string | null) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  reset: () => void;
}

export const useReportStore = create<ReportState>((set) => ({
  reports: [],
  currentReport: null,
  progress: null,
  isAnalyzing: false,
  isLoading: false,
  error: null,
  jobId: null,

  setReports: (reports) => set({ reports }),
  setCurrentReport: (currentReport) => set({ currentReport }),
  setProgress: (progress) => set({ progress }),
  setAnalyzing: (isAnalyzing, jobId = null) => set({ isAnalyzing, jobId }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ progress: null, isAnalyzing: false, jobId: null, error: null }),
}));
