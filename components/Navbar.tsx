"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, useUser, UserButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { CloudUpload, Menu, X, LayoutDashboard, FileUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToggleTheme } from "./ToggleTheme";

export default function Navbar() {
  const { isLoaded } = useUser();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isOnDashboard =
    pathname === "/dashboard" || pathname?.startsWith("/dashboard/");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <header
      className={`border sticky top-4 z-50 transition-all bg-background/60 backdrop-blur-md mx-4 mt-4 rounded-2xl ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="container mx-auto py-3 px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:rotate-12 transition-transform">
            <CloudUpload className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Droply</h1>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-4 items-center">
          <ToggleTheme />

          <Show when={"signed-out"}>
            <div className="flex gap-2">
              <Link href="/sign-in">
                <Button variant="ghost" className="rounded-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="rounded-full shadow-lg shadow-primary/20">
                  Get Started
                </Button>
              </Link>
            </div>
          </Show>

          <Show when={"signed-in"}>
            <div className="flex items-center gap-4">
              {isOnDashboard ? (
                <Link href="/upload-file">
                  <Button className="rounded-full gap-2 shadow-sm">
                    <FileUp className="w-4 h-4" />
                    Upload File
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className="rounded-full gap-2 border-primary/20 hover:bg-primary/5"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
              )}
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox:
                      "h-9 w-9 border-2 border-primary/20 hover:border-primary transition-all shadow-sm",
                  },
                }}
              />
            </div>
          </Show>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex gap-2 items-center">
          {/* {isOnDashboard && (
            <Link href="/upload-file">
              <Button size="sm" className="rounded-full gap-1 px-3 h-8 text-xs">
                <FileUp className="h-3.5 w-3.5" />
                Upload
              </Button>
            </Link>
          )} */}
          <ToggleTheme />
          <Show when={"signed-in"}>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox:
                    "h-9 w-9 border-2 border-primary/20 hover:border-primary transition-all shadow-sm",
                },
              }}
            />
          </Show>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1 hover:bg-muted rounded-lg transition-colors ml-1"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-3 bg-background/95 backdrop-blur-md rounded-b-2xl">
          <Show when={"signed-out"}>
            <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full rounded-xl">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full rounded-xl shadow-lg shadow-primary/10">
                Sign Up
              </Button>
            </Link>
          </Show>

          <Show when={"signed-in"}>
            {isOnDashboard ? (
              <Link
                href="/upload-file"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-xl hover:bg-primary/5"
                >
                  <FileUp className="w-4 h-4" />
                  Upload File
                </Button>
              </Link>
            ) : (
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-xl hover:bg-primary/5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
            )}
          </Show>
        </div>
      )}
    </header>
  );
}
