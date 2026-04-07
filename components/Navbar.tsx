"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Show, useClerk, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { CloudUpload, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ToggleTheme } from "./ToggleTheme";

export default function Navbar() {
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const router = useRouter();
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

  const handleSignOut = () => {
    signOut(() => router.push("/"));
  };

  const initials = user?.firstName?.[0] || user?.username?.[0] || "U";

  if (!isLoaded) {
    // skeleteon
    return null;
  }

  return (
    <header
      className={`border-b sticky top-0 z-50 transition-shadow ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container mx-auto py-3 px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <CloudUpload className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Droply</h1>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-4 items-center">
          <ToggleTheme />
          {/* {!isSignedIn && ( */}
          {/* <> */}
          <Show when={"signed-out"}>
            <div className="flex gap-2">
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </div>
          </Show>
          {/* </> */}
          {/* )} */}

          {/* {isSignedIn && ( */}
          <Show when={"signed-in"}>
            <div className="flex items-center gap-4">
              {!isOnDashboard && (
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.imageUrl} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user?.firstName || "User"}
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard?tab=profile")}
                  >
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Show>
          {/* )} */}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex gap-2 items-center">
          <ToggleTheme />
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
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
        <div className="md:hidden border-t p-4 space-y-3">
          <Show when={"signed-out"}>
            <Link href="/sign-in">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="w-full">Sign Up</Button>
            </Link>
          </Show>

          <Show when={"signed-in"}>
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full">
                Dashboard
              </Button>
            </Link>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </Show>
        </div>
      )}
    </header>
  );
}
