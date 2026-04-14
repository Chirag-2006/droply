import { Skeleton } from "@/components/ui/skeleton";
import { NavbarSkeleton } from "./NavbarSkeleton";

export function HomeSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavbarSkeleton />
      <main className="flex-1">
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-4 overflow-hidden">
          <div className="container mx-auto text-center relative z-10 -mt-10">
            <div className="mb-6 flex justify-center">
              <Skeleton className="w-64 h-8 rounded-full" />
            </div>
            <Skeleton className="w-3/4 h-16 md:h-24 mx-auto mb-6 rounded-2xl" />
            <Skeleton className="w-1/2 h-6 mx-auto mb-10 rounded-lg" />
            <div className="flex gap-4 justify-center">
              <Skeleton className="w-40 h-12 rounded-full" />
              <Skeleton className="w-40 h-12 rounded-full" />
            </div>
            <div className="mt-16 md:mt-24 max-w-5xl mx-auto">
              <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
