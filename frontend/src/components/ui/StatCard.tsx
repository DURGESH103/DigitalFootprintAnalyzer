'use client';

import { motion } from 'framer-motion';
import { cn, getScoreColor } from '@/utils/helpers';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: number;
  scoreColor?: boolean;
  delay?: number;
  accent?: 'brand' | 'green' | 'purple' | 'orange' | 'yellow';
}

const accentMap = {
  brand:  { bg: 'bg-brand/10',          border: 'border-brand/20',          icon: 'text-brand',         glow: 'hover:shadow-glow-brand' },
  green:  { bg: 'bg-accent-green/10',   border: 'border-accent-green/20',   icon: 'text-accent-green',  glow: 'hover:shadow-glow-green' },
  purple: { bg: 'bg-accent-purple/10',  border: 'border-accent-purple/20',  icon: 'text-accent-purple', glow: 'hover:shadow-glow-purple' },
  orange: { bg: 'bg-accent-orange/10',  border: 'border-accent-orange/20',  icon: 'text-accent-orange', glow: '' },
  yellow: { bg: 'bg-accent-yellow/10',  border: 'border-accent-yellow/20',  icon: 'text-accent-yellow', glow: '' },
};

export const StatCard = ({ title, value, subtitle, icon, trend, scoreColor, delay = 0, accent = 'brand' }: StatCardProps) => {
  const a = accentMap[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={cn('glass-card p-5 transition-all duration-300 group hover:-translate-y-0.5', a.glow)}
      style={{ boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 20px rgba(0,0,0,0.3)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-widest">{title}</span>
        <span className={cn('h-8 w-8 rounded-lg border flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110', a.bg, a.border, a.icon)}>
          {icon}
        </span>
      </div>
      <div className={cn('text-2xl font-bold tracking-tight mb-1', scoreColor && typeof value === 'number' ? getScoreColor(value as number) : 'text-text-primary')}>
        {value}
      </div>
      {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
      {trend !== undefined && (
        <div className={cn('mt-2 text-xs font-medium flex items-center gap-1', trend >= 0 ? 'text-accent-green' : 'text-accent-orange')}>
          <span>{trend >= 0 ? '↑' : '↓'}</span>
          <span>{Math.abs(trend)}% vs last</span>
        </div>
      )}
    </motion.div>
  );
};
