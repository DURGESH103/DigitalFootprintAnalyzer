import { cn } from '@/utils/helpers';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'green' | 'purple' | 'orange' | 'yellow';
  className?: string;
}

const variants = {
  default: 'bg-brand/10 text-brand border-brand/20',
  green: 'bg-accent-green/10 text-accent-green border-accent-green/20',
  purple: 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
  orange: 'bg-accent-orange/10 text-accent-orange border-accent-orange/20',
  yellow: 'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20',
};

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => (
  <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', variants[variant], className)}>
    {children}
  </span>
);
