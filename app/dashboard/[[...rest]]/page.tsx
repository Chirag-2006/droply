import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// import DashboardContent from "@/components/dashboard-content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardContent from "@/components/DashboardContent";
export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  const userName = user?.firstName || user?.fullName || "User";

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[25%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main */}
      <main className="flex-1 container mx-auto py-8 px-4 relative z-10">
        <DashboardContent userId={userId} userName={userName} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
