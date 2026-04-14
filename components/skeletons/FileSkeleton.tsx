import { Skeleton } from "@/components/ui/skeleton";

export function FileSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-2xl bg-card/40 backdrop-blur-md">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/2 rounded" />
        <Skeleton className="h-3 w-1/4 rounded" />
      </div>
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  );
}

export function FileGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="aspect-square p-4 border rounded-3xl space-y-3 bg-card/40 backdrop-blur-md">
          <Skeleton className="w-full h-[70%] rounded-2xl" />
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
      ))}
    </div>
  );
}
