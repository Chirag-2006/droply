import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[25%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      <Navbar />

      <main className="flex-1 container mx-auto py-8 px-4 relative z-10">
        <DashboardSkeleton />
      </main>

      <Footer />
    </div>
  );
}
