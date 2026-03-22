'use client';

import { motion } from 'framer-motion';
import { cn, getScoreColor } from '@/utils/helpers';

interface ScoreRingProps {
  score: number;
  size?: number;
  label?: string;
  className?: string;
}

export const ScoreRing = ({ score, size = 80, label, className }: ScoreRingProps) => {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 75 ? '#3fb950' : score >= 50 ? '#e3b341' : '#f78166';

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#30363d" strokeWidth={5} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <span className={cn('absolute inset-0 flex items-center justify-center text-lg font-bold', getScoreColor(score))}>
          {score}
        </span>
      </div>
      {label && <span className="text-xs text-text-secondary text-center">{label}</span>}
    </div>
  );
};
