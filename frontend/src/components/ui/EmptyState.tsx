import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  animated?: boolean;
}

export const EmptyState = ({ icon = '🔍', title, description, action, className, animated = true }: EmptyStateProps) => (
  <div
    role="status"
    aria-label={title}
    className={cn(
      'glass-card flex flex-col items-center justify-center py-16 px-6 text-center relative overflow-hidden',
      className
    )}
  >
    {/* Background glow */}
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
      style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(88,166,255,0.05), transparent)' }}
    />

    {/* Animated icon */}
    <motion.div
      animate={animated ? { y: [0, -6, 0] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="text-5xl mb-5 relative z-10"
      aria-hidden="true"
    >
      {icon}
    </motion.div>

    <h3 className="text-base font-semibold text-text-primary mb-2 relative z-10">{title}</h3>
    {description && (
      <p className="text-sm text-text-secondary max-w-xs leading-relaxed relative z-10">{description}</p>
    )}
    {action && <div className="mt-6 relative z-10">{action}</div>}
  </div>
);
