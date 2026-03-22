'use client';

import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { useReportStore } from '@/store/report.store';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { SCORE_LABELS } from '@/constants';
import { cn } from '@/utils/helpers';
import Link from 'next/link';
import { ROUTES } from '@/constants';
import { Button } from '@/components/ui/Button';
import { TrendingUp, TrendingDown, Minus, BarChart2 } from 'lucide-react';

const AVG_BENCHMARKS = { consistency: 35, engagement: 20, visibility: 15, growth: 45, influence: 10, hireability: 50 };

export default function ComparePage() {
  const { currentReport } = useReportStore();

  if (!currentReport) {
    return (
      <EmptyState icon="📊" title="No report to compare"
        description="Run an analysis first to see how you compare against other developers."
        action={<Link href={ROUTES.DASHBOARD}><Button size="sm">Go to Dashboard</Button></Link>}
      />
    );
  }

  const scores = currentReport.scores;
  const comparison = currentReport.comparison;

  const radarData = Object.entries(SCORE_LABELS).map(([key, label]) => ({
    subject: label,
    You:     scores[key as keyof typeof scores] as number ?? 0,
    Average: AVG_BENCHMARKS[key as keyof typeof AVG_BENCHMARKS] ?? 50,
  }));

  return (
    <div className="space-y-6 pb-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Developer Comparison</h1>
        <p className="text-sm text-text-muted mt-1">
          @{currentReport.github_username} vs. average developer benchmarks
        </p>
      </motion.div>

      {/* Radar chart */}
      <Card shine>
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="h-4 w-4 text-brand" />
          <h3 className="text-sm font-semibold text-text-primary">Skill Radar</h3>
          <div className="ml-auto flex items-center gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand inline-block" />You</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent-orange inline-block" />Average</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#30363d" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#8b949e', fontSize: 11 }} />
            <Radar name="You"     dataKey="You"     stroke="#58a6ff" fill="#58a6ff" fillOpacity={0.2} strokeWidth={2} />
            <Radar name="Average" dataKey="Average" stroke="#f78166" fill="#f78166" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 2" />
            <Tooltip contentStyle={{ background: '#1c2128', border: '1px solid #30363d', borderRadius: 8, fontSize: 12 }} />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      {/* Dimension breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(comparison).map(([key, dim], i) => {
          const label = SCORE_LABELS[key] || key;
          const isAbove = dim.percentile >= 60;
          const isBelow = dim.percentile < 40;
          return (
            <motion.div key={key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card hover>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{label}</span>
                  {isAbove
                    ? <TrendingUp   className="h-4 w-4 text-accent-green" />
                    : isBelow
                    ? <TrendingDown className="h-4 w-4 text-accent-orange" />
                    : <Minus        className="h-4 w-4 text-text-muted" />
                  }
                </div>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-3xl font-bold text-text-primary">{dim.score}</span>
                  <span className="text-sm text-text-muted mb-1">/ 100</span>
                </div>
                <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.score}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    className={cn('h-full rounded-full', isAbove ? 'bg-accent-green' : isBelow ? 'bg-accent-orange' : 'bg-brand')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">Avg: {dim.avg}</span>
                  <Badge variant={isAbove ? 'green' : isBelow ? 'orange' : 'default'}>
                    Top {100 - dim.percentile}%
                  </Badge>
                </div>
                <p className="text-xs text-text-muted mt-2 capitalize">{dim.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <Card shine>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Summary</h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {currentReport.ai_insights.digital_persona}
        </p>
        <p className="text-sm text-text-muted mt-2 italic">
          {currentReport.ai_insights.growth_verdict}
        </p>
      </Card>
    </div>
  );
}
