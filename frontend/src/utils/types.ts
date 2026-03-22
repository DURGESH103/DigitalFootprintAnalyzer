export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  public_slug?: string;
  is_public?: boolean;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LanguageCount { lang: string; count: number; }
export interface ActivityPattern { day: number; night: number; }
export interface WeeklyTrend { week: string; count: number; }

export interface Scores {
  consistency:    number;
  engagement:     number;
  visibility:     number;
  growth:         number;
  influence:      number;
  hireability:    number;
  totalRepos:     number;
  totalStars:     number;
  totalForks:     number;
  totalCommits:   number;
  topLanguages:   LanguageCount[];
  activityPattern: ActivityPattern;
  weeklyTrend:    WeeklyTrend[];
}

export interface AiInsights {
  personality_type: string;
  digital_persona:  string;
  strengths:        string[];
  weaknesses:       string[];
  suggestions:      string[];
  summary:          string;
  behavior_tags:    string[];
  growth_verdict:   string;
}

export interface ComparisonDimension {
  score:      number;
  avg:        number;
  percentile: number;
  label:      string;
}

export interface Comparison {
  consistency:  ComparisonDimension;
  engagement:   ComparisonDimension;
  visibility:   ComparisonDimension;
  growth:       ComparisonDimension;
  influence:    ComparisonDimension;
  hireability:  ComparisonDimension;
}

export interface PlatformData {
  linkedin?:      Record<string, unknown> | null;
  twitter?:       Record<string, unknown> | null;
  stackoverflow?: Record<string, unknown> | null;
}

export interface Report {
  id:              number;
  github_username: string;
  platforms:       PlatformData;
  scores:          Scores;
  ai_insights:     AiInsights;
  comparison:      Comparison;
  created_at:      string;
}

export interface PaginatedReports {
  data: Report[];
  pagination: { total: number; page: number; limit: number; totalPages: number; };
}

export interface ConnectedAccount {
  provider:     string;
  username:     string;
  display_name: string | null;
  avatar_url:   string | null;
  profile_url:  string | null;
  is_verified:  boolean;
  created_at:   string;
}

export interface ChatMessage {
  role:       'user' | 'assistant';
  content:    string;
  created_at?: string;
}

export interface Notification {
  id:         number;
  type:       string;
  title:      string;
  body:       string | null;
  is_read:    boolean;
  created_at: string;
}

export interface PublicProfile {
  name:         string;
  slug:         string;
  avatarUrl:    string | null;
  memberSince:  string;
  totalReports: number;
  latestReport: {
    githubUsername: string;
    scores:         Scores;
    aiInsights:     AiInsights;
    comparison:     Comparison;
    createdAt:      string;
  } | null;
}

export interface ProgressEvent {
  step:      string;
  percent:   number;
  reportId?: number;
  error?:    string;
}

export interface ApiError {
  message: string;
  errors?: { field: string; message: string }[];
}
