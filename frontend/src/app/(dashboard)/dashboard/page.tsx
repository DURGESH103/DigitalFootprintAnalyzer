'use client';

import { Star, GitFork, BookOpen, Code2, GitCommit, Sparkles, Clock, TrendingUp } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useReportStore } from '@/store/report.store';
import { useReports } from '@/hooks/useReports';
import { AnalyzeForm } from '@/features/dashboard/AnalyzeForm';
import { InsightBox } from '@/features/dashboard/InsightBox';
import { ComparisonCard } from '@/features/dashboard/ComparisonCard';
import { PlatformStats } from '@/features/dashboard/PlatformStats';
import { StatCard } from '@/components/ui/StatCard';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { LanguagePieChart } from '@/components/charts/LanguagePieChart';
import { ActivityBarChart } from '@/components/charts/ActivityBarChart';
import { WeeklyTrendChart } from '@/components/charts/WeeklyTrendChart';
import { SkeletonDashboard } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatNumber, formatDate } from '@/utils/helpers';
import Link from 'next/link';
import { ROUTES } from '@/constants';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { currentReport, reports } = useReportStore();
  const { loading, error, retry } = useReports();

  const report = currentReport;
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Welcome back, <span className="gradient-text">{firstName}</span> 👋
            </h1>
            <p className="text-sm text-text-muted mt-1">
              {report
                ? `Viewing report for @${report.github_username} · ${formatDate(report.created_at)}`
                : 'Analyze your complete digital footprint across all platforms'}
            </p>
          </div>
          {reports.length > 0 && (
            <Link href={ROUTES.PROFILE}>
              <Button variant="secondary" size="sm">
                <Clock className="h-3.5 w-3.5" />
                {reports.length} {reports.length === 1 ? 'Report' : 'Reports'}
              </Button>
            </Link>
          )}
        </div>
      </motion.div>

      {/* Analyze form */}
      <AnalyzeForm />

      {loading && <SkeletonDashboard />}
      {!loading && error && <ErrorState message={error} onRetry={retry} />}

      {!loading && !error && !report && (
        <EmptyState
          icon="🔭"
          title="No analysis yet"
          description="Enter your GitHub username above and optionally add LinkedIn, Twitter, and StackOverflow for a complete multi-platform AI analysis."
          action={
            <Link href={ROUTES.CHAT}>
              <Button size="sm" variant="secondary">
                <Sparkles className="h-3.5 w-3.5" />
                Ask AI Assistant
              </Button>
            </Link>
          }
        />
      )}

      {!loading && !error && report && (
        <ErrorBoundary>
          <>
            {/* Platform stats */}
            <PlatformStats platforms={report.platforms} githubUsername={report.github_username} />

            {/* Score rings */}
            <Card shine className="relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(88,166,255,0.05), transparent)' }}
                aria-hidden="true"
              />
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-5">Score Overview</h3>
              <div className="flex flex-wrap items-center justify-around gap-6 py-2">
                <ScoreRing score={report.scores.hireability}  label="Hireability"  size={96} />
                <ScoreRing score={report.scores.consistency}  label="Consistency"  size={96} />
                <ScoreRing score={report.scores.visibility}   label="Visibility"   size={96} />
                <ScoreRing score={report.scores.growth}       label="Growth"       size={96} />
                <ScoreRing score={report.scores.influence}    label="Influence"    size={96} />
              </div>
            </Card>

            {/* Behavior tags */}
            {report.ai_insights.behavior_tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {report.ai_insights.behavior_tags.map(tag => (
                  <Badge key={tag} variant="purple">{tag}</Badge>
                ))}
                <span className="text-xs text-text-muted self-center ml-1">
                  {report.ai_insights.growth_verdict}
                </span>
              </div>
            )}

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <StatCard title="Repos"    value={report.scores.totalRepos}                     icon={<BookOpen   className="h-4 w-4" />} accent="brand"  delay={0}    />
              <StatCard title="Stars"    value={formatNumber(report.scores.totalStars)}        icon={<Star       className="h-4 w-4" />} accent="yellow" delay={0.05} />
              <StatCard title="Forks"    value={formatNumber(report.scores.totalForks)}        icon={<GitFork    className="h-4 w-4" />} accent="purple" delay={0.1}  />
              <StatCard title="Commits"  value={formatNumber(report.scores.totalCommits)}      icon={<GitCommit  className="h-4 w-4" />} accent="green"  delay={0.15} />
              <StatCard title="Language" value={report.scores.topLanguages[0]?.lang || 'N/A'} icon={<Code2      className="h-4 w-4" />} accent="orange" delay={0.2}  />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <ErrorBoundary fallback={<ErrorState message="Chart failed" />}>
                <LanguagePieChart data={report.scores.topLanguages} />
              </ErrorBoundary>
              <ErrorBoundary fallback={<ErrorState message="Chart failed" />}>
                <ActivityBarChart data={report.scores.activityPattern} />
              </ErrorBoundary>
              <ErrorBoundary fallback={<ErrorState message="Chart failed" />}>
                <WeeklyTrendChart data={report.scores.weeklyTrend} />
              </ErrorBoundary>
            </div>

            {/* Comparison + AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ComparisonCard comparison={report.comparison} />
              <Card shine>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-brand" />
                  <h3 className="text-sm font-semibold text-text-primary">Digital Persona</h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed italic border-l-2 border-brand/30 pl-3">
                  "{report.ai_insights.digital_persona}"
                </p>
                <div className="mt-4 pt-4 border-t border-border">
                  <Link href={ROUTES.CHAT}>
                    <Button variant="secondary" size="sm" fullWidth>
                      <Sparkles className="h-3.5 w-3.5" />
                      Ask AI about your profile
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>

            {/* Full AI Insights */}
            <section aria-labelledby="insights-heading">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-brand" />
                <h2 id="insights-heading" className="text-base font-semibold text-text-primary">AI Insights</h2>
                <span className="ml-auto text-xs text-text-muted">Powered by OpenAI</span>
              </div>
              <ErrorBoundary>
                <InsightBox insights={report.ai_insights} />
              </ErrorBoundary>
            </section>
          </>
        </ErrorBoundary>
      )}
    </div>
  );
}
