export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
  />
)

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: i === lines - 1 ? '60%' : '100%' }} />
    ))}
  </div>
)