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
} from "lucide-react";

export default function Home() {
  const {  isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                    Store your <span className="text-primary">images</span> with
                    ease
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground">
                    Simple. Secure. Fast.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
                  <Show when={"signed-out"}>
                    <Link href="/sign-up">
                      <Button size="lg">Get Started</Button>
                    </Link>
                    <Link href="/sign-in">
                      <Button size="lg" variant="outline">
                        Sign In
                      </Button>
                    </Link>
                  </Show>
                  <Show when={"signed-in"}>
                    <Link href="/dashboard">
                      <Button size="lg">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </Show>
                </div>
              </div>

              {/* Hero Icon */}
              <div className="flex justify-center order-first lg:order-last">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-24 md:h-32 w-24 md:w-32 text-primary/70" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 md:py-16 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                What You Get
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <CloudUpload className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Quick Uploads</h3>
                  <p className="text-muted-foreground">Drag, drop, done.</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Folder className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">
                    Smart Organization
                  </h3>
                  <p className="text-muted-foreground">
                    Keep it tidy, find it fast.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Locked Down</h3>
                  <p className="text-muted-foreground">
                    Your images, your eyes only.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-20 px-4 md:px-6">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready?</h2>

            <Show when={"signed-out"}>
              <div className="flex justify-center gap-4 mt-8">
                <Link href="/sign-up">
                  <Button size="lg">
                    Let&apos;s Go
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Show>

            <Show when={"signed-in"}>
              <Link href="/dashboard">
                <Button size="lg">
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Show>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CloudUpload className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">Droply</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Droply
          </p>
        </div>
      </footer>
    </div>
  );
}
