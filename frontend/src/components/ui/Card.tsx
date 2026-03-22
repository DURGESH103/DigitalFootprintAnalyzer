'use client';

import { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  hover?: boolean;
  animate?: boolean;
  shine?: boolean;
}

export const Card = ({ glow, hover = false, animate = true, shine = false, className, children, ...props }: CardProps) => {
  const Wrapper = animate ? motion.div : 'div';
  const motionProps = animate
    ? { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25 } }
    : {};

  return (
    <Wrapper
      className={cn(
        'glass-card p-5 relative overflow-hidden',
        hover && 'glass-card-hover cursor-pointer',
        glow && 'hover:glow-border hover:border-brand/30',
        className
      )}
      {...motionProps}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {shine && (
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)' }}
          aria-hidden="true"
        />
      )}
      {children}
    </Wrapper>
  );
};
