import { Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

// Full page loading spinner
export function LoadingSpinner({ message = 'Memuat data...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

// Inline loading spinner (smaller)
export function LoadingSpinnerInline({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <Loader2 className="w-5 h-5 animate-spin text-green-600" />
      {message && <span className="text-sm text-muted-foreground">{message}</span>}
    </div>
  );
}

// Card skeleton for list items
export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}

// Table skeleton
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={`row-${i}`} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={`cell-${i}-${j}`} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Stats card skeleton
export function StatsCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </Card>
      ))}
    </div>
  );
}

// Dashboard skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Stats Cards */}
      <StatsCardSkeleton />

      {/* Content Cards */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <CardSkeleton count={4} />
      </div>
    </div>
  );
}

// Muzakki list skeleton
export function MuzakkiListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}

// Program card skeleton
export function ProgramCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Chat message skeleton
export function ChatSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`flex gap-3 ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
          {i % 2 === 0 && <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />}
          <div className={`space-y-1 ${i % 2 === 0 ? 'items-start' : 'items-end'} flex flex-col`}>
            <Skeleton className="h-4 w-24" />
            <Skeleton className={`h-16 ${i % 2 === 0 ? 'w-64' : 'w-48'} rounded-lg`} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Leaderboard skeleton
export function LeaderboardSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
        </Card>
      ))}
    </div>
  );
}
