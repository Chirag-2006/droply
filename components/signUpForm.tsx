"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs";

// zod custom schema
import { signUpSchema, SignUpSchemaType } from "../zod/signUpSchema";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";

export function SignUpForm() {
  //states
  const [varifying, setVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // redirect
  const router = useRouter();

  // Clerk
  const { signUp, fetchStatus } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpSchemaType) => {
    if (fetchStatus === "fetching" || !signUp) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const result = await signUp.password({
        emailAddress: data.email,
        password: data.password,
      });

      console.log("Form Data:", data);
      console.log("Signup result:", result);
      console.log("SignUp status:", signUp.status);

      const emailResult = await signUp.verifications.sendEmailCode();
      console.log("Email sent result:", emailResult);
      setVerifying(true);

      // simulate API delay
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      // reset();
    } catch (error: any) {
      console.error("signup error", error);
      setAuthError(
        error.errors?.[0].message ||
          "An error occurred during the sign-up process.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (fetchStatus === "fetching" || !signUp) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const result = await signUp.verifications.verifyEmailCode({
        code: verificationCode,
      });

      console.log("Verification result:", result);
      console.log("Signup status:", signUp.status);
      if (result.error) {
        console.log(
          "Error in Result in handleVerificationSubmit",
          result.error,
        );
        setVerificationError(result.error.message || "Verification Error");
      }

      if (signUp.status === "complete") {
        await signUp.finalize({
          // Redirect the user to the home page after signing up
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
        // router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Verification error", error);
      setVerificationError(
        error.errors?.[0].message ||
          "An error occurred during the verification process.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (varifying) {
    return (
      <Card className="w-full max-w-md border bg-muted/30 shadow-xl">
        <CardHeader className="flex flex-col gap-1 items-center pb-2">
          <h1 className="text-2xl font-bold">Verify Your Email</h1>
          <p className="text-muted-foreground text-center">
            We&apos;ve sent a verification code to your email
          </p>
        </CardHeader>

        <Separator />

        <CardContent className="py-6">
          {verificationError && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{verificationError}</p>
            </div>
          )}

          <form onSubmit={handleVerificationSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                type="text"
                placeholder="Enter the 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                autoFocus
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive a code?{" "}
              <button
                onClick={async () => {
                  if (signUp) {
                    await signUp.verifications.sendEmailCode();
                  }
                }}
                className="text-primary hover:underline font-medium"
                type="button"
              >
                Resend code
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="w-full max-w-md border bg-muted/30 text-foreground shadow-xl">
      <CardHeader className="flex flex-col gap-1 items-center pb-2">
        <h1 className="text-2xl font-bold">Create Your Account</h1>
        <p className="text-muted-foreground text-center">
          Sign up to start managing your images securely
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
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                className="pl-9"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
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

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="passwordConfirmation">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="passwordConfirmation"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-9 pr-10"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                className="absolute right-2 top-2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
            <p className="text-sm text-muted-foreground">
              By signing up, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>

          <div
            id="clerk-captcha"
            data-cl-theme="dark"
            data-cl-size="flexible"
            data-cl-language="en"
          />

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-center py-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
