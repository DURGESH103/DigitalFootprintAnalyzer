export const API_BASE   = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:3000/api/v1';
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

export const ROUTES = {
  HOME:        '/',
  LOGIN:       '/login',
  SIGNUP:      '/signup',
  DASHBOARD:   '/dashboard',
  ANALYSIS:    '/analysis',
  PROFILE:     '/profile',
  CHAT:        '/chat',
  COMPARE:     '/compare',
  PUBLIC:      '/u',
} as const;

export const ANALYSIS_STEPS = [
  { key: 'github',        label: 'Fetching GitHub data',       percent: 15 },
  { key: 'linkedin',      label: 'Fetching LinkedIn data',     percent: 30 },
  { key: 'twitter',       label: 'Fetching Twitter data',      percent: 45 },
  { key: 'stackoverflow', label: 'Fetching StackOverflow',     percent: 55 },
  { key: 'ai',            label: 'Running AI analysis',        percent: 70 },
  { key: 'saving',        label: 'Saving report',              percent: 90 },
  { key: 'done',          label: 'Done',                       percent: 100 },
] as const;

export const PLATFORMS = [
  { id: 'github',        label: 'GitHub',        icon: 'Github',   color: '#e6edf3', required: true  },
  { id: 'linkedin',      label: 'LinkedIn',      icon: 'Linkedin', color: '#0a66c2', required: false },
  { id: 'twitter',       label: 'Twitter / X',   icon: 'Twitter',  color: '#1d9bf0', required: false },
  { id: 'stackoverflow', label: 'StackOverflow', icon: 'Code2',    color: '#f48024', required: false },
] as const;

export const CHART_COLORS = ['#58a6ff','#bc8cff','#3fb950','#f78166','#e3b341','#79c0ff','#d2a8ff'];

export const PERSONALITY_ICONS: Record<string, string> = {
  'The Architect':     '🏗️',
  'The Explorer':      '🧭',
  'The Specialist':    '🎯',
  'The Data Scientist':'📊',
  'The Builder':       '🔨',
  'The Influencer':    '📣',
  'The Networker':     '🤝',
};

export const SCORE_LABELS: Record<string, string> = {
  hireability:  'Hireability',
  consistency:  'Consistency',
  visibility:   'Visibility',
  growth:       'Growth',
  influence:    'Influence',
  engagement:   'Engagement',
};

export const TOKEN_KEY         = 'dfa_access_token';
export const REFRESH_TOKEN_KEY = 'dfa_refresh_token';
