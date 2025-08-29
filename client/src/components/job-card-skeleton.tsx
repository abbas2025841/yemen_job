import { Skeleton } from '@/components/ui/loading-skeleton';

export function JobCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div className="flex gap-4">
        {/* Company Logo */}
        <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
        
        {/* Job Details */}
        <div className="flex-1 space-y-3">
          {/* Job Title */}
          <Skeleton className="h-5 w-2/3" />
          
          {/* Company Name */}
          <Skeleton className="h-4 w-1/2" />
          
          {/* Job Info */}
          <div className="flex gap-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
          
          {/* Skills */}
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-2 w-32">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

export function JobCardSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }, (_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}