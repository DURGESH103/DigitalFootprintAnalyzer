import { type ClassValue, clsx } from 'clsx';

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const formatNumber = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
};

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export const getScoreColor = (score: number): string => {
  if (score >= 75) return 'text-accent-green';
  if (score >= 50) return 'text-accent-yellow';
  return 'text-accent-orange';
};

export const getScoreBg = (score: number): string => {
  if (score >= 75) return 'bg-accent-green';
  if (score >= 50) return 'bg-accent-yellow';
  return 'bg-accent-orange';
};

export const debounce = <T extends (...args: unknown[]) => void>(fn: T, ms: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
};

export const getHireabilityScore = (scores: {
  consistency: number;
  engagement: number;
  totalRepos: number;
  totalStars: number;
}): number => {
  const raw =
    scores.consistency * 0.4 +
    scores.engagement * 0.3 +
    Math.min(scores.totalRepos * 2, 20) +
    Math.min(scores.totalStars, 10);
  return Math.min(100, Math.round(raw));
};

/** Centralized API error message extractor */
export const extractApiError = (err: unknown): string => {
  const e = err as {
    response?: { data?: { message?: string; errors?: { field: string; message: string }[] } };
    message?: string;
  };
  const data = e?.response?.data;
  if (data?.errors?.length) {
    return data.errors.map((v) => `${v.field}: ${v.message}`).join(', ');
  }
  return data?.message || e?.message || 'Something went wrong';
};

/** GitHub username validation regex (matches backend Zod schema) */
export const isValidGithubUsername = (v: string): boolean =>
  /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(v);
