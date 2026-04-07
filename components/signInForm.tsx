"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@clerk/nextjs";

// zod custom schema
import { signInSchem, SignInSchemaType } from "@/zod/signInSchema";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import Link from "next/link";

export function SignInForm() {
  // states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // signIn
  const { signIn, fetchStatus } = useSignIn();

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchem),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (data: SignInSchemaType) => {
    if (fetchStatus === "fetching" || !signIn) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const { error } = await signIn.password({
        identifier: data.identifier,
        password: data.password,
      });

      if (error) {
        setAuthError(error.message);
        console.error("Sign-in API error:", error);
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            // Handle session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }

            // If no session tasks, navigate the signed-in user to the home page
            const url = decorateUrl("/dashboard");
            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.push(url);
            }
          },
        });
      } else {
        console.error("Sign-in attempt not complete:", signIn);
        setAuthError("Sign-in attempt not complete.");
      }
    } catch (error: any) {
      console.error("Sign-in error:", error.errors?.[0].message);
      setAuthError(
        error.errors?.[0].message || "An error occurred. during sign-in.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md border bg-muted/30 shadow-xl">
      <CardHeader className="flex flex-col gap-1 items-center pb-2">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground text-center">
          Sign in to access your secure cloud storage
        </p>
      </CardHeader>

      <Separator />

      <CardContent className="py-6">
        {authError && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="identifier">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="identifier"
                type="email"
                placeholder="your.email@example.com"
                className="pl-9"
                {...register("identifier")}
              />
            </div>
            {errors.identifier && (
              <p className="text-sm text-destructive">
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-9 pr-10"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute right-2 top-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-center py-4">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

