'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Sparkles } from 'lucide-react';
import { useReportStore } from '@/store/report.store';
import { useSocket } from '@/hooks/useSocket';
import { ANALYSIS_STEPS, ROUTES } from '@/constants';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/helpers';

export default function AnalysisPage() {
  const { progress, isAnalyzing, reset } = useReportStore();
  const router = useRouter();

  useSocket(isAnalyzing);

  useEffect(() => {
    if (!isAnalyzing && !progress) router.replace(ROUTES.DASHBOARD);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (progress?.percent === 100) {
      const t = setTimeout(() => { reset(); router.push(ROUTES.DASHBOARD); }, 2200);
      return () => clearTimeout(t);
    }
  }, [progress?.percent, reset, router]);

  const currentPercent = progress?.percent ?? 0;
  const hasError = !!progress?.error;
  const isDone = currentPercent === 100 && !hasError;

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[70vh] px-4"
      role="main"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(88,166,255,0.06), transparent)' }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="glass-card p-8 sm:p-10 w-full max-w-md relative overflow-hidden"
      >
        {/* Card inner glow */}
        <div className="absolute inset-0 pointer-events-none rounded-xl"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(88,166,255,0.05), transparent)' }}
          aria-hidden="true"
        />

        {/* Status icon */}
        <div className="flex justify-center mb-6" aria-hidden="true">
          <AnimatePresence mode="wait">
            {hasError ? (
              <motion.div key="error" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <div className="h-16 w-16 rounded-2xl bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-accent-orange" />
                </div>
              </motion.div>
            ) : isDone ? (
              <motion.div
                key="done"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              >
                <div className="h-16 w-16 rounded-2xl bg-accent-green/10 border border-accent-green/20 flex items-center justify-center glow-green">
                  <CheckCircle className="h-8 w-8 text-accent-green" />
                </div>
              </motion.div>
            ) : (
              <motion.div key="loading" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <div className="h-16 w-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center animate-pulse-ring">
                  <Loader2 className="h-8 w-8 text-brand animate-spin" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-text-primary">
            {hasError ? 'Analysis Failed' : isDone ? 'Analysis Complete!' : 'Analyzing Profile…'}
          </h2>
          <p className="text-sm text-text-muted mt-1.5">
            {hasError ? progress?.error : progress?.step || 'Initializing…'}
          </p>
        </div>

        {/* Progress bar */}
        {!hasError && (
          <div className="mb-7" role="progressbar" aria-valuenow={currentPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Analysis progress">
            <div className="flex justify-between text-xs text-text-muted mb-2">
              <span>Progress</span>
              <span className="font-mono font-medium text-text-secondary">{currentPercent}%</span>
            </div>
            <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
              <motion.div
                className="h-full progress-bar rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${currentPercent}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* Stepper */}
        <ol className="space-y-3 mb-7" aria-label="Analysis steps">
          {ANALYSIS_STEPS.map((step, idx) => {
            const done    = currentPercent >= step.percent;
            const active  = !done && currentPercent >= (ANALYSIS_STEPS[idx - 1]?.percent ?? 0);
            return (
              <li
                key={step.key}
                className={cn(
                  'flex items-center gap-3 text-sm transition-all duration-300',
                  done ? 'text-text-primary' : active ? 'text-text-secondary' : 'text-text-muted'
                )}
                aria-label={`${step.label}: ${done ? 'complete' : active ? 'in progress' : 'pending'}`}
              >
                {/* Step indicator */}
                <span className={cn(
                  'h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 text-xs font-bold',
                  done
                    ? 'border-accent-green bg-accent-green/15 text-accent-green'
                    : active
                    ? 'border-brand bg-brand/10 text-brand animate-pulse'
                    : 'border-border text-text-muted'
                )} aria-hidden="true">
                  {done ? <CheckCircle className="h-3.5 w-3.5" /> : idx + 1}
                </span>

                <span className="flex-1">{step.label}</span>

                {done && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-[10px] font-medium text-accent-green bg-accent-green/10 px-2 py-0.5 rounded-full"
                  >
                    Done
                  </motion.span>
                )}
                {active && !done && (
                  <span className="text-[10px] font-medium text-brand bg-brand/10 px-2 py-0.5 rounded-full animate-pulse">
                    Running
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        {/* CTA */}
        {(hasError || isDone) && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Button
              onClick={() => { reset(); router.push(ROUTES.DASHBOARD); }}
              fullWidth
              variant={hasError ? 'danger' : 'primary'}
            >
              {isDone && <Sparkles className="h-3.5 w-3.5" />}
              {hasError ? 'Back to Dashboard' : 'View Report'}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
