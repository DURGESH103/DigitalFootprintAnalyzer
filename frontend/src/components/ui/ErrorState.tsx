import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils/helpers';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState = ({ message = 'Failed to load data', onRetry, className }: ErrorStateProps) => (
  <div
    role="alert"
    className={cn('glass-card flex flex-col items-center justify-center py-12 px-6 text-center gap-3', className)}
  >
    <AlertCircle className="h-8 w-8 text-accent-orange" aria-hidden="true" />
    <p className="text-sm font-medium text-text-primary">{message}</p>
    {onRetry && (
      <Button variant="secondary" size="sm" onClick={onRetry} className="gap-1.5">
        <RefreshCw className="h-3.5 w-3.5" />
        Retry
      </Button>
    )}
  </div>
);
