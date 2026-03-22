import { cn } from '@/utils/helpers';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'purple' | 'green' | 'orange' | 'yellow' | 'brand';
  className?: string;
}

const variants = {
  default: 'bg-bg-tertiary text-text-secondary border-border',
  purple:  'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
  green:   'bg-accent-green/10  text-accent-green  border-accent-green/20',
  orange:  'bg-accent-orange/10 text-accent-orange border-accent-orange/20',
  yellow:  'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20',
  brand:   'bg-brand/10         text-brand         border-brand/20',
};

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => (
  <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border', variants[variant], className)}>
    {children}
  </span>
);
