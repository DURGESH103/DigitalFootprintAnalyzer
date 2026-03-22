export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LanguageCount {
  lang: string;
  count: number;
}

export interface ActivityPattern {
  day: number;
  night: number;
}

export interface Scores {
  consistency: number;
  engagement: number;
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  topLanguages: LanguageCount[];
  activityPattern: ActivityPattern;
}

export interface AiInsights {
  personality_type: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  summary: string;
}

export interface Report {
  id: number;
  github_username: string;
  scores: Scores;
  ai_insights: AiInsights;
  created_at: string;
}

export interface PaginatedReports {
  data: Report[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GithubProfile {
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

export interface ProgressEvent {
  step: string;
  percent: number;
  reportId?: number;
  error?: string;
}

export interface ApiError {
  message: string;
  errors?: { field: string; message: string }[];
}
