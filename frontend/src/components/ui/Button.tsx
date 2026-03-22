'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

const variants = {
  primary:   'bg-gradient-to-r from-brand to-accent-purple text-white shadow-glow-brand hover:shadow-[0_0_28px_rgba(88,166,255,0.45)] border border-brand/20',
  secondary: 'bg-bg-tertiary hover:bg-border border border-border text-text-primary hover:border-border-bright',
  ghost:     'hover:bg-bg-tertiary text-text-secondary hover:text-text-primary border border-transparent hover:border-border',
  danger:    'bg-accent-orange/10 hover:bg-accent-orange/20 text-accent-orange border border-accent-orange/30',
  success:   'bg-accent-green/10 hover:bg-accent-green/20 text-accent-green border border-accent-green/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-sm gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, fullWidth, className, children, disabled, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileTap={{ scale: disabled || loading ? 1 : 0.96 }}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
        </span>
      )}
      <span className={cn('flex items-center', sizes[size].split(' ').find(c => c.startsWith('gap')), loading && 'invisible')}>
        {loading && <span className="sr-only">Loading…</span>}
        {children}
      </span>
    </motion.button>
  )
);

Button.displayName = 'Button';
