'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Comparison } from '@/utils/types';
import { Card } from '@/components/ui/Card';
import { SCORE_LABELS } from '@/constants';
import { cn } from '@/utils/helpers';

interface ComparisonCardProps { comparison: Comparison; }

export const ComparisonCard = ({ comparison }: ComparisonCardProps) => (
  <Card shine>
    <div className="flex items-center gap-2 mb-5">
      <TrendingUp className="h-4 w-4 text-brand" />
      <h3 className="text-sm font-semibold text-text-primary">How You Compare</h3>
      <span className="ml-auto text-xs text-text-muted">vs. average developer</span>
    </div>

    <div className="space-y-4">
      {Object.entries(comparison).map(([key, dim], i) => {
        const label = SCORE_LABELS[key] || key;
        const pct   = dim.percentile;
        const isAbove = pct >= 60;
        const isBelow = pct < 40;

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-text-secondary">{label}</span>
              <div className="flex items-center gap-1.5">
                {isAbove ? (
                  <TrendingUp className="h-3 w-3 text-accent-green" />
                ) : isBelow ? (
                  <TrendingDown className="h-3 w-3 text-accent-orange" />
                ) : (
                  <Minus className="h-3 w-3 text-text-muted" />
                )}
                <span className={cn('text-xs font-semibold', isAbove ? 'text-accent-green' : isBelow ? 'text-accent-orange' : 'text-text-secondary')}>
                  Top {100 - pct}%
                </span>
              </div>
            </div>
            <div className="relative h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
                className={cn('h-full rounded-full', isAbove ? 'bg-accent-green' : isBelow ? 'bg-accent-orange' : 'bg-brand')}
              />
              {/* Average marker */}
              <div className="absolute top-0 h-full w-0.5 bg-border-bright" style={{ left: '50%' }} />
            </div>
            <p className="text-[10px] text-text-muted mt-1">
              You score {dim.score} vs avg {dim.avg} — {dim.label}
            </p>
          </motion.div>
        );
      })}
    </div>
  </Card>
);
