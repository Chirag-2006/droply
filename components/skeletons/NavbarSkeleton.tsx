import { Skeleton } from "@/components/ui/skeleton";

export function NavbarSkeleton() {
  return (
    <header className="border sticky top-4 z-50 bg-background/60 backdrop-blur-md mx-4 mt-4 rounded-2xl shadow-sm">
      <div className="container mx-auto py-3 px-4 flex justify-between items-center">
        {/* Logo Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-20 h-6" />
        </div>

        {/* Desktop Actions Skeleton */}
        <div className="hidden md:flex items-center gap-4">
          <Skeleton className="w-9 h-9 rounded-full" /> {/* Theme Toggle */}
          <div className="flex gap-2">
            <Skeleton className="w-24 h-9 rounded-full" />
            <Skeleton className="w-28 h-9 rounded-full" />
          </div>
        </div>

        {/* Mobile Actions Skeleton */}
        <div className="md:hidden flex items-center gap-2">
          <Skeleton className="w-9 h-9 rounded-full" /> {/* Theme Toggle */}
          <Skeleton className="w-9 h-9 rounded-lg" /> {/* Menu Button */}
        </div>
      </div>
    </header>
  );
}
