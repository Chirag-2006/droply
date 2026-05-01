import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Ghost } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-background to-muted/20">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full" />
            <div className="relative flex justify-center">
              <div className="w-32 h-32 rounded-3xl bg-card border border-border/50 shadow-2xl flex items-center justify-center animate-bounce duration-[3000ms]">
                <Ghost className="w-16 h-16 text-primary" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-primary via-purple-500 to-pink-500">
              404
            </h1>
            <h2 className="text-3xl font-bold tracking-tight">Page Not Found</h2>
            <p className="text-muted-foreground text-lg">
              The page you are looking for doesn&apos;t exist or has been moved to another location.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full rounded-2xl gap-2 shadow-lg shadow-primary/20 h-14 px-8">
                <Home className="w-5 h-5" />
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full rounded-2xl gap-2 h-14 px-8 bg-background/50 backdrop-blur-md">
                <ArrowLeft className="w-5 h-5" />
                Go Home
              </Button>
            </Link>
          </div>

          <div className="pt-8 opacity-50">
            <p className="text-sm font-medium uppercase tracking-[0.2em]">Lost in the clouds?</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
