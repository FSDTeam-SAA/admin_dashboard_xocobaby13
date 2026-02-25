import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 10, columns = 5 }: TableSkeletonProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-hidden rounded-xl border border-[#d4dce6]">
          <div className="grid border-b border-[#d4dce6] bg-[#f8fafc] p-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {Array.from({ length: columns }).map((_, index) => (
              <Skeleton key={`head-${index}`} className="h-4 w-28" />
            ))}
          </div>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="grid items-center border-b border-[#edf2f7] p-4 last:border-0"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: columns }).map((__, cellIndex) => (
                <Skeleton key={`cell-${rowIndex}-${cellIndex}`} className="h-4 w-3/4" />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
