'use client';

import { Star, GitFork, BookOpen, Code2, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useReportStore } from '@/store/report.store';
import { useReports } from '@/hooks/useReports';
import { AnalyzeForm } from '@/features/dashboard/AnalyzeForm';
import { InsightBox } from '@/features/dashboard/InsightBox';
import { StatCard } from '@/components/ui/StatCard';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { LanguagePieChart } from '@/components/charts/LanguagePieChart';
import { ActivityBarChart } from '@/components/charts/ActivityBarChart';
import { SkeletonDashboard } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Button } from '@/components/ui/Button';
import { formatNumber, getHireabilityScore, formatDate } from '@/utils/helpers';
import Link from 'next/link';
import { ROUTES } from '@/constants';
import { motion } from 'framer-motion';

const QuickStatCard = ({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) => (
  <div className={`glass-card p-4 flex items-center gap-3 border-l-2 ${color}`}>
    <span className="text-text-muted">{icon}</span>
    <div>
      <p className="text-lg font-bold text-text-primary leading-none">{value}</p>
      <p className="text-xs text-text-muted mt-0.5">{label}</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { currentReport, reports } = useReportStore();
  const { loading, error, retry } = useReports();

  const report = currentReport;
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const totalAnalyses = reports.length;

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Welcome back, <span className="gradient-text">{firstName}</span> 👋
            </h1>
            <p className="text-sm text-text-muted mt-1">
              {report
                ? `Viewing report for @${report.github_username} · ${formatDate(report.created_at)}`
                : 'Start by analyzing a GitHub profile below'}
            </p>
          </div>
          {totalAnalyses > 0 && (
            <Link href={ROUTES.PROFILE}>
              <Button variant="secondary" size="sm">
                <Clock className="h-3.5 w-3.5" />
                {totalAnalyses} {totalAnalyses === 1 ? 'Report' : 'Reports'}
              </Button>
            </Link>
          )}
        </div>
      </motion.div>

      {/* ── Quick stats (always visible) ── */}
      {!report && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          <QuickStatCard label="Analyses run"    value={String(totalAnalyses)} icon={<TrendingUp className="h-4 w-4" />} color="border-brand" />
          <QuickStatCard label="AI insights"     value={totalAnalyses > 0 ? 'Ready' : '—'} icon={<Sparkles className="h-4 w-4" />} color="border-accent-purple" />
          <QuickStatCard label="GitHub profiles" value={String(totalAnalyses)} icon={<BookOpen className="h-4 w-4" />} color="border-accent-green" />
          <QuickStatCard label="Last activity"   value={reports[0] ? formatDate(reports[0].created_at) : '—'} icon={<Clock className="h-4 w-4" />} color="border-accent-yellow" />
        </motion.div>
      )}

      {/* ── Analyze form ── */}
      <AnalyzeForm />

      {/* ── Loading ── */}
      {loading && <SkeletonDashboard />}

      {/* ── Error ── */}
      {!loading && error && <ErrorState message={error} onRetry={retry} />}

      {/* ── Empty state ── */}
      {!loading && !error && !report && (
        <EmptyState
          icon="🔭"
          title="No analysis yet"
          description="Your AI-powered insights will appear here after you analyze a GitHub profile. It only takes seconds."
          action={
            <Link href={ROUTES.ANALYSIS}>
              <Button size="sm">
                <Sparkles className="h-3.5 w-3.5" />
                Start Analysis
              </Button>
            </Link>
          }
        />
      )}

      {/* ── Report content ── */}
      {!loading && !error && report && (
        <ErrorBoundary>
          <>
            {/* Score rings */}
            <Card shine className="flex flex-wrap items-center justify-around gap-6 py-8" aria-label="Score overview">
              <div className="absolute inset-0 pointer-events-none rounded-xl"
                style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(88,166,255,0.05), transparent)' }}
                aria-hidden="true"
              />
              <ScoreRing score={getHireabilityScore(report.scores)} label="Hireability" size={96} />
              <ScoreRing score={report.scores.consistency}          label="Consistency" size={96} />
              <ScoreRing score={report.scores.engagement}           label="Engagement"  size={96} />
              <ScoreRing score={report.scores.activityPattern.day}  label="Day Activity" size={96} />
            </Card>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Repos"   value={report.scores.totalRepos}                          icon={<BookOpen className="h-4 w-4" />} accent="brand"  delay={0}    />
              <StatCard title="Total Stars"   value={formatNumber(report.scores.totalStars)}             icon={<Star     className="h-4 w-4" />} accent="yellow" delay={0.05} />
              <StatCard title="Total Forks"   value={formatNumber(report.scores.totalForks)}             icon={<GitFork  className="h-4 w-4" />} accent="purple" delay={0.1}  />
              <StatCard title="Top Language"  value={report.scores.topLanguages[0]?.lang || 'N/A'}      icon={<Code2    className="h-4 w-4" />} accent="green"  delay={0.15} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ErrorBoundary fallback={<ErrorState message="Chart failed to render" />}>
                <LanguagePieChart data={report.scores.topLanguages} />
              </ErrorBoundary>
              <ErrorBoundary fallback={<ErrorState message="Chart failed to render" />}>
                <ActivityBarChart data={report.scores.activityPattern} />
              </ErrorBoundary>
            </div>

            {/* AI Insights */}
            <section aria-labelledby="insights-heading">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-brand" aria-hidden="true" />
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
