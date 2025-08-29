import { Skeleton } from '@/components/ui/loading-skeleton';

export function CompanyCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div className="flex items-start gap-4">
        {/* Company Logo */}
        <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
        
        <div className="flex-1 space-y-2">
          {/* Company Name */}
          <Skeleton className="h-5 w-2/3" />
          
          {/* Location */}
          <Skeleton className="h-4 w-1/2" />
          
          {/* Size Badge */}
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </div>
    </div>
  );
}

export function CompanyCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <CompanyCardSkeleton key={i} />
      ))}
    </div>
  );
}