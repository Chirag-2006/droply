import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// import DashboardContent from "@/components/dashboard-content";
import Navbar from "@/components/Navbar";
import { CloudUpload } from "lucide-react";
import Footer from "@/components/Footer";
import DashboardContent from "@/components/DashboardContent";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  const userName =
    user?.firstName ||
    user?.fullName ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "User";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main */}
      <main className="flex-1 container mx-auto py-8 px-4">
        <DashboardContent userId={userId} userName={userName} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}