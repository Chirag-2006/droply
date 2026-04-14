import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Welcome Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-6 w-80 rounded-lg" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-none bg-card/40 backdrop-blur-md shadow-sm">
            <CardContent className="p-6 space-y-2">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-8 w-32 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Section Skeleton */}
        <div className="lg:col-span-4 space-y-1">
          <Card className="border-none bg-card/40 backdrop-blur-md shadow-lg rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-3 border-b border-border/50 pb-4">
              <Skeleton className="w-10 h-10 rounded-2xl" />
              <Skeleton className="h-6 w-32 rounded" />
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-40 w-full rounded-2xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </CardContent>
          </Card>
        </div>

        {/* File Explorer Section Skeleton */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center gap-4 bg-card/40 backdrop-blur-md p-2 rounded-2xl border border-border/50">
            <Skeleton className="h-10 flex-1 max-w-sm rounded-xl" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32 rounded-xl" />
              <Skeleton className="h-10 w-20 rounded-xl" />
            </div>
          </div>

          <Card className="border-none bg-card/40 backdrop-blur-md shadow-lg rounded-3xl min-h-100 overflow-hidden">
            <CardHeader className="flex items-center border-b border-border/50 justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-2xl" />
                <Skeleton className="h-6 w-40 rounded" />
              </div>
              <Skeleton className="h-9 w-28 rounded-lg" />
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-4 flex-1 rounded" />
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
