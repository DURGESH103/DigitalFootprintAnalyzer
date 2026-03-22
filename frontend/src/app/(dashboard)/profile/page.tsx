'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Github, Calendar, ExternalLink, BarChart2, FileText, TrendingUp, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useReportStore } from '@/store/report.store';
import { useReports } from '@/hooks/useReports';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { formatDate, getHireabilityScore } from '@/utils/helpers';
import { useAuth } from '@/hooks/useAuth';
import { Report } from '@/utils/types';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const { reports, setCurrentReport } = useReportStore();
  const [page, setPage] = useState(1);
  const { loading, error, totalPages, total, retry } = useReports(page);
  const router = useRouter();

  const viewReport = (report: Report) => {
    setCurrentReport(report);
    router.push('/dashboard');
  };

  // Fix: guard against undefined total
  const reportCount = total ?? 0;
  const avgScore = reports.length > 0
    ? Math.round(reports.reduce((sum, r) => sum + getHireabilityScore(r.scores), 0) / reports.length)
    : null;

  const lastGithub = reports[0]?.github_username;

  return (
    <div className="space-y-6 max-w-3xl pb-8">
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Profile</h1>
        <p className="text-sm text-text-muted mt-1">Manage your account and view analysis history</p>
      </motion.div>

      {/* ── User card ── */}
      <Card shine glow>
        <div className="flex items-start gap-4">
          {/* Avatar with gradient ring */}
          <div className="avatar-ring flex-shrink-0" aria-hidden="true">
            <div className="h-14 w-14 rounded-full bg-bg-tertiary flex items-center justify-center">
              <User className="h-7 w-7 text-brand" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-text-primary">{user?.name}</h2>
            <p className="text-sm text-text-muted">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <Calendar className="h-3 w-3 text-text-muted" aria-hidden="true" />
              <span className="text-xs text-text-muted">
                Member since {user?.created_at ? formatDate(user.created_at) : 'N/A'}
              </span>
            </div>
          </div>

          <Button variant="danger" size="sm" onClick={logout} aria-label="Log out">
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:block">Logout</span>
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border">
          {[
            { label: 'Total Reports',  value: String(reportCount),       icon: <FileText   className="h-3.5 w-3.5" /> },
            { label: 'Avg Score',      value: avgScore ? `${avgScore}` : '—', icon: <TrendingUp className="h-3.5 w-3.5" /> },
            { label: 'Profiles Scanned', value: String(reportCount),     icon: <BarChart2  className="h-3.5 w-3.5" /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="text-center">
              <div className="flex items-center justify-center gap-1 text-text-muted mb-1">{icon}</div>
              <p className="text-xl font-bold text-text-primary">{value}</p>
              <p className="text-[11px] text-text-muted">{label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Connected accounts ── */}
      <Card>
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-4">Connected Accounts</h3>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-tertiary border border-border">
          <div className="h-8 w-8 rounded-lg bg-bg-secondary border border-border flex items-center justify-center flex-shrink-0">
            <Github className="h-4 w-4 text-text-primary" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary">GitHub</p>
            <p className="text-xs text-text-muted">
              {lastGithub ? `@${lastGithub}` : 'No profile analyzed yet'}
            </p>
          </div>
          {lastGithub ? (
            <a
              href={`https://github.com/${lastGithub}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-brand transition-colors p-1.5 rounded-lg hover:bg-brand/10"
              aria-label={`View @${lastGithub} on GitHub`}
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : (
            <Badge variant="default">Not connected</Badge>
          )}
        </div>
      </Card>

      {/* ── Report history ── */}
      <section aria-labelledby="history-heading">
        <div className="flex items-center justify-between mb-4">
          <h3 id="history-heading" className="text-xs font-semibold text-text-muted uppercase tracking-widest">
            Analysis History
          </h3>
          {!loading && reportCount > 0 && (
            <span className="text-xs text-text-muted bg-bg-tertiary border border-border px-2 py-0.5 rounded-full">
              {reportCount} {reportCount === 1 ? 'report' : 'reports'}
            </span>
          )}
        </div>

        {loading && (
          <div className="space-y-3" aria-label="Loading reports">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-[72px] w-full" />)}
          </div>
        )}

        {!loading && error && <ErrorState message={error} onRetry={retry} />}

        {!loading && !error && reports.length === 0 && (
          <EmptyState
            icon="📄"
            title="No reports yet"
            description="Analyze a GitHub profile to see your history here"
          />
        )}

        {!loading && !error && reports.length > 0 && (
          <ul className="space-y-2.5" role="list" aria-label="Analysis reports">
            {reports.map((report, i) => (
              <motion.li
                key={report.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <button
                  onClick={() => viewReport(report)}
                  className="w-full glass-card p-4 flex items-center justify-between hover:border-brand/25 hover:-translate-y-px transition-all duration-200 cursor-pointer group text-left"
                  aria-label={`View report for @${report.github_username} from ${formatDate(report.created_at)}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-bg-tertiary border border-border flex items-center justify-center flex-shrink-0 group-hover:border-brand/20 transition-colors">
                      <Github className="h-3.5 w-3.5 text-text-secondary" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">@{report.github_username}</p>
                      <p className="text-xs text-text-muted">{formatDate(report.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Badge variant="purple">{report.ai_insights.personality_type}</Badge>
                    <span className="text-xs font-semibold text-text-secondary hidden sm:block">
                      {getHireabilityScore(report.scores)}
                      <span className="text-text-muted font-normal">/100</span>
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-text-muted group-hover:text-brand transition-colors" aria-hidden="true" />
                  </div>
                </button>
              </motion.li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav aria-label="Report history pagination" className="flex items-center justify-center gap-3 mt-5">
            <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)} aria-label="Previous page">
              ← Prev
            </Button>
            <span className="text-sm text-text-muted" aria-current="page">{page} / {totalPages}</span>
            <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} aria-label="Next page">
              Next →
            </Button>
          </nav>
        )}
      </section>
    </div>
  );
}
