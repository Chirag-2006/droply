"use client";

import Link from "next/link";
import { Show, useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  CloudUpload,
  Shield,
  Folder,
  Image as ImageIcon,
  ArrowRight,
  Zap,
  Lock,
  Globe,
  Database,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import { HomeSkeleton } from "@/components/skeletons/HomeSkeleton";

export default function Home() {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return <HomeSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/10">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[25%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-4 overflow-hidden">
          <div className="container mx-auto text-center relative z-10 -mt-10">
            <div className="mb-6 flex justify-center">
              <Badge 
                variant="outline" 
                className="relative px-4 py-4 rounded-full bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors cursor-default overflow-hidden group"
              >
                <span className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/20 to-primary/0 -translate-x-full group-hover:translate-x-full duration-1000 transition-transform animate-[shimmer_3s_infinite]" />
                <div className="relative flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" />
                  <span className="font-bold">The future of cloud storage is here</span>
                </div>
                <div className="absolute inset-0 rounded-full border border-primary/50 animate-pulse" />
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1]">
              Organize your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-purple-500 to-blue-600">
                Digital Universe
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Droply is the modern workspace for your images. Fast, secure, and 
              beautifully designed to keep your creative flow uninterrupted.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Show when={"signed-out"}>
                <Link href="/sign-up">
                  <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base backdrop-blur-sm">
                    Live Demo
                  </Button>
                </Link>
              </Show>
              <Show when={"signed-in"}>
                <Link href="/dashboard">
                  <Button size="lg" className="rounded-full px-8 h-12 text-base">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Show>
            </div>

            {/* Hero Image Mockup (Abstract) */}
            <div className="mt-16 md:mt-24 relative max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />
              <div className="relative rounded-2xl border bg-card/50 backdrop-blur-sm p-2 shadow-2xl overflow-hidden group">
                <div className="aspect-[16/9] rounded-xl bg-muted/50 flex items-center justify-center overflow-hidden">
                   <div className="grid grid-cols-3 gap-4 w-full h-full p-8">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className={`rounded-lg bg-primary/10 animate-pulse delay-${i*100} h-full`} />
                      ))}
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-6 rounded-2xl bg-background shadow-xl border flex items-center gap-4 animate-bounce">
                        <CloudUpload className="w-8 h-8 text-primary" />
                        <span className="font-semibold text-xl">Uploading... 84%</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="py-24 px-4 bg-muted/20">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Designed for creators</h2>
              <p className="text-lg text-muted-foreground">Everything you need to manage your media at scale.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">
              {/* Feature 1 */}
              <div className="md:col-span-3 lg:col-span-4 rounded-3xl border bg-card p-8 flex flex-col justify-between hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <Lock className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Military-grade Security</h3>
                  <p className="text-muted-foreground">Your data is encrypted and stored with multiple layers of protection.</p>
                </div>
              </div>

              {/* Feature 2 (Large) */}
              <div className="md:col-span-3 lg:col-span-8 rounded-3xl border bg-gradient-to-br from-primary/5 to-purple-500/5 p-8 flex flex-col md:flex-row gap-8 items-center hover:shadow-xl transition-all duration-300">
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Lightning Fast Performance</h3>
                  <p className="text-muted-foreground">Upload and access your files instantly from anywhere in the world with our global CDN.</p>
                </div>
                <div className="flex-1 w-full bg-background/50 rounded-2xl p-4 border shadow-inner">
                    <div className="space-y-3">
                      <div className="h-2 w-[70%] bg-primary/20 rounded-full" />
                      <div className="h-2 w-[90%] bg-muted rounded-full" />
                      <div className="h-2 w-[50%] bg-muted rounded-full" />
                    </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="md:col-span-3 lg:col-span-8 rounded-3xl border bg-card p-8 hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1 order-2 md:order-1">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6">
                      <Database className="w-6 h-6 text-orange-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Smart Organization</h3>
                    <p className="text-muted-foreground">Automated tagging and folder management that works the way you do.</p>
                  </div>
                  <div className="flex-1 order-1 md:order-2 grid grid-cols-2 gap-2">
                      <div className="aspect-square bg-muted rounded-lg group-hover:scale-110 transition-transform duration-500" />
                      <div className="aspect-square bg-primary/10 rounded-lg group-hover:-translate-y-2 transition-transform duration-500" />
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="md:col-span-3 lg:col-span-4 rounded-3xl border bg-card p-8 flex flex-col justify-between hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Global Access</h3>
                  <p className="text-muted-foreground">Access your files from any device, anywhere, anytime.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 overflow-hidden relative">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto rounded-[3rem] bg-foreground text-background p-12 md:p-20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full -ml-32 -mb-32" />
              
              <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Start storing smarter today.</h2>
              <p className="text-lg text-background/70 mb-10 max-w-xl mx-auto relative z-10">
                Join thousands of creators who trust Droply for their digital assets. 
                Simple pricing, unlimited possibilities.
              </p>

              <div className="flex justify-center relative z-10">
                <Show when={"signed-out"}>
                  <Link href="/sign-up">
                    <Button size="lg" variant="secondary" className="rounded-full px-10 h-14 text-lg font-semibold hover:scale-105 transition-transform">
                      Create Your Account
                    </Button>
                  </Link>
                </Show>
                <Show when={"signed-in"}>
                  <Link href="/dashboard">
                    <Button size="lg" variant="secondary" className="rounded-full px-10 h-14 text-lg font-semibold hover:scale-105 transition-transform">
                      Open Dashboard
                    </Button>
                  </Link>
                </Show>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
