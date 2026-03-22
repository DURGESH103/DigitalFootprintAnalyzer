'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, User, Calendar, Star, GitFork, BookOpen, Sparkles, ExternalLink } from 'lucide-react';
import { publicService } from '@/services/platform.service';
import { PublicProfile } from '@/utils/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate, formatNumber } from '@/utils/helpers';
import { PERSONALITY_ICONS } from '@/constants';

export const PublicProfileView = ({ slug }: { slug: string }) => {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    publicService.getProfile(slug)
      .then(r => setProfile(r.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="max-w-3xl mx-auto space-y-4 p-6">
      {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
    </div>
  );

  if (notFound || !profile) return (
    <div className="max-w-3xl mx-auto p-6">
      <EmptyState icon="🔍" title="Profile not found" description="This public profile doesn't exist or has been made private." />
    </div>
  );

  const report = profile.latestReport;
  const icon = report ? (PERSONALITY_ICONS[report.aiInsights.personality_type] || '💡') : '👤';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <Card shine glow>
          <div className="flex items-start gap-4">
            <div className="avatar-ring flex-shrink-0">
              <div className="h-16 w-16 rounded-full bg-bg-tertiary flex items-center justify-center">
                <User className="h-8 w-8 text-brand" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-text-primary">{profile.name}</h1>
              <p className="text-sm text-text-muted">@{profile.slug}</p>
              {report && (
                <p className="text-sm text-text-secondary mt-1 italic">"{report.aiInsights.digital_persona}"</p>
              )}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Calendar className="h-3 w-3" />
                  Member since {formatDate(profile.memberSince)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <BookOpen className="h-3 w-3" />
                  {profile.totalReports} {profile.totalReports === 1 ? 'report' : 'reports'}
                </div>
                {report && (
                  <a href={`https://github.com/${report.githubUsername}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-brand hover:underline">
                    <Github className="h-3 w-3" />
                    @{report.githubUsername}
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
            </div>
            {report && (
              <div className="text-4xl flex-shrink-0" aria-hidden="true">{icon}</div>
            )}
          </div>
        </Card>
      </motion.div>

      {report ? (
        <>
          {/* Scores */}
          <Card shine>
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-5">Scores</h3>
            <div className="flex flex-wrap justify-around gap-4">
              <ScoreRing score={report.scores.hireability}  label="Hireability"  size={88} />
              <ScoreRing score={report.scores.consistency}  label="Consistency"  size={88} />
              <ScoreRing score={report.scores.visibility}   label="Visibility"   size={88} />
              <ScoreRing score={report.scores.growth}       label="Growth"       size={88} />
              <ScoreRing score={report.scores.influence}    label="Influence"    size={88} />
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Repos',   value: report.scores.totalRepos,                    icon: <BookOpen className="h-4 w-4" /> },
              { label: 'Stars',   value: formatNumber(report.scores.totalStars),       icon: <Star     className="h-4 w-4" /> },
              { label: 'Forks',   value: formatNumber(report.scores.totalForks),       icon: <GitFork  className="h-4 w-4" /> },
            ].map(({ label, value, icon }) => (
              <Card key={label} animate={false} className="text-center py-4">
                <div className="flex justify-center text-text-muted mb-2">{icon}</div>
                <p className="text-xl font-bold text-text-primary">{value}</p>
                <p className="text-xs text-text-muted">{label}</p>
              </Card>
            ))}
          </div>

          {/* Personality + insights */}
          <Card shine>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-brand" />
              <h3 className="text-sm font-semibold text-text-primary">AI Insights</h3>
              <Badge variant="purple" className="ml-auto">{report.aiInsights.personality_type}</Badge>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">{report.aiInsights.summary}</p>
            {report.aiInsights.behavior_tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {report.aiInsights.behavior_tags.map(tag => (
                  <Badge key={tag} variant="default">{tag}</Badge>
                ))}
              </div>
            )}
          </Card>

          <p className="text-center text-xs text-text-muted">
            Last analyzed {formatDate(report.createdAt)} · Powered by Digital Footprint Analyzer
          </p>
        </>
      ) : (
        <EmptyState icon="📊" title="No public report yet" description="This user hasn't shared any analysis yet." />
      )}
    </div>
  );
};
