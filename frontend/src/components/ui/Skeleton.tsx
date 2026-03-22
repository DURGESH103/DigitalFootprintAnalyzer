import { cn } from '@/utils/helpers';

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('skeleton-pulse rounded-lg', className)} />
);

export const SkeletonCard = () => (
  <div className="glass-card p-5 space-y-3">
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-8 w-1/2" />
    <Skeleton className="h-3 w-2/3" />
  </div>
);

export const SkeletonDashboard = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="glass-card p-5"><Skeleton className="h-64 w-full" /></div>
      <div className="glass-card p-5"><Skeleton className="h-64 w-full" /></div>
    </div>
  </div>
);
