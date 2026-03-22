export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  ANALYSIS: '/analysis',
  PROFILE: '/profile',
} as const;

export const ANALYSIS_STEPS = [
  { key: 'fetch', label: 'Fetching GitHub data', percent: 20 },
  { key: 'process', label: 'Processing data', percent: 60 },
  { key: 'ai', label: 'Running AI analysis', percent: 90 },
  { key: 'done', label: 'Finalizing report', percent: 100 },
] as const;

export const CHART_COLORS = [
  '#58a6ff',
  '#bc8cff',
  '#3fb950',
  '#f78166',
  '#e3b341',
  '#79c0ff',
  '#d2a8ff',
];

export const PERSONALITY_ICONS: Record<string, string> = {
  'The Architect': '🏗️',
  'The Explorer': '🧭',
  'The Specialist': '🎯',
  'The Data Scientist': '📊',
  'The Builder': '🔨',
};

export const TOKEN_KEY = 'dfa_access_token';
export const REFRESH_TOKEN_KEY = 'dfa_refresh_token';
