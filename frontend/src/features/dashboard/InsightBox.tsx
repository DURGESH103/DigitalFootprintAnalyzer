'use client';

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, TrendingDown, Lightbulb } from 'lucide-react';
import { AiInsights } from '@/utils/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PERSONALITY_ICONS } from '@/constants';

interface InsightBoxProps {
  insights: AiInsights;
}

export const InsightBox = ({ insights }: InsightBoxProps) => {
  const icon = PERSONALITY_ICONS[insights.personality_type] || '💡';

  return (
    <div className="space-y-4">
      {/* Personality */}
      <Card glow className="text-center py-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-5xl mb-3"
        >
          {icon}
        </motion.div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-brand" />
          <span className="text-xs text-text-secondary uppercase tracking-wider">Personality Type</span>
        </div>
        <h3 className="text-xl font-bold gradient-text">{insights.personality_type}</h3>
        <p className="mt-3 text-sm text-text-secondary leading-relaxed max-w-md mx-auto">{insights.summary}</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Strengths */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-accent-green" />
            <h4 className="text-sm font-semibold text-accent-green">Strengths</h4>
          </div>
          <ul className="space-y-2">
            {insights.strengths.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-2 text-sm text-text-secondary"
              >
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-green flex-shrink-0" />
                {s}
              </motion.li>
            ))}
          </ul>
        </Card>

        {/* Weaknesses */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="h-4 w-4 text-accent-orange" />
            <h4 className="text-sm font-semibold text-accent-orange">Weaknesses</h4>
          </div>
          <ul className="space-y-2">
            {insights.weaknesses.length ? insights.weaknesses.map((w, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-2 text-sm text-text-secondary"
              >
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-orange flex-shrink-0" />
                {w}
              </motion.li>
            )) : (
              <p className="text-sm text-text-muted">No weaknesses found 🎉</p>
            )}
          </ul>
        </Card>

        {/* Suggestions */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-accent-yellow" />
            <h4 className="text-sm font-semibold text-accent-yellow">Suggestions</h4>
          </div>
          <ul className="space-y-2">
            {insights.suggestions.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-2 text-sm text-text-secondary"
              >
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-yellow flex-shrink-0" />
                {s}
              </motion.li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};
